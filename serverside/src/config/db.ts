import mongoose from "mongoose";

let isConnected = false; // Singleton flag 

export const connectDB = async (): Promise<mongoose.Connection | void> => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
