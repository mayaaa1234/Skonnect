// import dotenv from "dotenv";
// dotenv.config();
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import mkCustomError from "../errors/CustomError.ts";

const redirectAuth = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.signedCookies.authorization;
    const currentPath = req.path; // get the requested route

    const signupValidation = req.cookies.signupValid === "true";

    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET as string) as {
          userId: number;
          username: string;
          email: string;
          isAdmin: boolean;
        };
      } catch (error) {
        console.log("Token verification failed:", error);
        //throw mkCustomError("Invalid token", 401);
      }
    }
    res.locals.user = user; // sent to ejs

    // Define route categories
    const authPages = ["/signup", "/login"];
    const protectedPages = [
      "/home",
      "/profile",
      "/annual-budget-allocation",
      "/projects-and-events",
      "/concerns-or-suggestions",
      "/council-information",
    ];

    if (currentPath === "/signup/otp-authentication") {
      if (user) {
        return res.redirect(302, "/home");
      }
      if (!signupValidation) {
        return res.redirect(302, "/signup");
      }
    }

    // Landing page: if authenticated, redirect to home
    if (user && currentPath === "/") {
      return res.redirect(302, "/home");
    }

    // For auth pages: if already authenticated, redirect to home
    if (user && authPages.includes(currentPath)) {
      return res.redirect(302, "/home");
    }

    // For protected pages: if not authenticated, redirect to login
    if (protectedPages.includes(currentPath)) {
      if (!token) {
        return res.redirect(302, "/");
      }

      if (!user) {
        return res.redirect(302, "/login");
      }
    }

    // Default catch: proceed normally
    next();
  };
};

export default redirectAuth;
