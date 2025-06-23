import multer from "multer";

// Storage configuration
const storage = multer.memoryStorage(); // Stores files in memory as buffer

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
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB file size limit
  // limits: { fileSize: 15 * 1024 * 1024 }, // 15MB file size limit
});

// NOTE:
// just gonna use upload.array cause upload.field too much for this projects usecase
//it's typed as: { [fieldname: string]: Express.Multer.File[] }

const uploadMany = upload.array("images", 15);
//export const uploadSingle = upload.single("file"); // not used

export default uploadMany;
