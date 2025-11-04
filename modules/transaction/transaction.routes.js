// modules/transaction/transaction.routes.js
import express from "express";
import { authenticateToken } from "../../middleware/authMiddleware.js";
import { getBalance, topUpBalance, makeTransaction, getHistory } from "./transaction.controller.js";

const router = express.Router();

// Private route
router.get("/balance", authenticateToken, getBalance);
router.post("/topup", authenticateToken, topUpBalance);
router.post("/", authenticateToken, makeTransaction);
router.get("/history", authenticateToken, getHistory);

export default router;