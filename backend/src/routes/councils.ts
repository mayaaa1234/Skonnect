import express from "express";
const router = express.Router();
import authAdmin from "../middlewares/authAdmin.ts";
import uploadMany from "../middlewares/upload.ts";

import {
  deleteCouncilImg,
  getAllImgsURL,
  getCouncilImg,
  uploadCouncilImgs,
} from "../controllers/councils.ts";

router.post("/upload", uploadMany, authAdmin, uploadCouncilImgs);
router.get("/", getAllImgsURL);
router.get("/image/:id", getCouncilImg);

router.delete("/delete/:id", authAdmin, deleteCouncilImg);

export default router;
