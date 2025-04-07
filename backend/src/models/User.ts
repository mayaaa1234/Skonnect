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
      `SELECT email, username FROM users WHERE email = ? OR username = ?`,
      [this.email, this.username],
    );

    if (rows.length !== 0) {
      //console.log({ rows });
      const { email, username } = rows[0];
      if (email === this.email) errs.email = "email is already taken.";
      if (username === this.username)
        errs.username = "username is already taken.";
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

      if (!this.password || !password) {
        throw new Error("Password or hash missing");
      }

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
      this.id = id;
      this.username = username;
    }

    //INFO: if user used a username to login
    if (this.username && !this.email) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM users WHERE username = ?`,
        [this.username],
      );
      console.log({ rows });

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
      console.log(isMatch);

      //if (!isMatch) console.error("Wrong Password, Try again.");
      if (!isMatch) {
        console.log("wrong pw");
        throw mkCustomError({
          status: 400,
          errs: {
            password: "wrong password, please try again.",
          },
        });
      }

      // will be sent to the client
      //console.log("LOGIN VALIDATION INFORMATION :", { id, username, email, isAdmin });
      this.id = id;
      this.username = username;
      this.email = email;
      this.isAdmin = isAdmin;

      //return null;
    }
  };

  saveDB = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

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

  // TODO: i'll have to study this later on how this works

  static find = async (
    filter?: Partial<{
      id: number;
      username: string;
      email: string;
      isAdmin: boolean;
    }>,
  ): Promise<RowDataPacket[]> => {
    let query = "SELECT * FROM users";
    const values: any[] = [];

    if (filter && Object.keys(filter).length > 0) {
      // Build an array of conditions for each key in the filter
      const conditions = Object.keys(filter).map((key) => {
        values.push(filter[key as keyof typeof filter]);
        return `${key} = ?`;
      });

      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, values);
    console.log("find result: ", rows);
    return rows;
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
