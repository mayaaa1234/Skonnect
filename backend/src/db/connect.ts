import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE);
console.log("MYSQLPORT:", process.env.MYSQLPORT);

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
