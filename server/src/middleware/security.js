import rateLimit from "express-rate-limit";

// Rate Limiter: Global API protection (Generous limit + bypass for local development)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development" || req.ip === "127.0.0.1" || req.ip === "::1" || (req.ip && req.ip.includes("127.0.0.1")),
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again after 15 minutes."
  }
});

// Rate Limiter: Auth endpoints (100 attempts / 15 mins per IP + bypass for local development)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development" || req.ip === "127.0.0.1" || req.ip === "::1" || (req.ip && req.ip.includes("127.0.0.1")),
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes."
  }
});

// Rate Limiter: Public Form submissions (50 requests / 15 mins per IP to protect from spam)
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development" || req.ip === "127.0.0.1" || req.ip === "::1" || (req.ip && req.ip.includes("127.0.0.1")),
  message: {
    success: false,
    message: "Submission limit reached. Please wait a few minutes before submitting another enquiry or booking."
  }
});

// Admin Authorization Guard
export function adminOnlyMiddleware(req, res, next) {
  const role = req.user?.role ? req.user.role.toUpperCase() : "";
  if (!req.user || role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin privileges required to perform this action."
    });
  }
  next();
}

// XSS Sanitization helper (escapes HTML special characters and trims strings)
export function sanitizeString(val) {
  if (typeof val !== "string") return val;
  return val
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Express Middleware for sanitizing string properties in req.body
export function sanitizeBodyMiddleware(req, res, next) {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
}
