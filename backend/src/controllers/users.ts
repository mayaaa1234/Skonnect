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

  const users = await User.find();
  if (!users) throw mkCustomError({ status: 404, msg: "No users found." });
  res.status(200).json(users);
};

export const status = async (req: Request, res: Response) => {
  if (!req.user) throw mkCustomError({ status: 404, msg: "User not found." });

  res.status(200).json({
    isAuthenticated: true,
  });
};
