import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.memoryStorage(); // Stores files in memory as buffer

// File filter to allow only specific file types (optional)
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."));
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB file size limit
});

const uploadMultiple = upload.array("images", 6);
//export const uploadSingle = upload.single("file"); // not used

export default uploadMultiple;
