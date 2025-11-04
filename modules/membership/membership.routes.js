import express from "express";
import multer from "multer";
import path from "path";
import { registration, login, profile, updateProfile, profileImage, testing } from "./membership.controller.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

// multer untuk upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${req.user.email.replace(/[@.]/g, "_")}-${uniqueSuffix}${ext}`);
  },
});

// jpeg/png
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Format Image tidak sesuai");
    error.status = 102;
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// MEMBERSHIP ROUTES
router.get("/test", testing);
router.post("/registration", registration);
router.post("/login", login);
router.get("/profile", authenticateToken, profile);
router.put("/profile/update", authenticateToken, updateProfile);
router.put("/profile/image", authenticateToken, upload.single("profile_image"), profileImage);

export default router;