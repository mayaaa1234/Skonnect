import mysql from "mysql2/promise";
import ResultSetHeader from "mysql2/promise";

import pool from "../db/pool.ts";
import bcrypt from "bcrypt";

const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

interface UserTable {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export default class User {
  id: number; // maybe useful later
  username: string;
  email: string;
  password: string;
  private _confirmPassword?: string;
  isAdmin: boolean = false;
  //private _confirmPassword?: string;

  constructor(
    username: string,
    email: string,
    password: string,
    _confirmPassword?: string,
    isAdmin?,
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this._confirmPassword = _confirmPassword;
    this.isAdmin = isAdmin ?? false;
  }

  // TODO: getAllUsers?

  validate = async () => {
    const errors: { [key: string]: string } = {};

    if (!this.username || this.username.length < 4)
      errors.username = "Username must be at least 4 characters long.";

    if (!this.email || !emailRegex.test(this.email))
      errors.email = "Email is not valid.";

    if (!this.password || this.password.length < 8)
      errors.password = "Password must be at least 8 characters long.";

    if (this._confirmPassword && this._confirmPassword !== this.password)
      errors.confirmPassword = "Password does not match.";

    const [rows] = await pool.execute(
      `SELECT EXISTS (SELECT 1 FROM users WHERE email = ?)`,
      [this.email],
    );
    const emailExists = Object.values(rows[0])[0]; // returns 1 or 0
    if (emailExists) errors.email = "Email is already taken.";

    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors)); // send errors as JSON
    }
  };

  save = async () => {
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
