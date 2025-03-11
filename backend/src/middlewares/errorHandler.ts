import CustomError from "../errors/CustomError.ts";
import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // check if the getting passed  is coming from the custom err
  // otherwise just use a generic error
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  console.error("Error message:", err.message);

  return res
    .status(500)
    .json({ msg: "Something went wrong, please try again later." });
};
