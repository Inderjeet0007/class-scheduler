import express from "express";
import {
  uploadRegistrations,
  getStats,
  getReport,
} from "../controllers/registrationController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// POST /api/registrations/upload
router.post("/upload", upload.single("file"), uploadRegistrations);

// Get daily stats
router.get("/stats", getStats);

// Get full report
router.get("/report", getReport);

export default router;
