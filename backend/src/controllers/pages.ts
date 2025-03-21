import type { Request, Response } from "express";

const landingPage = (_req: Request, res: Response): void => {
  res.render("index", {
    title: "",
    bodyClass: "index",
    dataPage: "index",
    homeScript: "home.bundled.js",
  });
};

const signupPage = (_req: Request, res: Response): void => {
  res.render("signup", {
    title: "Signup",
    dataPage: "signup",
    bodyClass: "signup auth-page",
    signupScript: "signup.bundled.js",
  });
};

const loginPage = (_req: Request, res: Response): void => {
  res.render("login", {
    title: "Login",
    dataPage: "login",
    homeScript: "login.bundled.js",
  });
};

const homePage = (_req: Request, res: Response): void => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.render("home", {
    title: "Home",
    dataPage: "home",
    homeScript: "home.bundled.js",
  });
};

const aboutPage = (_req: Request, res: Response): void => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.render("about", {
    title: "About",
    dataPage: "about",
    homeScript: "about.bundled.js",
  });
};

const profilePage = (_req: Request, res: Response): void => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.render("profile", {
    title: "Profile",
    dataPage: "profile",
    homeScript: "profile.bundled.js",
  });
};

export { landingPage, signupPage, loginPage, homePage, profilePage, aboutPage };
