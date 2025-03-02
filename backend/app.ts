import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan("dev"));

const connection = await mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB,
});

// simple query:
//try {
//  const [results, fields] = await connection.query(
//    'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
//  );
//
//  console.log(results); // results contains rows returned by server
//  console.log(fields); // fields contains extra meta data about results, if available
//} catch (err) {
//  console.log(err);
//}

// placeholders:
//try {
//  const [results] = await connection.query(
//    "SELECT * FROM `table` WHERE `name` = ? AND `age` > ?",
//    ["Page", 45],
//  );
//
//  console.log(results);
//} catch (err) {
//  console.log(err);
//}

// server
app.get("/", (_req, res) => {
  res.send("Hello, World!");
  console.log("apfjpsdaj");
});

app.listen(port, () => {
  console.log(`----- Server is running on port ${port} -----`);
});
