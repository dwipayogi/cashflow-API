import { Request, Response } from "express";
import { PrismaClient, TransactionType } from "@prisma/client";
import {
  updateBudgetForTransaction,
  updateBudgetForDeletedTransaction,
} from "../utils/budgetUpdater.ts";

const prisma = new PrismaClient();

// Create new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { amount, description, type, category } = req.body;
    const userId = req.user.id;

    if (!amount || !type || !category) {
      return res
        .status(400)
        .json({ message: "Please provide amount, type, and category" });
    }

    // Check if the transaction type is valid
    if (!Object.values(TransactionType).includes(type as TransactionType)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Check if category exists, if not create it
    let categoryRecord = await prisma.category.findFirst({
      where: {
        userId,
        name: category,
      },
    });

    // If category doesn't exist, create it
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          userId,
          name: category,
          description: `Auto-created for transaction: ${
            description || "No description"
          }`,
        },
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: Number(amount),
        description,
        type: type as TransactionType,
        category: categoryRecord.id,
      },
      include: {
        categoryData: true,
      },
    });

    // Update corresponding budget
    await updateBudgetForTransaction(transaction);

    res.status(201).json({
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all transactions for a user
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        categoryData: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single transaction
export const getTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        categoryData: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      data: transaction,
    });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, description, type, category } = req.body;
    const userId = req.user.id;

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if the transaction type is valid if provided
    if (
      type &&
      !Object.values(TransactionType).includes(type as TransactionType)
    ) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    let categoryId = existingTransaction.category;

    // If category is provided, check if it exists or create it
    if (category) {
      let categoryRecord = await prisma.category.findFirst({
        where: {
          userId,
          name: category,
        },
      });

      // If category doesn't exist, create it
      if (!categoryRecord) {
        categoryRecord = await prisma.category.create({
          data: {
            userId,
            name: category,
            description: `Auto-created for transaction update: ${
              description || existingTransaction.description || "No description"
            }`,
          },
        });
      }

      categoryId = categoryRecord.id;
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        amount: amount !== undefined ? Number(amount) : undefined,
        description: description !== undefined ? description : undefined,
        type: type !== undefined ? (type as TransactionType) : undefined,
        category: categoryId,
      },
      include: {
        categoryData: true,
      },
    });

    // Update corresponding budget
    await updateBudgetForTransaction(
      updatedTransaction,
      false,
      existingTransaction
    );

    res.status(200).json({
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if transaction exists and belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update corresponding budget before deleting the transaction
    await updateBudgetForDeletedTransaction(transaction);

    // Delete transaction
    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get transactions by category
export const getTransactionsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryId } = req.params;
    const userId = req.user.id;

    // Verify the category exists and belongs to the user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        category: categoryId,
      },
      include: {
        categoryData: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: transactions.length,
      categoryName: category.name,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get transactions by type (DEPOSIT or WITHDRAWAL)
export const getTransactionsByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const userId = req.user.id;

    // Validate transaction type
    if (!Object.values(TransactionType).includes(type as TransactionType)) {
      return res.status(400).json({
        message: "Invalid transaction type",
        validTypes: Object.values(TransactionType),
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: type as TransactionType,
      },
      include: {
        categoryData: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: transactions.length,
      transactionType: type,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions by type error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get transactions by category name
export const getTransactionsByCategoryName = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryName } = req.params;
    const userId = req.user.id;

    // Find the category by name for this user
    const category = await prisma.category.findFirst({
      where: {
        name: {
          equals: categoryName,
          mode: "insensitive", // Case insensitive search
        },
        userId,
      },
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: `Category '${categoryName}' not found` });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        category: category.id,
      },
      include: {
        categoryData: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      count: transactions.length,
      categoryName: category.name,
      categoryId: category.id,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions by category name error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
