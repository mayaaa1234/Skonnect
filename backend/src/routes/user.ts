import express from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";
import { info, status, logout } from "../controllers/user.ts";

router.get("/info", authUser, info);
router.get("/status", authUser, status);
router.post("/logout", authUser, logout);

export default router;

// router.post("/otp", otp); // idk maybe if it's a requirement
