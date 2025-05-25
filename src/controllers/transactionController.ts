import { Request, Response } from "express";
import {
  createTransactionService,
  getAllTransactionsService,
  getTransactionByIdService,
  updateTransactionService,
  deleteTransactionService,
} from "../services/transactionService.js";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, amount, description, type, category } = req.body;

    if (!userId || !type) {
      return res.status(400).json({
        error: "User ID and transaction type are required",
      });
    }

    const transaction = await createTransactionService({
      userId,
      amount,
      description,
      type,
      category,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const transactions = await getAllTransactionsService(userId as string);

    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await getTransactionByIdService(id);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error getting transaction:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const transaction = await updateTransactionService(id, updateData);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteTransactionService(id);

    if (!deleted) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
