import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connectDB = () =>
  mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
  });

export default connectDB;
