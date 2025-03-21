import express from "express";
import type { Request, Response } from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";
import redirectAuth from "../middlewares/redirectAuth.ts";

import {
  landingPage,
  homePage,
  signupPage,
  loginPage,
  profilePage,
  aboutPage,
} from "../controllers/pages.ts";

router.get("/", redirectAuth("/"), landingPage);
router.get("/signup", redirectAuth("signup"), signupPage);
router.get("/login", redirectAuth("login"), loginPage);
router.get("/home", redirectAuth("home"), homePage);
router.get("/profile", redirectAuth("profile"), profilePage);
//router.get("/signup", signupPage);
//router.get("/login", loginPage);
//router.get("/home", homePage);
router.get("/about", authUser, aboutPage);
//router.get("/", homePage);

export default router;
