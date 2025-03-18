import type { Request, Response } from "express";

const landingPage = (_req: Request, res: Response): void => {
  res.render("index", { title: "" });
};

const homePage = (_req: Request, res: Response): void => {
  res.render("home", { title: "Home" });
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
  landingPage,
  homePage,
  signupPage,
  loginPage,
  accountPage,
  //emailVerificationPage,
  aboutPage,
};
