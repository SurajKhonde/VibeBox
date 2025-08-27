import type { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Connect DB once (singleton)
connectDB();

// Routes
app.use("/api/users", userRoutes);

export default app;

