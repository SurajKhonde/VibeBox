import express from "express";
import { uploadToS3 } from "../middlewares/multer-s3.js";

const router = express.Router();

// Upload image
router.post(
  "/image",
  uploadToS3("images").single("file"),
  (req, res) => {
    res.json({ fileUrl: req.file?.location }); // ✅ location is now typed
  }
);

// Upload audio
router.post(
  "/upload/audio",
  uploadToS3("audio").single("file"),
  (req, res) => {
    res.json({ fileUrl: req.file?.location });
  }
);

export default router;
