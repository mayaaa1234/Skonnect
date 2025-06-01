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

const otpPage = (_req: Request, res: Response): void => {
  res.render("otpPage", {
    title: "otp-authentication",
  });
};

const loginPage = (_req: Request, res: Response): void => {
  res.render("login", {
    title: "Login",
  });
};

// const suggestionPage = (_req: Request, res: Response): void => {
//   res.render("suggestions", {
//     title: "Submit Suggestions",
//   });
// };

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

const concernsPage = (_req: Request, res: Response): void => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.render("concernsPage", {
    title: "Concerns | Suggestions",
  });
};

const eventsPage = (_req: Request, res: Response): void => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.render("eventsPage", {
    title: "Projects & Events",
  });
};
const councilPage = (_req: Request, res: Response): void => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  res.render("councilPage", {
    title: "Council Infomatin",
  });
};

const budgetAllocationPage = (_req: Request, res: Response): void => {
  res.render("budgetAllocation", {
    title: "Budget Allocation",
  });
};

export {
  landingPage,
  signupPage,
  otpPage,
  loginPage,
  homePage,
  profilePage,
  aboutPage,
  budgetAllocationPage,
  councilPage,
  eventsPage,
  concernsPage,
};
