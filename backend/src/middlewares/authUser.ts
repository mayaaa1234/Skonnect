import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authentication Invalid: No Token Provided."); // use error middleware ofr this
  }

  const token = authHeader?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log(decoded);

    //req.user = decoded as jwt.JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

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
