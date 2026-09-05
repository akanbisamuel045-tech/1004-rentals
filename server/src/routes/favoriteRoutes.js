import express from "express";
import { db } from "../models/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/favorites/my (Get saved apartments for authenticated user)
router.get("/my", authMiddleware, (req, res) => {
  try {
    const favorites = db.getUserFavorites(req.user.id);
    const favoriteIds = db.getUserFavoriteIds(req.user.id);
    res.json({
      success: true,
      count: favorites.length,
      favoriteIds,
      data: favorites
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/favorites/toggle (Toggle saving a property)
router.post("/toggle", authMiddleware, (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: "Property ID is required" });
    }

    const result = db.toggleFavorite(req.user.id, propertyId);
    res.json({
      success: true,
      message: result.isSaved ? "Saved to your favorite apartments!" : "Removed from saved apartments.",
      isSaved: result.isSaved,
      favoriteIds: result.propertyIds
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
