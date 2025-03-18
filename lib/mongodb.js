// lib/mongodb.js
import mongoose from "mongoose";

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return; // Already connected
  }
  console.log(process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectToDatabase;
