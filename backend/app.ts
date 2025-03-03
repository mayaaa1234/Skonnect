import dotenv from "dotenv";
dotenv.config();
import process from "process";
//import path from "path";
import express from "express";
import mysql from "mysql2/promise";
import morgan from "morgan";

const app = express();
//const port = process.env.PORT || 8080;
const port = 3000;

//app.set("view engine", "hbs");
//app.set("views", path.join(process.cwd(), "../frontend/views"));
//app.use(express.static("frontend/dist"));
//
app.use(express.json());
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

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

// server
app.listen(port, () => {
  console.log(`----- Server is running on port ${port} -----`);
});
