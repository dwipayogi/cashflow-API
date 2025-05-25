import { Request, Response } from "express";
import { PrismaClient, BudgetType } from "@prisma/client";

const prisma = new PrismaClient();

// Create new budget
export const createBudget = async (req: Request, res: Response) => {
  try {
    const { amount, target, description, type, category, endDate } = req.body;
    const userId = req.user.id;

    if (!type || !category || !target) {
      return res.status(400).json({ 
        message: "Please provide budget type, category, and target amount" 
      });
    }

    // Check if the budget type is valid
    if (!Object.values(BudgetType).includes(type as BudgetType)) {
      return res.status(400).json({ message: "Invalid budget type" });
    }

    // Check if category exists
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
          description: `Auto-created for budget: ${description || "No description"}`,
        },
      });
    }

    // Create budget with initial amount of 0 if not specified
    const budget = await prisma.budget.create({
      data: {
        userId,
        amount: amount !== undefined ? Number(amount) : 0,
        target: Number(target),
        description,
        type: type as BudgetType,
        category: categoryRecord.id,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        categoryData: true,
      },
    });

    res.status(201).json({
      message: "Budget created successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Create budget error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all budgets for a user
export const getBudgets = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const budgets = await prisma.budget.findMany({
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
      count: budgets.length,
      data: budgets,
    });
  } catch (error) {
    console.error("Get budgets error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get budget by ID
export const getBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        categoryData: true,
      },
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error("Get budget error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, target, description, endDate } = req.body;
    const userId = req.user.id;

    // Check if budget exists and belongs to user
    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Update budget
    const updatedBudget = await prisma.budget.update({
      where: {
        id,
      },
      data: {
        amount: amount !== undefined ? Number(amount) : undefined,
        target: target !== undefined ? Number(target) : undefined,
        description: description !== undefined ? description : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        categoryData: true,
      },
    });

    res.status(200).json({
      message: "Budget updated successfully",
      data: updatedBudget,
    });
  } catch (error) {
    console.error("Update budget error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete budget
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if budget exists and belongs to user
    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Delete budget
    await prisma.budget.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get budgets by category ID
export const getBudgetsByCategory = async (req: Request, res: Response) => {
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

    const budgets = await prisma.budget.findMany({
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
      count: budgets.length,
      categoryName: category.name,
      data: budgets,
    });
  } catch (error) {
    console.error("Get budgets by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};