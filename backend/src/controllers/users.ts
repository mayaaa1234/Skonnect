import pool from "../db/pool.ts";
import mkCustomError from "../errors/CustomError.ts";
import User from "../models/User.ts";
import type { Request, Response, NextFunction } from "express";

export const info = async (req: Request, res: Response) => {
  if (!req.user)
    throw mkCustomError({ status: 404, msg: "req.user not found." });

  res.status(200).json(req.user);
};

export const getAllUsers = async (req: Request, res: Response) => {
  if (!req.user) throw mkCustomError({ status: 404, msg: "User not found." });

  const users = await User.findAll();
  if (!users) throw mkCustomError({ status: 404, msg: "No users found." });
  res.status(200).json(users);
};

export const status = async (req: Request, res: Response) => {
  if (!req.user) throw mkCustomError({ status: 404, msg: "User not found." });

  res.status(200).json({
    isAuthenticated: true,
  });
};

export const changePassword = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw mkCustomError({ status: 404, msg: "User not found." });

  const { currentPassword, newPassword, id } = req.body;
  const curr = currentPassword.trim();
  const next = newPassword.trim();

  const users = await User.changePassword(curr, next, user.userId);

  res.json({ msg: "OK" });
};
