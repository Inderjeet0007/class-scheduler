import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
  instructorId: { type: String, required: true, unique: true },
  name: { type: String },
  specialization: { type: String },  // e.g., "Motorcycle", "Heavy Vehicle"
  phone: { type: String },
  email: { type: String },
}, { timestamps: true });

export default mongoose.model("Instructor", instructorSchema);
