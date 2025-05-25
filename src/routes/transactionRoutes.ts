import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByCategory,
  getTransactionsByType,
  getTransactionsByCategoryName,
} from "../controllers/transactionController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

// Transaction routes
router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/category/:categoryId", getTransactionsByCategory);
router.get("/category/name/:categoryName", getTransactionsByCategoryName);
router.get("/type/:type", getTransactionsByType);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
