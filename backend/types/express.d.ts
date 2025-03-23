import { Request, Response } from "express";

declare global {
  namespace Express {
    // Extend the Request interface
    interface Request {
      user?: {
        userId: number;
        username: string;
        email: string;
        isAdmin: boolean;
      };
    }
  }
}
