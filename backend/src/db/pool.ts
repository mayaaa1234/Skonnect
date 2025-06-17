import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool: Pool;

if (process.env.NODE_ENV === "development") {
  pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
    waitForConnections: true,
    connectionLimit: 15,
    maxIdle: 10, // Maximum number of idle connections
    idleTimeout: 60000, // 60kms = 1minute
    queueLimit: 0, // unli
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true,
  });
} else {
  // prod
  pool = mysql.createPool({
    uri: process.env.MYSQL_PUBLIC_URL as string, // railway's url
    waitForConnections: true,
    connectionLimit: 15,
    maxIdle: 10, // Maximum number of idle connections
    idleTimeout: 60000, // 60kms = 1minute
    queueLimit: 0, // unli
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true,
  });
}

export default pool!;
