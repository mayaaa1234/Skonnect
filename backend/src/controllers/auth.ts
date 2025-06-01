import type { Request, Response } from "express";
import User from "../models/User.ts";
import mkCustomError from "../errors/CustomError.ts";
import jwt from "jsonwebtoken";
import { otpRequest, otpVerify } from "../services/otpService.ts";
import {
  setTempSignupData,
  getTempSignupData,
  deleteTempSignupData,
} from "utils/tempSignupStore.ts";

export const signupValidation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, email, password, confirmPassword, adminKey } = req.body;

  let isAdmin = false;
  if (adminKey) {
    if (adminKey !== process.env.ADMIN_KEY)
      throw mkCustomError({ status: 401 });
    isAdmin = true;
  }
  // validation
  await User.signupValidation(
    username.trim(),
    email.trim(),
    password.trim(),
    confirmPassword.trim(),
  );

  // generate and send OTP
  const otpRecord = await otpRequest(email);

  // drop the otp and only send the info
  const { otp, ...otpInfo } = otpRecord;

  // store temp data for verification
  await setTempSignupData(username, email, password, isAdmin, otp);

  res.status(200).json({ otpInfo });
};

export const signupVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, otp } = req.body;
  console.log("sign up verification:", { email, otp });

  const tempData = await getTempSignupData(email);
  if (!tempData)
    throw mkCustomError({
      status: 400,
      msg: "temp data error: signup session expired or not found",
    });

  // verify OTP
  await otpVerify(email, otp);
  // const { otp: droppedOtp, ...otpInfo } = otpRecord;

  // create user
  const { username, password, isAdmin } = tempData;
  const userId = await User.saveDB(username, email, password, isAdmin);

  // delete temp data
  await deleteTempSignupData(email);

  // issue JWT
  const token = jwt.sign(
    { userId, username, email, isAdmin },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_LIFETIME } as jwt.SignOptions,
  );

  res.cookie("authorization", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    signed: true,
    maxAge: Number(process.env.COOKIE_MAX_AGE),
    path: "/",
  });

  // console.log("signup verification: ", userName);
  res.status(201).json({ user: { userId, username }, token });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { credential, password } = req.body;

  // login validation
  const {
    id: userId,
    username,
    email,
    isAdmin,
  } = await User.loginValidation(credential.trim(), password.trim());

  // issue JWT
  const token = jwt.sign(
    { userId, username, email, isAdmin },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_LIFETIME } as jwt.SignOptions,
  );

  res.cookie("authorization", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    signed: true,
    maxAge: Number(process.env.COOKIE_MAX_AGE),
    path: "/",
  });

  res.status(200).json({ user: { userId, username }, token });
};

export const logout = async (_req: Request, res: Response) => {
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
};
