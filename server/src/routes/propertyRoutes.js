import express from "express";
import { db } from "../models/db.js";

const router = express.Router();

// GET /api/properties (with search, filtering, sorting)
router.get("/", (req, res) => {
  try {
    const filters = req.query;
    const properties = db.getProperties(filters);
    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/properties/:id (by ID or Slug)
router.get("/:id", (req, res) => {
  try {
    const property = db.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/properties (Admin: create listing)
router.post("/", (req, res) => {
  try {
    const { title, price, location, propertyType, bedrooms, bathrooms } = req.body;
    if (!title || !price || !location || !propertyType) {
      return res.status(400).json({
        success: false,
        message: "Title, price, location, and property type are required."
      });
    }

    const created = db.createProperty({
      ...req.body,
      price: parseFloat(req.body.price),
      bedrooms: parseInt(req.body.bedrooms || 1, 10),
      bathrooms: parseInt(req.body.bathrooms || 1, 10),
      parkingSpaces: parseInt(req.body.parkingSpaces || 0, 10),
      images: Array.isArray(req.body.images) && req.body.images.length > 0
        ? req.body.images
        : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"],
      amenities: Array.isArray(req.body.amenities) ? req.body.amenities : []
    });

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/properties/:id (Admin: update listing)
router.put("/:id", (req, res) => {
  try {
    const updated = db.updateProperty(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/properties/:id (Admin: delete listing)
router.delete("/:id", (req, res) => {
  try {
    const deleted = db.deleteProperty(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
