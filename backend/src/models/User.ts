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

  signupValidation = async (): Promise<void> => {
    const errs: { [key: string]: string } = {};

    if (!this.username || this.username.length < 4)
      errs.username = "username must be at least 4 characters long.";

    if (!this.email || !emailRegex.test(this.email))
      errs.email = "email is not valid.";

    if (!this.password || this.password.length < 8)
      errs.password = "password must be at least 8 characters long.";

    if (this._confirmPassword && this._confirmPassword !== this.password)
      errs.confirmPassword = "Password does not match.";

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS emailExists`,
      [this.email],
    );
    const emailExists = rows[0].emailExists;
    if (emailExists) {
      errs.email = "email already in use.";
    }

    //const [rows] = await pool.execute<RowDataPacket[]>(
    //  `SELECT EXISTS (SELECT * FROM users WHERE email = ?)`,
    //  [this.email],
    //);
    //if (rows.length !== 0) {
    //  errors.email = "Email already in use.";
    //}

    console.log({ errs });
    if (Object.keys(errs).length > 0) {
      throw mkCustomError({ status: 400, errs });
    }
  };

  //SQL CONSTRAINTS: both username and email is unique
  // FLOW: (1) if email is used as a login method, check if valid email using regex and then check if it exists then check if pass is correct, skipping the username validation.
  // (2) if username is used as a login method do the same validation and skip the email validation
  // NOTE, unlike signup which aggregates and sends all err's at once so that the user can instantly know which input is wrong based on contstraints.
  // login on the other hand in practice is supposed to be a sequential process and more of a checking if exists rather than checking if user is conforming to contstraints. Thus, the code:
  loginValidation = async (): Promise<void> => {
    if (this.email && this.username)
      throw mkCustomError({
        status: 400,
        msg: "provide only either email or username.",
      });
    //return { err: "Provide only either email or username." };

    //INFO: unlike signup, login's logic and especially considering ux, sends
    // only one err at a time. So this will only send a string unlike the signup
    // that sends an json obj.

    console.log("login info:", this.email, this.username);

    //INFO: if user used an email to login
    if (this.email && !this.username) {
      if (!emailRegex.test(this.email))
        throw mkCustomError({
          status: 400,
          errs: {
            email: "email is not valid.",
          },
        });

      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM users WHERE email = ?`,
        [this.email],
      );
      console.log({ rows });

      if (rows.length === 0) {
        throw mkCustomError({
          status: 400,
          errs: {
            email: "email does not exist.",
          },
        });
      }

      const { id, username, password } = rows[0];

      const isMatch = await bcrypt.compare(this.password, password);

      throw mkCustomError({
        status: 404,
        errs: {
          password: "wrong password, please try again.",
        },
      });
      // will be sent to the client
      this.id = id;
      this.username = username;

      //return null;
    }

    //INFO: if user used a username to login
    if (this.username && !this.email) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM users WHERE username = ?`,
        [this.username],
      );
      //console.log({ rows });

      if (rows.length === 0) {
        throw mkCustomError({
          status: 400,
          errs: {
            username: "username does not exist.",
          },
        });
      }

      const { id, username, email, password, isAdmin } = rows[0];

      const isMatch = await bcrypt.compare(this.password, password);
      if (!isMatch) {
        throw mkCustomError({
          status: 400,
          errs: {
            password: "wrong password, please try again.",
          },
        });
      }

      // will be sent to the client
      //console.log("LOGIN VALIDATION INFO :", { id, username, email, isAdmin });
      this.id = id;
      this.username = username;
      this.email = email;
      this.isAdmin = isAdmin;

      //return null;
    }
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

    throw mkCustomError({
      status: 500,
      msg: "An error occurred while saving the user to the database.",
    });
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
