import express from "express";
import type { Request, Response } from "express";
const router = express.Router();
import {
  signupPage,
  loginPage,
  homePage,
  aboutPage,
} from "../controllers/pages.ts";
//import authUser from "../middlewares/authUser.ts";

// removed authuser middleware just for fe devving
router.get("/", homePage);
router.get("/signup", signupPage);
router.get("/login", loginPage);
router.get("/about", aboutPage);
//router.get("/", homePage);

export default router;
