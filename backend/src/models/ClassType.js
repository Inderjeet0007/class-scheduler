import mongoose from "mongoose";

const classTypeSchema = new mongoose.Schema({
  classId: { type: String, required: true, unique: true },
  name: { type: String, required: true },   // e.g., “Car”, “Motorcycle”
  description: String,
  durationMinutes: { type: Number },        // optional override per class
}, { timestamps: true });

export default mongoose.model("ClassType", classTypeSchema);
