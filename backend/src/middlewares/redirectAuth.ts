import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import type { Request, Response, NextFunction } from "express";

const redirectAuth = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.signedCookies.authorization;
    const currentPath = req.path; // Get the requested route

    // Define route categories
    const authRedirectPages = ["/signup", "/login"];
    const protectedPages = [
      "/home",
      "/profile",
      "/annual-budget-allocation",
      "/projects-and-events",
      "/submit-suggestions",
    ];
    const publicPages = ["/", "/about"];

    if (authRedirectPages.includes(currentPath)) {
      // If authenticated, redirect to home
      if (token) {
        try {
          jwt.verify(token, process.env.JWT_SECRET as string);
          return res.redirect(302, "/home");
        } catch (error) {
          console.log("Invalid token, proceeding to", currentPath);
          return next();
        }
      } else {
        console.log("No token, proceeding to", currentPath);
        return next();
      }
    }

    if (protectedPages.includes(currentPath)) {
      // If not authenticated, redirect to /login
      if (!token) {
        console.log("No Token, redirecting to login.");
        return res.redirect(302, "/login");
      }
      try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        return next();
      } catch (error) {
        console.log("Invalid token, redirecting to login.");
        return res.redirect(302, "/login");
      }
    }

    // If landing page and already authenticated, redirect to home
    //if (publicPages.includes(currentPath)) {
    if (currentPath === "") {
      if (token) {
        try {
          jwt.verify(token, process.env.JWT_SECRET as string);
          return res.redirect(302, "/home");
        } catch (error) {
          return next();
        }
      }
      return next();
    }

    return next(); // Default case, proceed normally
  };
};

export default redirectAuth;
