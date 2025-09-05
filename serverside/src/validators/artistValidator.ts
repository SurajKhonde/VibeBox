import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// ✅ Allowed roles
const ArtistRoleEnum = z.enum([
  "singer",
  "composer",
  "lyricist",
  "music_director",
  "producer",
  "actor",
  "director",
]);

// ✅ Artist schema (only text fields)
export const artistSchema = z.object({
  name: z.string().min(3, "Name is required"),
  roles: z.array(ArtistRoleEnum).min(1, "At least one role is required"),
  genre: z.string().optional(),
  bio: z.string().optional(),
  birthDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format, must be ISO string",
    })
    .optional(),
  country: z.string().optional(),
  songs: z.array(z.string()).optional(), // ObjectIds as string
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// ✅ Middleware: Validate only text body (no file)
export const validateArtist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    artistSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    next(err);
  }
};

