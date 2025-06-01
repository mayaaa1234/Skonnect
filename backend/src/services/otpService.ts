import Otp, { OtpRecord } from "../models/Otp.ts";
import mkCustomError from "../errors/CustomError.ts";

const otpRequest = async (email: string): Promise<OtpRecord> => {
  if (!email) {
    console.log({ email });
    throw mkCustomError({ status: 404, msg: "email is empty" });
  }

  const otpRecord = await Otp.send(email);
  if (!otpRecord)
    throw mkCustomError({ status: 500, msg: "error sending otp" });

  return otpRecord;
};

const otpVerify = async (email: string, otp: string): Promise<void> => {
  if (!otp) {
    console.log({ otp });
    throw mkCustomError({ status: 404, msg: "otp is empty" });
  }

  const result = await Otp.verify(email, otp);
  const { status, msg } = result;

  if (status === "valid") {
    await Otp.deleteOtp(email, otp);
    return;
  }

  if (status === "incorrect") {
    await Otp.decrementAttempts(email);
    const otpRecord = await Otp.getOtpRecordByEmail(email);
    if (!otpRecord)
      throw mkCustomError({
        status: 404,
        msg: "OTP record by email not found.",
      });
    const { id, attempts_left, created_at, expires_at } = otpRecord;

    throw mkCustomError({
      status: 401,
      errs: {
        // id: `${id}`,
        status: "incorrect",
        msg: `${msg}`,
        attempts_left: `${attempts_left}`,
        created_at: `${created_at}`,
        expires_at: `${expires_at}`,
      },
    });
  }

  if (status === "noAttemptsLeft") {
    const otpRecord = await Otp.getOtpRecordByEmail(email);
    if (!otpRecord)
      throw mkCustomError({
        status: 404,
        msg: "otp record by email not found.",
      });
    const { id, attempts_left, created_at, expires_at } = otpRecord;

    await Otp.deleteOtp(email, otp);

    throw mkCustomError({
      status: 401,
      errs: {
        // id: `${id}`,
        status: "noAttemptsLeft",
        msg: `${msg}`,
        attempts_left: `${attempts_left}`,
        created_at: `${created_at}`,
        expires_at: `${expires_at}`,
      },
    });
  }
  if (status === "expired") {
    throw mkCustomError({
      status: 401,
      errs: {
        // id: `${id}`,
        status: "expired",
        msg: `${msg}`,
      },
    });
  }
};

export { otpRequest, otpVerify };

// update otps on resend, invalidating the prev one
// INSERT INTO otps(email, otp, expires_at)
// VALUES('test@example.com', '123456', NOW() + INTERVAL 10 MINUTE)
// ON DUPLICATE KEY UPDATE
// otp = VALUES(otp),
//   expires_at = VALUES(expires_at),
//   attempts_left = 5,
//   created_at = CURRENT_TIMESTAMP;
