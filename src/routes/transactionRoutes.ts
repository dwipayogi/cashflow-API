import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.ts";

const router = express.Router();

// GET /api/transactions - Get all transactions
router.get("/", getAllTransactions);

// GET /api/transactions/:id - Get transaction by ID
router.get("/:id", getTransactionById);

// POST /api/transactions - Create new transaction
router.post("/", createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put("/:id", updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete("/:id", deleteTransaction);

export default router;
