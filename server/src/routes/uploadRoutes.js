import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middleware/auth.js";
import { adminOnlyMiddleware } from "../middleware/security.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads directory: server/uploads
const UPLOADS_DIR = path.join(__dirname, "../../uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `1004-${cleanName}-${uniqueSuffix}${ext}`);
  }
});

// File Filter (JPEG, PNG, WebP only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && (mime.includes("image/jpeg") || mime.includes("image/png") || mime.includes("image/webp"))) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only JPG, JPEG, PNG, and WebP images are allowed."));
  }
};

// Multer Instance (5MB limit per ARCHITECTURE.md Section 7)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

const router = express.Router();

// Error handler wrapper for Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the 5MB limit. Please upload an image under 5MB."
      });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

// POST /api/upload (Single file upload)
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) return handleMulterError(err, req, res, next);
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided in request." });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
});

// POST /api/upload/multiple (Batch upload, up to 10 files)
router.post("/multiple", (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) return handleMulterError(err, req, res, next);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No image files provided in request." });
    }

    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
    res.status(201).json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      urls: fileUrls,
      files: req.files.map((f) => ({
        url: `/uploads/${f.filename}`,
        filename: f.filename,
        size: f.size
      }))
    });
  });
});

export default router;

