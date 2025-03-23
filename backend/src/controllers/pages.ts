import type { Request, Response } from "express";

const landingPage = (_req: Request, res: Response): void => {
  res.render("index", {
    title: "",
  });
};

const signupPage = (_req: Request, res: Response): void => {
  res.render("signup", {
    title: "Signup",
  });
};

const loginPage = (_req: Request, res: Response): void => {
  res.render("login", {
    title: "Login",
  });
};

const budgetAllocationPage = (_req: Request, res: Response): void => {
  res.render("budgetAllocation", {
    title: "Budget Allocation",
  });
};
const projectsPage = (_req: Request, res: Response): void => {
  res.render("projects", {
    title: "Projects and Events",
  });
};
const suggestionPage = (_req: Request, res: Response): void => {
  res.render("suggestions", {
    title: "Submit Suggestions",
  });
};
const aboutPage = (_req: Request, res: Response): void => {
  res.render("about", {
    title: "About",
  });
};

// protected routes

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
  });
};

export {
  landingPage,
  signupPage,
  loginPage,
  homePage,
  profilePage,
  aboutPage,
  budgetAllocationPage,
  projectsPage,
  suggestionPage,
};
