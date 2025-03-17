import type { Request, Response } from "express";

const homePage = (_req: Request, res: Response): void => {
  res.render("index", { title: "Home" });
};

const signupPage = (_req: Request, res: Response): void => {
  res.render("signup", { title: "Signup" });
};

const loginPage = (_req: Request, res: Response): void => {
  res.render("login", { title: "Login" });
};

const aboutPage = (_req: Request, res: Response): void => {
  res.render("about", { title: "About" });
};

const accountPage = (_req: Request, res: Response): void => {
  res.render("account", { title: "Account" });
};

//const emailVerificationPage = async (
//  _req: Request,
//  res: Response,
//): Promise<void> => {
//  res.render("email-verification", { title: "Email Verification" });
//};

export {
  signupPage,
  loginPage,
  homePage,
  accountPage,
  //emailVerificationPage,
  aboutPage,
};
