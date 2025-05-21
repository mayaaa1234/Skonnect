import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();

// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log("MYSQLHOST:", process.env.MYSQLHOST);
// console.log("MYSQLUSER:", process.env.MYSQLUSER);
// console.log("MYSQLDATABASE:", process.env.MYSQL_DATABASE);
// console.log("MYSQLPORT:", process.env.MYSQLPORT);

console.log("MYSQLPORT:", process.env.MYSQL_PUBLIC_URL);

const connectDB = () => {
  if (process.env.NODE_ENV === "development") {
    return mysql.createConnection({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASS,
      database: process.env.SQL_DB,
      multipleStatements: true,
    });
  }
  else {
    return mysql.createConnection(process.env.MYSQL_PUBLIC_URL as string);
  }
};

export default connectDB;

