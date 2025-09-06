import express from "express";
import { uploadToS3 } from "../middlewares/multer-s3.js";
import { isValidAdmin, isValidUser } from "../validators/uservalidate.js";
import { uploadSong ,listSongs, playSong } from "../controllers/songs.controller.js";
const router = express.Router();

router.post(
  "/songs"
  ,isValidAdmin,
  uploadToS3("audio").single("file"),
  uploadSong                        
);
router.get("/songs",isValidUser, listSongs);       
router.get("/:id/play",isValidUser, playSong); 
export default router;