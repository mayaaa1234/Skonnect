import express from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";
import { info } from "../controllers/info.ts";

router.get("/info", authUser, info);
// router.post("/otp", otp); // idk maybe if it's a requirement

export default router;
