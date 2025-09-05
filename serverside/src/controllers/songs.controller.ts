import type { Request, Response } from "express";
import { Song } from "../models/Song.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";

const bucket = process.env.S3_BUCKET_NAME!;
export const uploadSong = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const file = req.file as Express.MulterS3.File;

    // Parse arrays/objects from form-data (they arrive as strings)
    const singers = req.body.singers ? JSON.parse(req.body.singers) : [];
    const composers = req.body.composers ? JSON.parse(req.body.composers) : [];
    const albums = req.body.albums ? JSON.parse(req.body.albums) : [];
    const genres = req.body.genres ? JSON.parse(req.body.genres) : [];

    const song = new Song({
      name: req.body.name,
      singers,     // now actual array of ObjectIds
      composers,   // array of objects
      albums,      // array of objects
      genres,      // array of strings
      files: [
        {
          format: file.mimetype,
          url: file.key, // S3 key
          size: file.size,
        },
      ],
      releaseDate: req.body.releaseDate,
    });

    await song.save();

    return res.status(201).json({
      success: true,
      song,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to upload song",
    });
  }
};

export const getSong = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const song = await Song.findById(id)
        .populate("singers")  
        // .populate("composers.artistId")
        // .populate("albums.albumId");
  
      if (!song) {
        return res.status(404).json({ success: false, message: "Song not found" });
      }
  
      // Assume first file is the main audio
      const file = song.files[0];
      if (!file) {
        return res.status(400).json({ success: false, message: "No audio file found" });
      }
  
      // Create signed URL (expires in 15 minutes = 900 seconds)
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: file.url, 
      });
  
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
  
      return res.json({
        success: true,
        song: {
          _id: song._id,
          name: song.name,
          singers: song.singers,
          composers: song.composers,
          albums: song.albums,
          genres: song.genres,
          releaseDate: song.releaseDate,
          streamUrl: signedUrl, // 🎧 temporary URL
        },
      });
    } catch (err) {
      console.error("Get song error:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch song" });
    }
  };