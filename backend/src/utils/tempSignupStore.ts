import pool from "../db/pool.ts";
import mkCustomError from "../errors/CustomError.ts";
import type {
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

export async function setTempSignupData(username: string, email: string, password: string, isAdmin: boolean = false, otp: string): Promise<number> {
  const [rows] = await pool.execute<ResultSetHeader>(
    `INSERT INTO temp_signup_data (username, email, password, is_admin, otp)
   VALUES (?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE
     username = VALUES(username),
     password = VALUES(password),
     is_admin = VALUES(is_admin),
     otp = VALUES(otp)`,
    [username, email, password, isAdmin, otp]
  );
  if (rows) return rows.insertId

  throw mkCustomError({
    status: 500,
    msg: "An error occurred while inserting temp signup data to DB.",
  });
}

export async function getTempSignupData(email: string): Promise<RowDataPacket> {
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM temp_signup_data where email = ?", [email])

  if (rows.length > 0) return rows[0];

  throw mkCustomError({
    status: 404,
    msg: "No temp signup data found for the given email.",
  });
}

export async function deleteTempSignupData(email: string): Promise<number> {
  const [rows] = await pool.execute<ResultSetHeader>("DELETE FROM temp_signup_data where email = ?", [email])

  if (rows.affectedRows > 0) return rows.affectedRows

  throw mkCustomError({
    status: 500,
    msg: "An error occured while deleting temp from DB.",
  });
}
