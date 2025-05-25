import express from "express";
import {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.ts";

const router = express.Router();

// GET /api/budgets - Get all budgets
router.get("/", getAllBudgets);

// GET /api/budgets/:id - Get budget by ID
router.get("/:id", getBudgetById);

// POST /api/budgets - Create new budget
router.post("/", createBudget);

// PUT /api/budgets/:id - Update budget
router.put("/:id", updateBudget);

// DELETE /api/budgets/:id - Delete budget
router.delete("/:id", deleteBudget);

export default router;
