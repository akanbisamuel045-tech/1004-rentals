import express from "express";
import { db } from "../models/db.js";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.js";
import { submissionLimiter, adminOnlyMiddleware, sanitizeBodyMiddleware } from "../middleware/security.js";

const router = express.Router();

// GET /api/bookings/my (Get all bookings for logged-in user)
router.get("/my", authMiddleware, (req, res) => {
  try {
    const bookings = db.getUserBookings(req.user.id, req.user.email);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings (Admin: view all bookings)
router.get("/", authMiddleware, adminOnlyMiddleware, (req, res) => {
  try {
    const bookings = db.getAllBookings();
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings (Create a new apartment inspection/rental booking)
router.post("/", submissionLimiter, optionalAuthMiddleware, sanitizeBodyMiddleware, (req, res) => {
  try {
    const {
      propertyId,
      propertyTitle,
      userName,
      userEmail,
      userPhone,
      inspectionDate,
      timeSlot,
      notes
    } = req.body;

    const finalUserName = req.user?.name || userName;
    const finalUserEmail = req.user?.email || userEmail;
    const finalUserPhone = req.user?.phone || userPhone;

    if (!propertyId || !finalUserName || !finalUserEmail || !finalUserPhone || !inspectionDate) {
      return res.status(400).json({
        success: false,
        message: "Property ID, user name, email, phone number, and inspection date are required."
      });
    }

    const booking = db.createBooking({
      userId: req.user?.id || null,
      userName: finalUserName,
      userEmail: finalUserEmail,
      userPhone: finalUserPhone,
      propertyId,
      propertyTitle,
      inspectionDate,
      timeSlot: timeSlot || "10:00 AM - 12:00 PM",
      notes: notes || ""
    });

    res.status(201).json({
      success: true,
      message: "Inspection booking confirmed successfully! Details saved to your account.",
      data: booking
    });
  } catch (error) {
    const isClientError =
      error.message.includes("marked as") ||
      error.message.includes("cannot be booked") ||
      error.message.includes("already have") ||
      error.message.includes("does not exist") ||
      error.message.includes("Invalid");
    res.status(isClientError ? 400 : 500).json({ success: false, message: error.message });
  }
});

// PATCH /api/bookings/:id/status (User can cancel own booking, Admin can update any status)
router.patch("/:id/status", authMiddleware, sanitizeBodyMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"];
    const upperStatus = status ? status.toUpperCase() : "PENDING";
    
    if (!validStatuses.includes(upperStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const booking = db.data.bookings.find((b) => b.id === req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const isAdmin = req.user?.role === "ADMIN";
    const isOwner = (req.user?.id && booking.userId === req.user.id) ||
      (req.user?.email && booking.userEmail?.toLowerCase() === req.user.email.toLowerCase());

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: "Not authorized to update this booking." });
    }

    if (!isAdmin && upperStatus !== "CANCELLED") {
      return res.status(403).json({ success: false, message: "Clients can only cancel their bookings." });
    }

    const updated = db.updateBookingStatus(req.params.id, upperStatus);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

