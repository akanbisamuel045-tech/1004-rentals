import express from "express";
import { db } from "../models/db.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnlyMiddleware, sanitizeBodyMiddleware } from "../middleware/security.js";

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

// GET /api/properties/stats/pricing (Dynamic Rental Pricing Stats for 1004 Estate)
router.get("/stats/pricing", (req, res) => {
  try {
    const stats = db.getRentalPriceStats();
    res.json({ success: true, data: stats });
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
router.post("/", authMiddleware, adminOnlyMiddleware, sanitizeBodyMiddleware, (req, res) => {
  try {
    const { title, price, location, propertyType } = req.body;
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
router.put("/:id", authMiddleware, adminOnlyMiddleware, sanitizeBodyMiddleware, (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.price !== undefined && updateData.price !== "") updateData.price = parseFloat(updateData.price);
    if (updateData.bedrooms !== undefined && updateData.bedrooms !== "") updateData.bedrooms = parseInt(updateData.bedrooms, 10);
    if (updateData.bathrooms !== undefined && updateData.bathrooms !== "") updateData.bathrooms = parseInt(updateData.bathrooms, 10);
    if (updateData.parkingSpaces !== undefined && updateData.parkingSpaces !== "") updateData.parkingSpaces = parseInt(updateData.parkingSpaces, 10);
    if (updateData.serviceCharge !== undefined && updateData.serviceCharge !== "") updateData.serviceCharge = parseFloat(updateData.serviceCharge);
    if (updateData.cautionFee !== undefined && updateData.cautionFee !== "") updateData.cautionFee = parseFloat(updateData.cautionFee);
    if (updateData.agencyFee !== undefined && updateData.agencyFee !== "") updateData.agencyFee = parseFloat(updateData.agencyFee);

    const updated = db.updateProperty(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/properties/:id (Admin: delete listing)
router.delete("/:id", authMiddleware, adminOnlyMiddleware, (req, res) => {
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

