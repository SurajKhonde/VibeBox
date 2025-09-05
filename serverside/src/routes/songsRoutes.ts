import express from "express";
import { uploadToS3 } from "../middlewares/multer-s3.js";
import { isValidUser } from "../validators/uservalidate.js";
import { uploadSong,getSong } from "../controllers/songs.controller.js";
const router = express.Router();

router.post(
  "/uploadSong",
  uploadToS3("audio").single("file"),
  uploadSong                        
);
router.get("/:id", getSong);
export default router;