import type { Request, Response } from "express";
import User from "../models/User.ts";
//import { asyncWrapper } from "../middlewares/asyncWrapper.ts";
import mkCustomError from "../errors/CustomError.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signup = async (req: Request, res: Response): Promise<void> => {
  const {
    username,
    email,
    password,
    confirmPassword,
    adminKey = null,
  } = req.body;

  let isAdmin = false;
  if (adminKey) {
    if (adminKey !== process.env.ADMIN_KEY) {
      throw mkCustomError("Invalid admin key.", 401);
    }
    isAdmin = true;
  }

  const user = new User(username, email, password, confirmPassword, isAdmin);
  const errors = await user.signupValidation();
  if (errors) throw mkCustomError(errors, 400);

  await user.saveDB();

  //user has id from sql auto increment
  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_LIFETIME,
    } as jwt.SignOptions,
  );

  res.status(201).json({
    user: { id: user.id, name: user.username, email: user.email },
    token,
  });
};

const login = async (req: Request, res: Response) => {
  const { username = null, email = null, password } = req.body;

  const user = new User(username, email, password);

  const err = await user.loginValidation();
  if (err) throw mkCustomError(err, 400);

  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_LIFETIME as string,
    } as jwt.SignOptions,
  );

  res.json({
    user: { id: user.id, username: user.username, email: user.email },
    token,
  });
};

export { signup, login };
