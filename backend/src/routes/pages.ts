import express from "express";
const router = express.Router();
import redirectAuth from "../middlewares/redirectAuth.ts";
import {
  landingPage,
  homePage,
  signupPage,
  loginPage,
  profilePage,
  aboutPage,
  budgetAllocationPage,
  projectsPage,
  suggestionPage,
} from "../controllers/pages.ts";

router.get("/", redirectAuth(), landingPage);
router.get("/signup", redirectAuth(), signupPage);
router.get("/login", redirectAuth(), loginPage);
router.get("/home", redirectAuth(), homePage);
router.get("/profile", redirectAuth(), profilePage);

router.get("/about", redirectAuth(), aboutPage);
router.get("/annual-budget-allocation", redirectAuth(), budgetAllocationPage);
router.get("/projects-and-events", redirectAuth(), projectsPage);
router.get("/submit-suggestions", redirectAuth(), suggestionPage);

export default router;
