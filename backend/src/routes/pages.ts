import express from "express";
import type { Request, Response } from "express";
const router = express.Router();
import {
  landingPage,
  homePage,
  signupPage,
  loginPage,
  aboutPage,
} from "../controllers/pages.ts";
import authUser from "../middlewares/authUser.ts";

router.get("/", landingPage);
router.get("/signup", signupPage);
router.get("/login", loginPage);
router.get("/home", authUser, homePage);
router.get("/about", authUser, aboutPage);
//router.get("/", homePage);

export default router;
