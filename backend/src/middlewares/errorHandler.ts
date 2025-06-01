import { CustomError } from "../errors/CustomError.ts";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof CustomError) {
    if (err.message) console.error("Error message:", err.message);
    if (err.errors) console.error("Error message:", err.errors);

    return res.status(err.statusCode).json({
      msg: err.message ?? undefined,
      errs: err.errors ?? undefined, // send multiple errors if available
    });
  }

  console.error("=== ERROR DETAILS ===");
  console.error("Path:", req.path);
  console.error("Time:", new Date().toISOString());
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("=====================");

  return res
    .status(500)
    .json({ msg: "Something went wrong, please try again later." });

  // _next(err);
};

//import { CustomError } from "../errors/CustomError.ts";
//import type { Request, Response, NextFunction } from "express";
//import dotenv from "dotenv";
//dotenv.config();
//
//export const errorHandler = (
//  err: Error,
//  _req: Request,
//  res: Response,
//  _next: NextFunction,
//) => {
//  if (err instanceof CustomError) {
//    console.error("Error message:", err.message);
//    return res.status(err.statusCode).json({
//      err: err.message,
//      //process.env.NODE_ENV === "production"
//      //? "Something went wrong, please try again later."
//      //: err.message,
//    });
//  }
//
//  console.error("=== ERROR DETAILS ===");
//  console.error("Path:", _req.path);
//  console.error("Time:", new Date().toISOString());
//  console.error("Message:", err.message);
//  console.error("Stack:", err.stack);
//  console.error("=====================");
//
//  return res
//    .status(500)
//    .json({ err: "Something went wrong, please try again later." });
//};
//
