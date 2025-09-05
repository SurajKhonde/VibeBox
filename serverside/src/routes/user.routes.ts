import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import path from "path";
import User from "../models/User.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Serve Login Page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

// Normal Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  res.cookie("token", token, { httpOnly: true });
  res.status(200).json({"message":"User sign in sucessfully",
    role:user.role,
    
  });
});

// Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req: any, res) => {
    const user = req.user;
    if (!user.password) {
      return res.redirect(`/api/users/set-password?userId=${user._id}`);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  }
);

// Set Password Page
router.get("/set-password", (req, res) => {
  let filePath = path.join(__dirname, "../views/set-password.html");
  res.sendFile(filePath);
});

// Handle Set Password
router.post("/set-password", async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found");
  user.password = password;
  await user.save();
  res.send("Password set successfully! You can now log in.");
});
router.get("/test", (req, res) => {
    res.json({ message: "Swagger route working!" });
  });
export default router;
