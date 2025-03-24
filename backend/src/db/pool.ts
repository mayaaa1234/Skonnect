import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const isDev = process.env.NODE_ENV === "development";

const pool = mysql.createPool({
  host: isDev ? process.env.SQL_HOST : process.env.MYSQLHOST,
  user: isDev ? process.env.SQL_USER : process.env.MYSQLUSER,
  password: isDev ? process.env.SQL_PASS : process.env.MYSQLPASSWORD,
  database: isDev ? process.env.SQL_DB : process.env.MYSQLDATABASE,
  port: isDev ? undefined : Number(process.env.MYSQLPORT),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // Maximum number of idle connections
  idleTimeout: 60000, // 60s = 1 minute
  queueLimit: 0, // Unlimited queue
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
