import type { Request, Response, NextFunction } from "express";
import mkCustomError from "../errors/CustomError.ts";
import User from "../models/User.ts";

export const info = async (req: Request, res: Response) => {
  if (!req.user) {
    throw mkCustomError("Req user is empty", 404);
  }
  const { userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw mkCustomError("User not found", 404);
  }

  const { userId: id, username, email, password, isAdmin } = user;

  res.status(200).json({
    userId,
    email,
    username,
    isAdmin,
  });
};

export const status = async (req: Request, res: Response) => {
  if (!req.user) {
    throw mkCustomError("Req user is empty", 404);
  }

  res.status(200).json({
    isAuthenticated: true,
  });
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await new Promise<void>((resolve, _reject) => {
    req.session.destroy((err) => {
      if (err) next(mkCustomError("Session destruction failed", 500));
      resolve();
    });

    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.clearCookie("authorization", {
      path: "/",
      domain: "",
    });

    res.status(200).json({
      success: true,
    });
  });
};
