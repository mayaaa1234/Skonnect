import type {
  ResultSetHeader,
  RowDataPacket,
  FieldPacket,
} from "mysql2/promise";

import pool from "../db/pool.ts";
import bcrypt from "bcrypt";
import mkCustomError from "../errors/CustomError.ts";

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

  signupValidation = async (): Promise<{ [key: string]: string } | null> => {
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

    //const [rows] = await pool.execute<RowDataPacket[]>(
    //  `SELECT EXISTS (SELECT * FROM users WHERE email = ?)`,
    //  [this.email],
    //);
    //if (rows.length !== 0) {
    //  errors.email = "Email already in use.";
    //}

    if (Object.keys(errors).length > 0) {
      //throw new Error(JSON.stringify(errors)); // send errors as JSON
      return errors;
    } else {
      return null;
    }

    //catch:
    throw mkCustomError("Signup failed, please try again.", 500);
  };

  //SQL CONSTRAINTS: both username and email is unique
  // FLOW: (1) if email is used as a login method, check if valid email using regex and then check if it exists then check if pass is correct, skipping the username validation.
  // (2) if username is used as a login method do the same validation and skip the email validation
  // NOTE, unlike signup which aggregates and sends all err's at once so that the user can instantly know which input is wrong based on contstraints.
  // login on the other hand in practice is supposed to be a sequential process and more of a checking if exists rather than checking if conforming to contstraints thus the code:

  // WARN: i dont know yet if i should include the isAdmin in setting it to this.isAdmin or should i just send it throuhgh jwt (security reasons)
  loginValidation = async (): Promise<{ [key: string]: string } | null> => {
    if (this.email && this.username)
      return { err: "Provide only either email or username." };

    console.log("login info:", this.email, this.username);

    //INFO: if user used an email to login
    if (this.email && !this.username) {
      if (!emailRegex.test(this.email))
        return { notValid: "Email is not valid." };

      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM users WHERE email = ?`,
        [this.email],
      );
      console.log({ rows });

      if (rows.length === 0) {
        return { emailNotFound: "Email not found." };
      }

      const { id, username, password } = rows[0];

      const isMatch = await bcrypt.compare(this.password, password);
      if (!isMatch) return { wrongPassword: "Wrong Password, Try again." };

      // will be sent to the client
      this.id = id;
      this.username = username;

      return null;
    }

    //INFO: if user used a username to login
    if (this.username && !this.email) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM users WHERE username = ?`,
        [this.username],
      );
      //console.log({ rows });

      if (rows.length === 0) {
        return { userNotFound: "Username not found." };
      }

      const { id, username, email, password, isAdmin } = rows[0];

      const isMatch = await bcrypt.compare(this.password, password);
      if (!isMatch) return { wrongPassword: "Wrong Password, Try again." };

      // will be sent to the client
      //console.log("LOGIN VALIDATION INFO :", { id, username, email, isAdmin });
      this.id = id;
      this.username = username;
      this.email = email;
      this.isAdmin = isAdmin;

      return null;
    }

    //catch block
    throw mkCustomError("Login failed, please try again.", 500);
  };

  saveDB = async () => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);

    const [rows] = await pool.execute<ResultSetHeader>(
      //const [rows] = await pool.execute(
      `INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)`,
      [this.username, this.email, hashedPassword, this.isAdmin],
    );

    if (rows) {
      console.log("User Created Successfully:", { rows });
      // get the inserted id from auto increment and put it in this id
      // so than it can then be sent into client
      this.id = rows.insertId;
      return;
    }

    throw mkCustomError(
      "An error occurred while saving the user to the database.",
      500,
    );
  };

  static findById = async (id: number) => {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    console.log("findById rows[0]: ", rows[0]);
    return rows.length ? rows[0] : null;
  };
}
