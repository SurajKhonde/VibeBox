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
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req: Request, file, cb) => {
        const filename = `${folder}/${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  });
  
