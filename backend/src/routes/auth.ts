import express from "express";
const router = express.Router();
//import authUser from "../middlewares/authUser.ts";
import { signup, login } from "../controllers/auth.ts";

// INFO:  "/" === "api/v1/auth"
router.post("/signup", signup);
router.post("/login", login);
// router.post("/otp", otp); // idk maybe if it's a requirement

export default router;
