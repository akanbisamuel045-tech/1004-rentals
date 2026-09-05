import express from "express";
import { db } from "../models/db.js";

const router = express.Router();

// GET /api/locations
router.get("/", (req, res) => {
  try {
    const locations = db.getLocations();
    res.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
