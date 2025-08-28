
// import core Module 
import dotenv from "dotenv";
import type { Application } from "express";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
//import setup module 
import "./utils/passport.js";
import { swaggerDocs } from "./swagger/swagger.js";
import { connectDB } from "./config/db.js";
// poroject routes 

import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/s3.js";

dotenv.config();
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "keyboardcat",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Database connection 
connectDB();

// ✅ Swagger route
swaggerDocs(app);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

export default app;

