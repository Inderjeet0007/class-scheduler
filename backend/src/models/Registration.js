import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  registrationId: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  instructorId: { type: String, required: true },
  classId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  date: { type: String, required: true }, // yyyy-mm-dd
  status: { 
    type: String, 
    enum: ["active", "cancelled"], 
    default: "active" 
  },
}, { timestamps: true });

export default mongoose.model("Registration", registrationSchema);
