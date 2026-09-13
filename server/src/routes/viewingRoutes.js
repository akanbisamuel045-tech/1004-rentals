import express from "express";
import { db } from "../models/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { submissionLimiter, adminOnlyMiddleware, sanitizeBodyMiddleware } from "../middleware/security.js";

const router = express.Router();

// GET /api/viewings (Admin: list all viewing appointments)
router.get("/", authMiddleware, adminOnlyMiddleware, (req, res) => {
  try {
    const viewings = db.getViewings();
    res.json({ success: true, count: viewings.length, data: viewings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/viewings (Tenant schedules an inspection/viewing)
router.post("/", submissionLimiter, sanitizeBodyMiddleware, (req, res) => {
  try {
    const { name, email, phone, preferredDate, preferredTime, propertyId, propertyTitle, notes } = req.body;
    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone number, preferred date, and preferred time are required."
      });
    }

    const viewing = db.createViewing({
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      propertyId: propertyId || null,
      propertyTitle: propertyTitle || "General Property Viewing",
      notes: notes || ""
    });

    res.status(201).json({
      success: true,
      message: "Viewing inspection requested successfully! An agent will confirm with you.",
      data: viewing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/viewings/:id/status (Admin: confirm / cancel viewing)
router.patch("/:id/status", authMiddleware, adminOnlyMiddleware, sanitizeBodyMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateViewingStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Viewing request not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

