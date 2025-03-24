import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connectDB = () => {
  const isDev = process.env.NODE_ENV === "development";

  // dev uses local env while prod uses railways env
  return mysql.createConnection({
    host: isDev ? process.env.SQL_HOST : process.env.MYSQLHOST,
    user: isDev ? process.env.SQL_USER : process.env.MYSQLUSER,
    password: isDev ? process.env.SQL_PASS : process.env.MYSQLPASSWORD,
    database: isDev ? process.env.SQL_DB : process.env.MYSQLDATABASE,
    port: isDev ? undefined : Number(process.env.MYSQLPORT),
  });
};

export default connectDB;
