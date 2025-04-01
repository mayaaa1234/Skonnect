import { Router } from "express";
import multer from "multer";
import {
  getSlideshowImage,
  getAllSlideshows,
  uploadSlideshow,
  updateSlideshow,
} from "../controllers/slides.ts";

import uploadMany from "../middlewares/upload.ts";

const router = Router();

router.get("/", getAllSlideshows);
router.get("/images/:imageId", getSlideshowImage);

router.post("/", uploadMany, uploadSlideshow);

router.put("/api/slideshows/:id", uploadMany, updateSlideshow);

export default router;
