import express from "express";
import { getBanners } from "./information.controller.js";
import { getServices } from "./information.controller.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/banner", getBanners);
router.get("/services", authenticateToken, getServices);

export default router;