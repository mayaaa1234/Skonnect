import express from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";
import authAdmin from "../middlewares/authAdmin.ts";
import { info, status, getAllUsers } from "../controllers/users.ts";

router.get("/", authAdmin, getAllUsers);
router.get("/info", authUser, info);
router.get("/status", authUser, status);

export default router;

// router.post("/otp", otp); // idk maybe if it's a requirement
