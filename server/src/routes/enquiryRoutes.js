import express from "express";
import { db } from "../models/db.js";

const router = express.Router();

// GET /api/enquiries (Admin: list all enquiries)
router.get("/", (req, res) => {
  try {
    const enquiries = db.getEnquiries();
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/enquiries (Tenant submits enquiry)
router.post("/", (req, res) => {
  try {
    const { name, email, phone, message, propertyId, propertyTitle } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Full name, email address, and message are required."
      });
    }

    const enquiry = db.createEnquiry({
      name,
      email,
      phone: phone || "",
      message,
      propertyId: propertyId || null,
      propertyTitle: propertyTitle || "General Inquiry"
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry has been received. Our Lagos leasing team will reach out shortly!",
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/enquiries/:id/status (Admin: update enquiry status)
router.patch("/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateEnquiryStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
