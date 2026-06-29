import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// File filter (optional)
const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;