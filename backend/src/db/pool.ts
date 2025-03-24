import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// INFO: this is to create multiple connections across the project
// without creating a new connection everytime
let pool;
if (process.env.NODE_ENV === "development") {
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
    //jsonStrings: true,
  });
}
// prod
if (process.env.NODE_ENV === "production") {
  pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // Maximum number of idle connections
    idleTimeout: 60000, // 60kms = 1minute
    queueLimit: 0, // unli
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    //jsonStrings: true,
  });
}
export default pool;
