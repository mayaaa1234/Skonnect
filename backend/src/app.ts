import process from "process";
import path from "path";
import express from "express";
import morgan from "morgan";
import connectDB from "./db/connect.ts";
import auth from "./routes/auth.ts";
import pages from "./routes/pages.ts";
import { notFound } from "./middlewares/notFound.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8000;
const publicDir = path.join(process.cwd(), "frontend/public");

// INFO : development-mode only middleware and will be removed on prod
import devMiddleware from "./middlewares/devModeMiddleware.ts";
devMiddleware(app);
//import livereload from "livereload";
//import connectLivereload from "connect-livereload";
//if (process.env.NODE_ENV === "development") {
//  const lrserver = livereload.createServer();
//  lrserver.watch(path.join(process.cwd(), "frontend/public"));
//  lrserver.server.once("connection", () => {
//    setTimeout(() => {
//      lrserver.refresh("/frontend");
//    }, 15);
//  });
//  app.use(connectLivereload());
//
//  const { default: devModeMiddleware } = await import(
//
//    "./middlewares/devModeMiddleware.ts"
//  );
//  devModeMiddleware(app);
//}

// NOTE : src attr path's given to elems from
// ejs files should be relative to this publicDir
app.use(express.static(publicDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//app.set("view cache", false);
app.set("views", path.join(process.cwd(), "frontend/views"));
app.use(morgan("dev"));

// serve ejs files for diff routes
//app.get("/", (_req, res) => {
//  res.render("index", { title: "" });
//});

app.use("/api/v1/auth", auth);
app.use("/", pages);

//errors
app.use(notFound);
app.use(errorHandler);

const server = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}....`);
    });
  } catch (error) {
    console.error(error);
  }
};
server();
