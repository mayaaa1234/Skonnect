import express from "express";
const router = express.Router();

import authUser from "../middlewares/authUser.ts";
import authAdmin from "../middlewares/authAdmin.ts";

import {
  getAllConcerns,
  submitConcern,
  rejectConcern,
  acknowledgeConcern,
  resolveConcern,
  processConcern,
  getRejectedConcerns,
  getResolvedConcerns,
} from "../controllers/concerns.ts";

router.get("/", authUser, getAllConcerns);
router.post("/", authUser, submitConcern);

router.put("/:id/reject", authAdmin, rejectConcern);
router.put("/:id/acknowledge", authAdmin, acknowledgeConcern);
router.put("/:id/process", authAdmin, processConcern);
router.put("/:id/resolve", authAdmin, resolveConcern);

router.get("/rejected", authAdmin, getRejectedConcerns);
router.get("/resolved", authAdmin, getResolvedConcerns);

export default router;
