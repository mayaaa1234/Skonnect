import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import mkCustomError from "../errors/CustomError.ts";

const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.signedCookies.authorization;

  if (!token) {
    throw mkCustomError({
      status: 401,
      msg: "Authentication Invalid: No Token Provided.",
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      username: string;
      email: string;
      isAdmin: boolean;
    };

    if (user.isAdmin === false)
      throw mkCustomError({ status: 401, msg: "No Access For This Request." });

    console.log("authAdmin middleware: ", { user });

    req.user = user; // sent to ts
    res.locals.user = user; // sent to ejs
    next();
  } catch (error) {
    throw mkCustomError({ status: 401, msg: "Invalid or expired token." });
  }
};

export default authAdmin;
