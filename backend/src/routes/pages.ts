import express from "express";
import type { Request, Response } from "express";
const router = express.Router();
//import authUser from "../middlewares/authUser.ts";

// removed authuser middleware just for fe devving
router.get("/", (_req: Request, res: Response) => {
  res.render("index", { title: "" });
});
export default router;
