import express from "express";
import { isValidUser } from "../validators/uservalidate.js";
import {getAllArtists,getArtistById } from "../controllers/artist.controller.js";
import {listSongs, playSong } from "../controllers/songs.controller.js";
const router = express.Router();

router.get("/songs",isValidUser, listSongs);       
router.get("/songs/:id",isValidUser, playSong); 

router.get("/artists",isValidUser,getAllArtists);
router.get("/artists/:id",isValidUser,getArtistById);
export default router;
