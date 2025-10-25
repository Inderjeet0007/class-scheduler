import express from "express";

const router = express.Router();

// POST /api/registrations/upload
router.post("/upload");

// Get daily stats
router.get("/stats");

// Get full report
router.get("/report");

export default router;
