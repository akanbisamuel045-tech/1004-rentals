import express from "express";
import { db } from "../models/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnlyMiddleware, sanitizeBodyMiddleware } from "../middleware/security.js";

const router = express.Router();

// POST /api/analytics/event (Ingest client-side tracking event)
router.post("/event", sanitizeBodyMiddleware, (req, res) => {
  try {
    const { name, category, propertyId, propertyTitle, page, source, metadata } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Event name is required" });
    }

    const event = db.recordAnalyticsEvent({
      name,
      category: category || "interaction",
      propertyId,
      propertyTitle,
      page,
      source: source || "web_client",
      metadata: metadata || {}
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/summary (Admin only: conversion and interaction stats)
router.get("/summary", authMiddleware, adminOnlyMiddleware, (req, res) => {
  try {
    const summary = db.getAnalyticsSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
