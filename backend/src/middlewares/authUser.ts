import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper.ts";
import { createCustomError } from "../errors/CustomError.ts";

const authUser = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next(
        createCustomError("Authentication Invalid: No Token Provided.", 401),
      );
      return;
    }
    // Ensure the JWT secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = authHeader.split(" ")[1];
    try {
      // Verify token with type safety
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as jwt.JwtPayload;

      console.log(decoded);
      req.user = decoded;

      next();
    } catch (error) {
      return next(createCustomError("Invalid or expired token.", 401));
    }
  },
);

export default authUser;

//const jwt = require("jsonwebtoken");
//const { UnauthenticatedError } = require("../errors");
//
//const verifyAndExtractToken = (authHeader, secret, errorMessage) => {
//  if (!authHeader || !authHeader.startsWith("Bearer ")) {
//    throw new UnauthenticatedError("Authentication Invalid: No Token Provided");
//  }
//
//  const token = authHeader.split(" ")[1];
//
//  try {
//    return jwt.verify(token, secret);
//  } catch (error) {
//    throw new UnauthenticatedError(
//      errorMessage || "Authentication Invalid: Token Not Authorized",
//    );
//  }
//};
//
//
//const authUser = async (req, res, next) => {
//  try {
//    const payload = verifyAndExtractToken(
//      req.headers.authorization,
//      process.env.USER_JWT,
//      "Authentication Invalid: Token Not Authorized",
//    );
//    req.user = { userID: payload.userID, name: payload.name };
//    next();
//  } catch (error) {
//    next(error);
//  }
//};
//
//module.exports = authUser;
