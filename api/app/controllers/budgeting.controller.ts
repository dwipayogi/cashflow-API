import type { Request, Response } from "express";
import prisma from "../../client";

export const createBudget = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const { name, description, amount, target, date } = req.body as {
    name: string;
    description?: string;
    amount: number;
    target: number;
    date: string;
  };

  const budget = await prisma.budgeting.create({
    data: {
      name,
      description,
      amount,
      target,
      date: new Date(date),
      userId: parseInt(id),
    },
  });

  res
    .status(200)
    .send({
      success: true,
      message: "Budget created successfully",
      data: budget,
    });
};

export const getBudgets = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const budget = await prisma.budgeting.findMany({
    where: {
      userId: Number(id),
    },
    select: {
      name: true,
      description: true,
      amount: true,
      target: true,
      date: true,
    },
  });

  if (!budget) {
    res.status(404).send({ success: false, message: "Budget not found" });
    return;
  }

  res
    .status(200)
    .send({
      success: true,
      message: "Budgets retrieved successfully",
      data: budget,
    });
};

export const getBudget = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const budgetId = req.params.budgetId as string;

  const budget = await prisma.budgeting.findUnique({
    where: {
      id: Number(budgetId),
      userId: Number(id),
    },
    select: {
      name: true,
      description: true,
      amount: true,
      target: true,
      date: true,
    },
  });

  if (!budget) {
    res.status(404).send({ success: false, message: "Budget not found" });
    return;
  }

  res
    .status(200)
    .send({
      success: true,
      message: "Budget retrieved successfully",
      data: budget,
    });
};

export const deleteBudget = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const budgetId = req.params.budgetId as string;

  const budget = await prisma.budgeting.delete({
    where: {
      id: Number(budgetId),
      userId: Number(id),
    },
  });

  res
    .status(200)
    .send({
      success: true,
      message: "Budget deleted successfully",
      data: budget,
    });
};
