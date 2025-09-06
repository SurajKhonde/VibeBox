// src/validation/authSchemas.ts
import { z } from "zod";

export const passwordSchema = z.object({
  oldPassword: z.string().min(8, "Old password must be at least 8 characters"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[0-9]/, "Must include number")
    .regex(/[@$!%*?&]/, "Must include special character"),
});
