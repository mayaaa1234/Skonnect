import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import type { Request, Response, NextFunction } from "express";
import mkCustomError from "../errors/CustomError.ts";

const redirectAuth = (page: "signup" | "login" | "home" | "/" | "profile") => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.signedCookies.authorization;

    // for these two pages, redirect to home if already authenticated
    if (page === "signup" || page === "login") {
      if (token) {
        try {
          jwt.verify(token, process.env.JWT_SECRET as string);
          return res.redirect(302, "/home"); // redirect to home
        } catch (error) {
          console.log("Invalid token, proceeding to", page);
          return next(); // no redirection i.e proceed normally to req page
        }
      } else {
        console.log("No token, proceeding to", page);
        return next(); // also no redirection if no token
      }
    }

    // for protected routes if no valid token, redirect to landing page.
    if (page === "home" || page === "profile") {
      if (!token) {
        console.log("No Token, redirecting to login.");
        return res.redirect(302, "/");
      }
      try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        return next(); // if valid proceed to protected route
      } catch (error) {
        console.log("Invalid token on protected route, redirecting to login.");
        return res.redirect(302, "/");
      }
    }

    // redirects to homepage if already authed.
    if (page === "/") {
      if (!token) {
        return next(); // do nothing
      }
      try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        return res.redirect(302, "/home");
      } catch (error) {
        return next(); // do nothing
      }
    }
  };
};
export default redirectAuth;
