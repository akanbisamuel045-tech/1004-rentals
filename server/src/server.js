import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import propertyRoutes from "./routes/propertyRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import viewingRoutes from "./routes/viewingRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/viewings", viewingRoutes);
app.use("/api/locations", locationRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Lagos Rentals API",
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(` Lagos Rentals Server running on http://localhost:${PORT}`);
});
