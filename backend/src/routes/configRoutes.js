import express from "express";
import Config from "../models/Config.js";

const router = express.Router();

// Fetch all config values
router.get("/", async (req, res) => {
  try {
    const configs = await Config.find();
    res.json({ success: true, data: configs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update config values
router.put("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!key || value === undefined) {
      return res
        .status(400)
        .json({ success: false, error: "Key and value are required" });
    }

    const updatedConfig = await Config.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }, // create if missing
    );

    res.json({ success: true, data: updatedConfig });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
