import express from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";
import { signupValidation, signupVerification, login, logout } from "../controllers/auth.ts";

router.post("/signup/validation", signupValidation);
router.post("/signup/verification", signupVerification);
router.post("/login", login);
router.post("/logout", authUser, logout);

export default router;
