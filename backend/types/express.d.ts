import { Request, Response } from "express";
// import { File } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        email: string;
        isAdmin: boolean;
      };
      //file?: Express.Multer.File; // Single file
      //files?:
      //  | { [fieldname: string]: Express.Multer.File[] }
      //  | Express.Multer.File[]; // Multiple files
    }
  }
}
