import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import type { Request } from "express";

const bucket = process.env.S3_BUCKET_NAME!;

export const uploadToS3 = (folder: "images" | "audio") =>
  multer({
    storage: multerS3({
      s3,
      bucket,
      acl: folder === "images" ? "public-read" : "private", // ✅ Images = public, Audio = private
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req: Request, file, cb) => {
        const filename = `${folder}/${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (folder === "images") {
        if (!file.mimetype.startsWith("image/")) {
          return cb(new Error("Only image files are allowed!"));
        }
      }
      if (folder === "audio") {
        if (!file.mimetype.startsWith("audio/")) {
          return cb(new Error("Only audio files are allowed!"));
        }
      }
      cb(null, true);
    },
    limits: { 
      fileSize: folder === "images" ? 1 * 1024 * 1024 : 8 * 1024 * 1024 
      
    }, 
  });
