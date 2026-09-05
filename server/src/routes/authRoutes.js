import express from "express";
import { db } from "../models/db.js";
import { generateToken, authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email address, and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    const user = await db.createUser({ name, email, phone, password });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user,
      token
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password."
      });
    }

    const user = await db.validateUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: "Logged in successfully!",
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me (Get current authenticated user profile)
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// PUT /api/auth/profile (Update profile)
router.put("/profile", authMiddleware, (req, res) => {
  try {
    const { name, phone } = req.body;
    const updatedUser = db.updateUserProfile(req.user.id, { name, phone });
    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
