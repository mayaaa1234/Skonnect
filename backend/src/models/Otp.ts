// import mkCustomError from "errors/CustomError.ts";
import mkCustomError from "errors/CustomError.ts";
import pool from "../db/pool.ts";
import { RowDataPacket } from "mysql2";
import nodemailer from "nodemailer";

export interface OtpRecord extends RowDataPacket {
  // id: number;
  // otp: string;
  attempts_left: number; // defaults to 5 in the DB
  created_at: Date;
  expires_at: Date;
}

export interface OtpRecordAndResendStatus extends OtpRecord {
  cooldown: Date | null;
  request_count: number;
}

type OtpVerifyResult = {
  status: "valid" | "expired" | "incorrect" | "noAttemptsLeft";
  msg: string;
};

export default class Otp {
  static generateNumericOTP(length = 6): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      "",
    );
  }

  static async send(email: string): Promise<OtpRecord> {
    const otp = this.generateNumericOTP();
    // console.log("otp sent: ", otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // couple of validations before sending otp
    await this.manageOTPResendRequests(email);

    await pool.execute(
      `INSERT INTO otps (email, attempts_left, otp, expires_at)
   VALUES (?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE
     otp = VALUES(otp),
     attempts_left = 5,
     expires_at = VALUES(expires_at)`,
      [email, 5, otp, expiresAt],
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SKONNECT_EMAIL,
        pass: process.env.SKONNECT_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.SKONNECT_EMAIL,
        to: email,
        subject: "OTP Verification",
        html: `<h3>Your OTP is: <strong>${otp}</strong><br>Use it before it expires.</h3>`,
      });
    } catch (error) {
      console.error("Failed to send email", error);
    }

    const [otpRecord] = await pool.execute<OtpRecord[]>(
      `SELECT otp, attempts_left, created_at, expires_at FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1`,
      [email],
    );

    return otpRecord[0];
  }

  static async verify(email: string, otp: string): Promise<OtpVerifyResult> {
    const [rows] = await pool.execute<OtpRecord[]>(
      "SELECT * FROM otps WHERE email = ?",
      [email],
    );

    const record = rows[0] ?? null;
    // gurard check if for some reason wrong email or no otp record
    if (!record)
      return { status: "incorrect", msg: "wrong email or no OTP record found" };

    if (record.expires_at < new Date())
      return {
        status: "expired",
        msg: "OTP expired, please request a new OTP",
      };

    if (record.otp !== otp)
      return { status: "incorrect", msg: "wrong OTP, please try again" };
    if (record.attempts_left <= 0)
      return {
        status: "noAttemptsLeft",
        msg: "maximum attempts reached, please request a new OTP",
      };

    return { status: "valid", msg: "OTP verficatin successful" };
  }

  static async getOtpRecordByOtp(otp?: string): Promise<OtpRecord> {
    const [otpRecord] = await pool.execute<OtpRecord[]>(
      `SELECT otp, attempts_left, created_at, expires_at FROM otps WHERE otp = ? ORDER BY created_at DESC LIMIT 1`,
      [otp],
    );

    return otpRecord[0];
  }

  static async getOtpRecordByEmail(
    email: string,
  ): Promise<OtpRecordAndResendStatus | null> {
    const [rows] = await pool.execute<OtpRecordAndResendStatus[]>(
      `SELECT 
       o.otp, 
       o.attempts_left, 
       o.created_at, 
       o.expires_at,
       r.cooldown,
       r.request_count
     FROM otps o
     LEFT JOIN otp_resend_requests r ON o.email = r.email
     WHERE o.email = ?
     ORDER BY o.created_at DESC
     LIMIT 1`,
      [email],
    );
    return rows[0] ?? null;
  }

  static async deleteOtp(email: string, otp: string): Promise<void> {
    await pool.execute(`DELETE FROM otps WHERE otp = ?`, [otp]);
    await pool.execute(`DELETE FROM otp_resend_requests WHERE email = ?`, [
      email,
    ]);
  }

  static async decrementAttempts(email: string): Promise<number> {
    const [updateResult] = await pool.execute(
      `UPDATE otps 
   SET attempts_left = GREATEST(attempts_left - 1, 0) 
   WHERE email = ?`,
      [email],
    );

    if ((updateResult as any).affectedRows === 0) {
      throw mkCustomError({
        status: 404,
        msg: "OTP not found for decrementing attempts",
      });
    }

    const [rows] = await pool.execute<OtpRecord[]>(
      `SELECT attempts_left FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1`,
      [email],
    );

    return rows[0].attempts_left;
  }

  private static async manageOTPResendRequests(email: string) {
    // Fetch current state otp_resend_request table
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT cooldown, last_requested_at, request_count FROM otp_resend_requests WHERE email = ?`,
      [email],
    );
    // console.log("otp resend state: ", rows);
    const record = rows[0];

    // If cooldown active, throw error
    if (record?.cooldown) {
      const cooldownDate = new Date(record.cooldown);
      const now = new Date();

      if (cooldownDate > now) {
        // STILL IN COOLDOWN → throw
        throw mkCustomError({
          status: 401,
          errs: {
            status: "cooldown",
            cooldownTime: record.cooldown,
          },
        });
      }

      // If the cooldown has expired (cooldownDate <= now), clear it
      await pool.execute(
        `UPDATE otp_resend_requests 
          SET cooldown = NULL, request_count = 0 
        WHERE email = ?`,
        [email],
      );
    }

    if (!record) {
      // Insert first request
      await pool.execute(
        `INSERT INTO otp_resend_requests (email, request_count, last_requested_at) VALUES (?, 1, NOW())`,
        [email],
      );
      return;
    }

    // If 3rd request, apply cooldown and reset
    if (record.request_count + 1 >= 3) {
      // console.log("setting cooldown hit");
      await pool.execute(
        `UPDATE otp_resend_requests SET cooldown = NOW() + INTERVAL 10 MINUTE, request_count = 0 WHERE email = ? AND cooldown IS NULL`,
        [email],
      );
      return;
    }

    // else increment safely
    await pool.execute(
      `UPDATE otp_resend_requests 
     SET request_count = request_count + 1, last_requested_at = NOW()
     WHERE email = ?`,
      [email],
    );
  }
}
