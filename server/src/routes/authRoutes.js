import express from "express";

const router = express.Router();

// Simple admin authentication endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  // Default demo admin credentials
  if (email === "admin@lagosrentals.com" && password === "admin123") {
    return res.json({
      success: true,
      user: {
        id: "admin-1",
        name: "Akanbi Samuel",
        email: "akanbisamuel045@gmail.com",
        role: "ADMIN"
      },
      token: "demo-jwt-token-akanbi-samuel"
    });
  }

  // Allow general testing login
  if (email && password && password.length >= 6) {
    return res.json({
      success: true,
      user: {
        id: "user-" + Date.now(),
        name: email.split("@")[0],
        email: email,
        role: email.includes("admin") ? "ADMIN" : "USER"
      },
      token: "demo-jwt-token-" + Date.now()
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials. Use admin@lagosrentals.com / admin123 or any valid email & 6+ char password."
  });
});

export default router;
