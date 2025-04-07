import express from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";
import { signup, login, logout } from "../controllers/auth.ts";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authUser, logout);
// router.post("/otp", otp); // idk maybe if it's a requirement

export default router;
