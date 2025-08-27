import type{ Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
    const JWT_SECRET = process.env.JWT_SECRET as string ;
    try {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
          }
      const { email, password } = req.body;
  
      // 1. Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // 2. Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // 3. Create JWT payload
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      // 4. Set JWT in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
  
      // 5. Respond with user info (omit sensitive fields)
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  