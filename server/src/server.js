import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { globalLimiter } from "./middleware/security.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import viewingRoutes from "./routes/viewingRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { db } from "./models/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Base Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api", globalLimiter);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Dynamic Sitemap Endpoint
app.get("/sitemap.xml", (req, res) => {
  try {
    const domain = "https://1004rentals.ng";
    const today = new Date().toISOString().split("T")[0];

    const staticRoutes = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/apartments", priority: "0.9", changefreq: "daily" },
      { path: "/apartments/1-bedroom", priority: "0.8", changefreq: "weekly" },
      { path: "/apartments/2-bedroom", priority: "0.8", changefreq: "weekly" },
      { path: "/apartments/3-bedroom", priority: "0.8", changefreq: "weekly" },
      { path: "/apartments/3-bedroom-maisonette", priority: "0.8", changefreq: "weekly" },
      { path: "/apartments/4-bedroom", priority: "0.8", changefreq: "weekly" },
      { path: "/apartments/available-now", priority: "0.9", changefreq: "daily" },
      { path: "/apartments/furnished", priority: "0.8", changefreq: "weekly" },
      { path: "/apartments/serviced", priority: "0.8", changefreq: "weekly" },
      { path: "/1004-estate", priority: "0.9", changefreq: "weekly" },
      { path: "/1004-estate/guide", priority: "0.8", changefreq: "weekly" },
      { path: "/1004-estate/apartment-types", priority: "0.8", changefreq: "weekly" },
      { path: "/1004-estate/rental-prices", priority: "0.9", changefreq: "daily" },
      { path: "/1004-estate/facilities", priority: "0.8", changefreq: "monthly" },
      { path: "/1004-estate/location", priority: "0.8", changefreq: "monthly" },
      { path: "/1004-estate/faqs", priority: "0.7", changefreq: "weekly" },
      { path: "/contact", priority: "0.6", changefreq: "monthly" }
    ];

    const properties = db.getProperties();
    const propertyRoutes = properties.map((p) => ({
      path: `/apartments/${p.slug || p.id}`,
      lastmod: p.updatedAt ? p.updatedAt.split("T")[0] : today,
      priority: "0.85",
      changefreq: "weekly"
    }));

    const allUrls = [
      ...staticRoutes.map((r) => `  <url>
    <loc>${domain}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`),
      ...propertyRoutes.map((r) => `  <url>
    <loc>${domain}${r.path}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`)
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/viewings", viewingRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "1004 Estate Rentals API",
    time: new Date().toISOString()
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Uncaught Server Error:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please contact customer support."
      : err.message || "Internal Server Error"
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(` Lagos Rentals Server running on http://localhost:${PORT}`);
  });
}

export default app;

