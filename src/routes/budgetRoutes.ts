import express from "express";
import {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetsByCategory,
} from "../controllers/budgetController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

// All routes are protected - require authentication
router.use(protect);

// Budget routes
router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/category/:categoryId", getBudgetsByCategory);
router.get("/:id", getBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;