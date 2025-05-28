import mysql from "mysql2/promise";

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

