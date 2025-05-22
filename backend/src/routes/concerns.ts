import express from "express";
const router = express.Router();

import authUser from "../middlewares/authUser.ts";
import authAdmin from "../middlewares/authAdmin.ts";

import {
  getAllConcerns,
  submitConcern,
  updateConcernStatus,
  deleteConcern,
} from "../controllers/concerns.ts";

router.get("/", authUser, getAllConcerns);
router.get("/status/:id", authUser, getAllConcerns);

router.post("/", authUser, submitConcern);

router.patch("/status/:id", authAdmin, updateConcernStatus);

router.delete("/:id", authAdmin, deleteConcern);

export default router;
