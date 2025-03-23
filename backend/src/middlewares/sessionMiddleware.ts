//import dotenv from "dotenv";
//dotenv.config();
//import session from "express-session";
////import flash from "express-flash";
//import type { Request, Response, NextFunction } from "express";
//
//// Configure the session middleware
//export const sessionMiddleware = session({
//  secret: String(process.env.SESSION_SECRET) || "default",
//  resave: true,
//  saveUninitialized: true,
//  cookie: { secure: process.env.NODE_ENV === "production" },
//});
//
//// Middleware to attach session data to locals for EJS
//export const attachSessionData = (
//  req: Request,
//  res: Response,
//  next: NextFunction,
//) => {
//  res.locals.user = req.session.user || null;
//  console.log("local user: ", res.locals.user);
//  //res.locals.success_msg = req.flash("success_msg");
//  //res.locals.error_msg = req.flash("error_msg");
//  next();
//};
//

// Export an array of middleware so you can use them all together
//export const foosess = [sessionMiddleware, flash(), attachSessionData];
import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import type { Request, Response, NextFunction } from "express";

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
  },
  //store: // Add production store like Redis here
});

export const attachSessionData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.user = req.session.user || null;
  console.log("Session data:", req.session);
  console.log("Local user:", res.locals.user);
  next();
};
