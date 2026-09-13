import rateLimit from "express-rate-limit";

// Rate Limiter: Global API protection (150 requests / 15 mins per IP)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again after 15 minutes."
  }
});

// Rate Limiter: Auth endpoints (10 attempts / 15 mins per IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes."
  }
});

// Rate Limiter: Public Form submissions (5 requests / 15 mins per IP to protect Mrs. Joke Popoola from spam)
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Submission limit reached. Please wait a few minutes before submitting another enquiry or booking."
  }
});

// Admin Authorization Guard
export function adminOnlyMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
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
