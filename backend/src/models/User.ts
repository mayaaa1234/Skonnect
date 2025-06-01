import type {
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

import pool from "../db/pool.ts";
import bcrypt from "bcrypt";
import mkCustomError from "../errors/CustomError.ts";


const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

export default class User {
  static async signupValidation(
    username: string,
    email: string,
    password: string,
    confirmPassword?: string,
  ): Promise<void> {
    const errs: { [key: string]: string } = {};

    if (!username || username.length < 4)
      errs.username = "username must be at least 4 characters long.";

    if (!email || !emailRegex.test(email))
      errs.email = "email is not valid.";

    if (!password || password.length < 8)
      errs.password = "password must be at least 8 characters long.";

    if (confirmPassword && confirmPassword !== password)
      errs.confirmPassword = "Password does not match.";

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT email, username FROM users WHERE email = ? OR username = ?`,
      [email, username],
    );

    if (rows.length !== 0) {
      const { email: existingEmail, username: existingUsername } = rows[0];
      if (existingEmail === email) errs.email = "email is already taken.";
      if (existingUsername === username)
        errs.username = "username is already taken.";
    }

    console.log({ errs });
    if (Object.keys(errs).length > 0) {
      throw mkCustomError({ status: 400, errs });
    }
  }

  static async loginValidation(
    credential: string,
    password: string,
  ): Promise<{ id: number; username: string; email: string; isAdmin: boolean }> {
    const isEmail = emailRegex.test(credential);
    if (!credential)
      throw mkCustomError({ status: 400, msg: "provide username or email." });

    const field = isEmail ? "email" : "username";
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM users WHERE ${field} = ?`,
      [credential],
    );
    console.log({ rows });

    if (rows.length === 0) {
      throw mkCustomError({
        status: 400,
        errs: { [field]: `${field} does not exist.` },
      });
    }

    const { id, username, email, password: hash, isAdmin } = rows[0];
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      throw mkCustomError({
        status: 400,
        errs: { password: "wrong password, please try again." },
      });
    }

    return { id, username, email, isAdmin };
  }

  static async saveDB(
    username: string,
    email: string,
    password: string,
    isAdmin: boolean = false,
  ): Promise<number> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [rows] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, isAdmin],
    );

    if (rows) {
      console.log("User Created Successfully:", { rows });
      return rows.insertId;
    }

    throw mkCustomError({
      status: 500,
      msg: "An error occurred while saving the user to the database.",
    });
  }


  static async find(
    filter?: Partial<{ id: number; username: string; email: string; isAdmin: boolean }>,
  ): Promise<RowDataPacket[]> {
    let query = "SELECT * FROM users";
    const values: any[] = [];

    if (filter && Object.keys(filter).length > 0) {
      const conditions = Object.keys(filter).map((key) => {
        values.push(filter[key as keyof typeof filter]);
        return `${key} = ?`;
      });

      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, values);
    console.log("find result: ", rows);
    return rows;
  }

  static async findById(id: number): Promise<RowDataPacket | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    console.log("findById rows[0]: ", rows[0]);
    return rows.length ? rows[0] : null;
  }
}
