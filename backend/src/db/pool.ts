import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Define `pool` with an explicit type
let pool: Pool;

if (process.env.NODE_ENV === "production") {
  pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // Maximum number of idle connections
    idleTimeout: 60000, // 60kms = 1minute
    queueLimit: 0, // unli
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
} else {
  pool = mysql.createPool({
    uri: process.env.MYSQL_PUBLIC_URL as string,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // Maximum number of idle connections
    idleTimeout: 60000, // 60kms = 1minute
    queueLimit: 0, // unli
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });
}

// prod

export default pool!;
