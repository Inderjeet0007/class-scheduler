import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Student from "../models/Student.js";
import Instructor from "../models/Instructor.js";
import ClassType from "../models/ClassType.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding data...");

    // Clear old data (optional for clean start)
    await Promise.all([
      Student.deleteMany(),
      Instructor.deleteMany(),
      ClassType.deleteMany(),
    ]);

    // Seed students
    const students = await Student.insertMany([
      { studentId: "123", name: "John Doe", email: "john@example.com" },
      { studentId: "124", name: "Jane Smith", email: "jane@example.com" },
      { studentId: "125", name: "Mike Lee", email: "mike@example.com" },
    ]);

    // Seed instructors
    const instructors = await Instructor.insertMany([
      { instructorId: "101", name: "Mr. Robert", specialization: "Car" },
      { instructorId: "111", name: "Ms. Priya", specialization: "Motorcycle" },
      { instructorId: "112", name: "Mr. Arjun", specialization: "Truck" },
    ]);

    // Seed class types
    const classes = await ClassType.insertMany([
      { classId: "1", name: "Car Driving", description: "Basic car driving training", durationMinutes: 45 },
      { classId: "2", name: "Motorcycle", description: "Bike driving training", durationMinutes: 30 },
      { classId: "3", name: "Truck", description: "Heavy vehicle training", durationMinutes: 60 },
    ]);

    console.log("✅ Students, Instructors, and Classes seeded successfully!");

    console.log("\n--- Seed Summary ---");
    console.table({
      Students: students.length,
      Instructors: instructors.length,
      Classes: classes.length,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
