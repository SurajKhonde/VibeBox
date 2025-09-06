import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; 

// ✅ Common function to verify JWT
const verifyToken = async (req: Request, res: Response) => {
  const token = req.cookies?.token;
  if (!token) {
    throw { status: 401, message: "No token provided" };
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    throw { status: 401, message: "Invalid or expired token" };
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw { status: 401, message: "User not found" };
  }

  return user;
};

// ✅ Allow only logged-in users
export const isValidUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req, res);

    if (user.role !== "user") {
      return res.status(403).json({ success: false, message: "Access denied: User role required" });
    }

    (req as any).user = user;
    next();
  } catch (err: any) {
    console.error("isValidUser Error:", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
  }
};

// ✅ Allow only admins
export const isValidAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req, res);

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admin role required" });
    }

    (req as any).user = user;
    next();
  } catch (err: any) {
    console.error("isValidAdmin Error:", err);
    res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
  }
};
