import express from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";
import authAdmin from "../middlewares/authAdmin.ts";
import {
  updateRow,
  add,
  deleteRow,
  getAll,
} from "../controllers/budgetAllocation.ts";

router.get("/", authUser, getAll);

router.post("/", authAdmin, add);

router.delete("/:id", authAdmin, deleteRow);

router.put("/:id", authAdmin, updateRow);

export default router;
