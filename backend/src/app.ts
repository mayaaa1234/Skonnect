import "express-async-errors";
import process from "process";
import path from "path";
import fs from "fs";

import express from "express";
import morgan from "morgan";
import session from "express-session";

import cookieParser from "cookie-parser";
import connectDB from "./db/connect.ts";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port =
  process.env.NODE_ENV === "development"
    ? 3000
    : Number(process.env.PORT) || 3000;
//const dist = path.join(process.cwd(), "frontend/dist");

// INFO : development-mode only middleware and will be removed on prod

import webpackDevMiddleware from "./middlewares/devModeMiddleware.ts";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
if (process.env.NODE_ENV !== "production") {
  const lrserver = livereload.createServer();
  lrserver.watch(path.join(process.cwd(), "frontend/dist"));
  lrserver.watch(path.join(process.cwd(), "frontend/public"));

  lrserver.server.once("connection", () => {
    setTimeout(() => {
      lrserver.refresh("frontend/");
    }, 5);
  });
  app.use(connectLivereload());

  await webpackDevMiddleware(app);
}

// routers
import auth from "./routes/auth.ts";
import pages from "./routes/pages.ts";
import user from "./routes/user.ts";

// middlewares
import { notFound } from "./middlewares/notFound.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
//import {
//  sessionMiddleware,
//  attachSessionData,
//} from "./middlewares/sessionMiddleware.ts";
//
//if (process.env.NODE_ENV === "development") {
//  app.use((_req, res, next) => {
//    res.set("Cache-Control", "no-store");
//    next();
//  });
//}

// NOTE : src attr path's given to elems from
// ejs files should be relative to this publicDir

app.use(express.static(path.join(process.cwd(), "frontend/public")));
app.use(express.static(path.resolve(process.cwd(), "frontend/dist")));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//app.set("view cache", false);
app.set("view options", { rmWhitespace: true });
app.set("views", path.join(process.cwd(), "frontend/views"));
app.use(morgan("dev"));

//app.use(sessionMiddleware);
//app.use(attachSessionData);

//app.use((_req, res, next) => {
//  res.locals.env = process.env.NODE_ENV;
//  console.log("sending locals:", res.locals.env);
//  next();
//});

// routes
app.use("/", pages);
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);

//errors
app.use(notFound);
app.use(errorHandler);

const server = async () => {
  try {
    await connectDB();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}....`);
    });
  } catch (error) {
    console.error(error);
  }
};
server();
