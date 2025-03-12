import mysql from "mysql2/promise";
import type {
  ResultSetHeader,
  RowDataPacket,
  FieldPacket,
} from "mysql2/promise";

import pool from "../db/pool.ts";
import bcrypt from "bcrypt";

const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

export default class User {
  id!: number;
  username: string;
  email: string;
  password: string;
  private _confirmPassword: string | undefined;
  isAdmin: boolean;
  //private _confirmPassword?: string;

  constructor(
    username: string,
    email: string,
    password: string,
    _confirmPassword?: string,
    isAdmin: boolean = false,
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this._confirmPassword = _confirmPassword;
    this.isAdmin = isAdmin;
  }

  // TODO: getAllUsers?

  signupValidation = async (): Promise<string | null> => {
    const errors: { [key: string]: string } = {};

    if (!this.username || this.username.length < 4)
      errors.username = "Username must be at least 4 characters long.";

    if (!this.email || !emailRegex.test(this.email))
      errors.email = "Email is not valid.";

    if (!this.password || this.password.length < 8)
      errors.password = "Password must be at least 8 characters long.";

    if (this._confirmPassword && this._confirmPassword !== this.password)
      errors.confirmPassword = "Password does not match.";

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS emailExists`,
      [this.email],
    );
    const emailExists = rows[0].emailExists;
    if (emailExists) {
      errors.email = "Email already in use.";
    }

    if (Object.keys(errors).length > 0) {
      //throw new Error(JSON.stringify(errors)); // send errors as JSON
      return JSON.stringify(errors);
    }
    return null;
  };

  //SQL CONSTRAINTS: both username and email is unique
  // FLOW: (1) if email is used as a login method, check if valid email using regex and then check if it exists then check if pass is correct, skipping the username validation.
  // (2) if username is used as a login method do the same validation and skip the email validation
  // NOTE, unlike signup which aggregates and sends all err's at once so that the user can instantly know which input is wrong based on contstraints.
  // login on the other hand in practice is supposed to be a sequential process and more of a checking if exists rather than checking if conforming to contstraints thus the code:

  // WARN: i dont know yet if i should include the isAdmin in setting it to this.isAdmin or should i just send it throuhgh jwt (securty reasons)
  loginValidation = async () => {
    if (this.email && this.username)
      return "Provide only either email or username.";

    if (this.email && !this.username) {
      if (!emailRegex.test(this.email)) return "Email is not valid.";

      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM users WHERE email = ?`,
        [this.email],
      );
      console.log({ rows });

      if (rows.length === 0) {
        return "Email not found.";
      }

      console.log("passing the valid");

      const { id, username, email, password } = rows[0];

      const isMatch = await bcrypt.compare(this.password, password);
      if (!isMatch) return "Wrong Password, Try again.";

      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
    }

    if (this.username && !this.email) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM users WHERE username = ?`,
        [this.username],
      );

      if (rows.length === 0) {
        return "Username not found.";
      }

      const { id, username, email, password } = rows[0];

      const isMatch = await bcrypt.compare(this.password, password);
      if (!isMatch) return "Wrong Password, Try again.";

      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
    }

    return null;
  };

  saveDB = async () => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);

    const [rows] = await pool.execute<ResultSetHeader>(
      //const [rows] = await pool.execute(
      `INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)`,
      [this.username, this.email, hashedPassword, this.isAdmin],
    );

    console.log({ rows });
    // get the inserted id from auto increment and put it in this id
    // so than it can then be sent into client
    this.id = rows.insertId;
  };
}
