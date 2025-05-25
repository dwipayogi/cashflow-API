import { Request, Response } from "express";
import {
  createBudgetService,
  getAllBudgetsService,
  getBudgetByIdService,
  updateBudgetService,
  deleteBudgetService,
} from "../services/budgetService.ts";

export const createBudget = async (req: Request, res: Response) => {
  try {
    const { userId, amount, target, description, type, endDate, category } =
      req.body;

    if (!userId || !type) {
      return res.status(400).json({
        error: "User ID and budget type are required",
      });
    }

    const budget = await createBudgetService({
      userId,
      amount,
      target,
      description,
      type,
      endDate,
      category,
    });

    res.status(201).json({
      message: "Budget created successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllBudgets = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const budgets = await getAllBudgetsService(userId as string);

    res.status(200).json({
      message: "Budgets retrieved successfully",
      data: budgets,
    });
  } catch (error) {
    console.error("Error getting budgets:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const budget = await getBudgetByIdService(id);

    if (!budget) {
      return res.status(404).json({
        error: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget retrieved successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Error getting budget:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const budget = await updateBudgetService(id, updateData);

    if (!budget) {
      return res.status(404).json({
        error: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget updated successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteBudgetService(id);

    if (!deleted) {
      return res.status(404).json({
        error: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
