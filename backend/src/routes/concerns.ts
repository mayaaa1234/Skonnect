import express from "express";
const router = express.Router();

import authUser from "../middlewares/authUser.ts";
import authAdmin from "../middlewares/authAdmin.ts";

import {
  getAllConcerns,
  submitConcern,
  updateConcernStatus,
} from "../controllers/concerns.ts";

router.get("/", authUser, getAllConcerns);
router.get("/status/:id", authUser, getAllConcerns);

router.post("/", authUser, submitConcern);

router.put("/status/:id", authAdmin, updateConcernStatus);

export default router;
