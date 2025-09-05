import type{ Request, Response } from "express";
import Artist from "../models/Artist.js";

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
export const updateArtist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updates: any = { ...req.body };

    // If new image uploaded → replace imageUrl
    if (req.file) {
      updates.imageUrl = (req.file as any).location;
    }

    const artist = await Artist.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!artist) {
      return res.status(404).json({ success: false, message: "Artist not found" });
    }

    res.json({ success: true, data: artist });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
