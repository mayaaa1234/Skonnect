import express from "express";
const router = express.Router();
import redirectAuth from "../middlewares/redirectAuth.ts";
import authUser from "../middlewares/authUser.ts";
import {
  landingPage,
  homePage,
  signupPage,
  otpPage,
  loginPage,
  profilePage,
  aboutPage,
  budgetAllocationPage,
  councilPage,
  concernsPage,
  eventsPage,
} from "../controllers/pages.ts";

router.get("/", redirectAuth(), landingPage);
router.get("/signup", redirectAuth(), signupPage);
router.get("/signup/otp-authentication", redirectAuth(), otpPage);
router.get("/login", redirectAuth(), loginPage);

// protected routes
router.get("/profile", redirectAuth(), authUser, profilePage);
router.get("/home", redirectAuth(), homePage);
router.get("/about", redirectAuth(), aboutPage);

router.get("/annual-budget-allocation", redirectAuth(), budgetAllocationPage);
router.get("/projects-and-events", redirectAuth(), eventsPage);
router.get("/concerns-or-suggestions", redirectAuth(), concernsPage);
router.get("/council-information", redirectAuth(), councilPage);

export default router;
