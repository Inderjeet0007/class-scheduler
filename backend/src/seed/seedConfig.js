import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Config from "../models/Config.js";

dotenv.config();

const configs = [
  { key: "CLASS_DURATION_MINUTES", value: "45", description: "Default class duration in minutes" },
  { key: "MAX_CLASSES_PER_STUDENT_PER_DAY", value: "3", description: "Maximum number of classes a student can take per day" },
  { key: "MAX_CLASSES_PER_INSTRUCTOR_PER_DAY", value: "5", description: "Maximum number of classes an instructor can teach per day" },
  { key: "MAX_CLASSES_PER_TYPE_PER_DAY", value: "10", description: "Maximum number of classes of the same type per day" },
];

const seedConfig = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding config...");

    for (const conf of configs) {
      await Config.findOneAndUpdate(
        { key: conf.key },
        { $set: conf },
        { upsert: true }
      );
    }

    console.log("✅ Configuration seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding config:", error);
    process.exit(1);
  }
};

seedConfig();
