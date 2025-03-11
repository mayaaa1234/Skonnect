import express from "express";
import type { Request, Response } from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";

router.get("/home", authUser, (_req: Request, res: Response) => {
  res.send("welcome");
});
export default router;
