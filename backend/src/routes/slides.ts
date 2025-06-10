import { Router } from "express";
import authAdmin from "../middlewares/authAdmin.ts";
import uploadMany from "../middlewares/upload.ts";

import {
  getSlideshowImage,
  getAllSlideshows,
  uploadSlideshow,
  updateSlideshow,
  deleteSlideshow,
} from "../controllers/slides.ts";

const router = Router();

router.get("/", getAllSlideshows);
router.get("/images/:imageId", getSlideshowImage);

router.post("/", uploadMany, authAdmin, uploadSlideshow);
router.put("/slideshows/:id", uploadMany, updateSlideshow);
router.delete("/:id", authAdmin, deleteSlideshow);

export default router;
