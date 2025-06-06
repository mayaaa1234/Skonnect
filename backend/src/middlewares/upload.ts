import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.memoryStorage(); // Stores files in memory as buffer

// File filter to allow only specific file types
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only, JPEG, JPG, PNG, and WEBP are allowed.",
      ),
    );
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB file size limit
});

// NOTE:
// just gonna use upload.array cause upload.field too much for this projects usecase
//it's typed as: { [fieldname: string]: Express.Multer.File[] }

const uploadMany = upload.array("images", 8);
//export const uploadSingle = upload.single("file"); // not used

export default uploadMany;
