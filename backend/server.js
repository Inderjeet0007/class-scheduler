import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import registrationRoutes from "./src/routes/registrationRoutes.js";
import configRoutes from "./src/routes/configRoutes.js";
import fs from "fs";

dotenv.config();
const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR;

if (!uploadDir) {
  throw new Error("UPLOAD_DIR is not defined in .env");
}

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // recursive ensures parent folders are created if missing
}

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/registrations", registrationRoutes);
app.use("/api/config", configRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Class Scheduler API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
