import process from "process";
import path from "path";
import express from "express";
import mysql from "mysql2/promise";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8000;
const publicDir = path.join(process.cwd(), "frontend/public");

// INFO : development-mode only middleware and socket
if (process.env.NODE_ENV === "development") {
  const { default: devModeMiddleware } = await import(
    "./middlewares/devModeMiddleware.ts"
  );
  devModeMiddleware(app);
}

// NOTE : src attr path's given to elems from ejs files should be relative to this path
app.use(express.static(publicDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("view cache", false);
app.set("views", path.join(process.cwd(), "frontend/views"));

// serve ejs files for diff routes
app.get("/", (_req, res) => {
  res.render("index", { title: "" });
});

app.use("/api/test", (_req, res) => {
  res.send("Hello, World!");
});

//app.get("/about", (_req, res) => {
//  res.sendFile(path.join(process.cwd(), "../frontend/dist/about.html"));
//});

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

// this works, just comment out for now
//try {
//  const [results, fields] = await conn.query(
//    'SELECT * FROM `student` WHERE `name` = "Casey"',
//  );
//  console.log({ results }); // results contains rows returned by server
//  console.log({ fields }); // fields contains extra meta data about results, if available
//} catch (err) {
//  console.log(err);
//}

// server
app.listen(port, () => {
  console.log(`----- Server is running on port ${port} -----`);
});
