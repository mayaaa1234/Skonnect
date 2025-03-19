import type { Request, Response } from "express";
import mkCustomError from "../errors/CustomError.ts";
import User from "../models/User.ts";

export const info = async (req: Request, res: Response) => {
  if (!req.user) {
    throw mkCustomError("Req user is empty", 404);
  }
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    throw mkCustomError("User not found", 404);
  }

  const { id: userId, username, email, password, isAdmin } = user;

  res.status(200).json({
    isAuthenticated: true,
    userId,
    email,
    username,
    isAdmin,
  });
};
