import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import type { Request, Response, NextFunction } from "express";
import mkCustomError from "../errors/CustomError.ts";

const authUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw mkCustomError("Authentication Invalid: No Token Provided.", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as jwt.JwtPayload;

    console.log(decoded);
    req.user = decoded;

    next();
  } catch (error) {
    throw mkCustomError("Invalid or expired token.", 401);
  }
};

export default authUser;
