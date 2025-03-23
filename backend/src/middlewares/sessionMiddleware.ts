import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import type { Request, Response, NextFunction } from "express";

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "secret",
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
  next();
};
