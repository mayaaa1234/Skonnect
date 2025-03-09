import mysql from "mysql2/promise";
//const { ResultSetHeader } = mysql;
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
  private id: number; // maybe useful later
  username: string;
  email: string;
  password: string;
  private confirmPassword?: string;
  isAdmin: boolean = false;
  //private _confirmPassword?: string;

  constructor(
    username: string,
    email: string,
    password: string,
    confirmPassword?: string,
    isAdmin?,
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.isAdmin = isAdmin ?? false;
  }

  // findemail,confirmpass, comparepass
  validate = () => {
    const errors: string[] = []; // aggregate err msg's

    if (!this.username || this.username.length < 4) {
      errors.push("Name must be at least 4 characters long.");
    }

    if (!this.email || !emailRegex.test(this.email)) {
      errors.push("Email is not valid");
    }

    if (!this.password || this.password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (this) if (!this) return errors.length > 0 ? errors : null;
  };

  save = async () => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);

    //const [result] = await pool.execute<ResultSetHeader>(
    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)`,
      [this.username, this.email, hashedPassword, this.isAdmin],
    );

    console.log({ result });
    //this.id = result.insertId;
  };

  //static async findByEmail(email: string): Promise<UserSchema | null> {
  //  //const [rows] = await pool.execute<(UserSchema & RowDataPacket)[]>(
  //  const [rows] = await pool.execute(
  //    "SELECT * FROM users WHERE email = ?",
  //    [email],
  //  );
  //
  //  return rows.length ? rows[0] : null;
  //}

  //static async getAll(): Promise<UserSchema[]> {
  //  const [rows] = await pool.execute<(UserSchema & RowDataPacket)[]>(
  //    "SELECT * FROM users",
  //  );
  //
  //  return rows;
  //}

  //static async validatePassword(
  //  email: string,
  //  plainPassword: string,
  //): Promise<boolean> {
  //  const user = await User.findByEmail(email);
  //  if (!user) return false;
  //  return bcrypt.compareSync(plainPassword, user.password);
  //}
}
