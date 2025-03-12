import type { Request, Response, NextFunction } from "express";
import User from "../models/User.ts";
import { asyncWrapper } from "../middlewares/asyncWrapper.ts";
import { createCustomError } from "../errors/CustomError.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      username,
      email,
      password,
      confirmPassword,
      adminKey = null,
    } = req.body;
    console.log("req.body", req.body);

    let isAdmin = false;
    if (adminKey) {
      if (adminKey !== process.env.ADMIN_KEY) {
        return next(createCustomError("Invalid admin key.", 401));
      }
      isAdmin = true;
    }

    const user = new User(username, email, password, confirmPassword, isAdmin);
    const errors = await user.signupValidation();
    //passing the errors to errorHandler using next with a custom error
    if (errors) return next(createCustomError(errors, 400));

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
  },
);

const login = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    //TODO:  gen jwt

    const user = new User(username, email, password);

    const err = await user.loginValidation();
    if (err) return next(createCustomError(err, 400));

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
  },
);

export { signup, login };
