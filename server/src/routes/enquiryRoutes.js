import express from "express";
import { db } from "../models/db.js";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.js";
import { submissionLimiter, adminOnlyMiddleware, sanitizeBodyMiddleware } from "../middleware/security.js";

const router = express.Router();

const VALID_ENQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "VIEWING_SCHEDULED",
  "NEGOTIATING",
  "BOOKED",
  "CLOSED"
];

// GET /api/enquiries/my (User: list their own submitted enquiries)
router.get("/my", authMiddleware, (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    const userId = req.user?.id;
    const userEnquiries = db.getEnquiries().filter(
      (e) => (userId && e.userId === userId) || (userEmail && e.email?.toLowerCase() === userEmail)
    );
    res.json({ success: true, count: userEnquiries.length, data: userEnquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/enquiries (Admin: list all enquiries)
router.get("/", authMiddleware, adminOnlyMiddleware, (req, res) => {
  try {
    const enquiries = db.getEnquiries();
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/enquiries (Tenant submits enquiry)
router.post("/", submissionLimiter, optionalAuthMiddleware, sanitizeBodyMiddleware, (req, res) => {
  try {
    const { name, email, phone, message, propertyId, propertyTitle, source } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Full name, email address, and message are required."
      });
    }

    const enquiry = db.createEnquiry({
      userId: req.user?.id || null,
      name,
      email,
      phone: phone || "",
      message,
      propertyId: propertyId || null,
      propertyTitle: propertyTitle || "General Inquiry",
      source: source || "website_form"
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry has been received. Our 1004 Estate leasing team will reach out shortly!",
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/enquiries/:id/status (Admin: update enquiry status)
router.patch("/:id/status", authMiddleware, adminOnlyMiddleware, sanitizeBodyMiddleware, (req, res) => {
  try {
    const { status, notes } = req.body;
    const upperStatus = status ? status.toUpperCase() : "NEW";
    if (!VALID_ENQUIRY_STATUSES.includes(upperStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_ENQUIRY_STATUSES.join(", ")}`
      });
    }

    const updated = db.updateEnquiryStatus(req.params.id, upperStatus);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    if (notes) {
      updated.notes = notes;
      db.saveToDisk();
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

