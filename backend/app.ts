import dotenv from "dotenv";
dotenv.config();
import process from "process";
import path from "path";
import express from "express";
import mysql from "mysql2/promise";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 8000;

//app.use(express.json());
//app.set("view engine", "ejs");

// fe static files
app.use(express.static("frontend/dist"));

// serve HTML files for MPA routes
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "../frontend/dist/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(process.cwd(), "../frontend/dist/about.html"));
});

//app.set("view engine", "hbs");
//app.set("views", path.join(process.cwd(), "../frontend/views"));

app.use(express.json());
app.use(morgan("dev"));

const conn = await mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB,
});

try {
  const [results, fields] = await conn.query(
    'SELECT * FROM `student` WHERE `name` = "Casey"',
  );
  console.log({ results }); // results contains rows returned by server
  console.log({ fields }); // fields contains extra meta data about results, if available
} catch (err) {
  console.log(err);
}

app.use("/api/test", (_req, res) => {
  res.send("Hello, World!");
});

// server
app.listen(port, () => {
  console.log(`----- Server is running on port ${port} -----`);
});
