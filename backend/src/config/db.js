import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.PROD_MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
