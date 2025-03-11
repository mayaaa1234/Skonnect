import type { Request, Response, NextFunction } from "express";
import User from "../models/User.ts";
import jwt from "jsonwebtoken";
import { asyncWrapper } from "../middlewares/asyncWrapper.ts";
import { createCustomError } from "../errors/CustomError.ts";
import dotenv from "dotenv";
dotenv.config();

const signup = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //try {
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
        //return res
        //.status(401)
        //.json({ error: "Can't create an admin. Invalid admin key" });
        next(createCustomError("Invalid admin key.", 401));
      }
      isAdmin = true;
    }

    const user = new User(username, email, password, confirmPassword, isAdmin);
    const errors = await user.signupValidation();
    // passing the errors to errorHandler using next with a custom error
    if (errors) next(createCustomError(errors, 400));

    await user.save(); // to db

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
    //} catch (error) {
    //  console.error(error);
    //  res.status(400).json({ error: error.message });
    //}
  },
);
const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    //TODO:  gen jwt

    const user = new User(username, email, password);
    await user.loginValidation();

    const sec: string = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      sec,
      {
        expiresIn: process.env.JWT_LIFETIME as string,
      } as jwt.SignOptions,
    );

    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export { signup, login };
