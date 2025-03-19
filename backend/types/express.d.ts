import { Request, Response } from "express";

declare global {
  namespace Express {
    // Extend the Request interface
    interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
        isAdmin: boolean;
        // any additional properties you expect
      };
    }
  }
}

export {};
