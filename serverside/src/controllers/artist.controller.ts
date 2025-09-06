import type{ Request, Response } from "express";
import { Artist } from "../models/Artist.js";
import s3 from "../config/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

// ✅ Create Artist with image upload
export const createArtist = async (req: Request, res: Response) => {
  try {
    const { name, roles, genre, bio, birthDate, country } = req.body;

    // Multer-S3 stores file on S3 → `req.file.location` is the URL
    const imageUrl = req.file ? (req.file as any).location : undefined;

    const artist = new Artist({
      name,
      roles,
      genre,
      bio,
      birthDate,
      country,
      imageUrl,
    });

    await artist.save();
    res.status(201).json({ success: true, data: artist });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all artists
export const getAllArtists = async (req: Request, res: Response) => {
  try {
    const artists = await Artist.find().populate("songs");
    res.json({ success: true, data: artists });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update artist (with optional new image upload)



const bucket = process.env.S3_BUCKET_NAME!;

export const updateArtist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find artist first (so we can delete old image if needed)
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).json({ success: false, message: "Artist not found" });
    }

    const updates: any = { ...req.body };
    if (req.file) {
      // Delete old image from S3 (only if artist already has an imageUrl)
      if (artist.imageUrl) {
        const oldKey = artist.imageUrl.split(`${bucket}/`)[1]; // extract path after bucket/
        if (oldKey) {
          try {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: bucket,
                Key: oldKey,
              })
            );
            console.log("🗑️ Old image deleted from S3:", oldKey);
          } catch (err) {
            console.error("⚠️ Failed to delete old image:", err);
          }
        }
      }

      // Save new image
      updates.imageUrl = (req.file as any).location;
    }

    // ✅ Update MongoDB
    const updatedArtist = await Artist.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.json({ success: true, data: updatedArtist });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get artist by ID
export const getArtistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const artist = await Artist.findById(id).populate("songs");

    if (!artist) {
      return res.status(404).json({ success: false, message: "Artist not found" });
    }

    res.json({ success: true, data: artist });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
