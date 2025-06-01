import express from "express";
const router = express.Router();

import { getOtpInfo, otpRequest } from "../controllers/otp.ts";

router.post("/info", getOtpInfo);
router.post("/request", otpRequest);
// router.post("/verify", otpVerify);

export default router;
