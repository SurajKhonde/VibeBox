
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body); // ✅ validate + clean
      next();
    } catch (err: any) {
      return res.status(400).json({ success: false, errors: err.errors });
    }
  };
