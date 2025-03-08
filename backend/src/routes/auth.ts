import express from "express";
const router = express.Router();
import { adduser, auth } from "../controllers/auth.ts";

// "/" === "api/v1/auth"
router.get("/", auth);
router.post("/", adduser);

export default router;
