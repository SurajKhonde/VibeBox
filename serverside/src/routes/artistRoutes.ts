import express from "express";
import { createArtist, getAllArtists, updateArtist } from "../controllers/artist.controller.js";
import { uploadToS3 } from "../middlewares/multer-s3.js";
import { validateArtist } from "../validators/artistValidator.js";
import { isValidAdmin, isValidUser } from "../validators/uservalidate.js";
const router = express.Router();

// Create artist (with image upload)
router.post("/artists", uploadToS3("images").single("file"),validateArtist, createArtist);

// Get all artists
router.get("/artists",isValidUser,getAllArtists);

// Update artist (with optional new image)
router.put("/artists/:id", uploadToS3("images").single("file"), updateArtist);

export default router;
