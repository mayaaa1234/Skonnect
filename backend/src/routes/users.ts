import express from "express";
const router = express.Router();
import authUser from "../middlewares/authUser.ts";
import authAdmin from "../middlewares/authAdmin.ts";
import {
  info,
  status,
  getAllUsers,
  changePassword,
} from "../controllers/users.ts";

router.get("/", authAdmin, getAllUsers);
router.get("/my-info", authUser, info);
router.get("/status", authUser, status);

router.post("/change-password", authUser, changePassword);

export default router;

// router.post("/otp", otp); // idk maybe if it's a requirement
