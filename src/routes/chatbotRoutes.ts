import express from "express";
import {
  sendMessage,
  getFinancialInsights,
} from "../controllers/chatbotController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

// Public route - can be accessed without authentication
router.post("/message", sendMessage);

// Protected routes - require authentication
router.get("/insights", protect, getFinancialInsights);

export default router;
