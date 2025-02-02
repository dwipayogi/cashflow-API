import type { Request, Response } from "express";
import prisma from "../client";

export const createTransaction = async (req: Request, res: Response) => {
  const id = req.params.userId as unknown as bigint;
  const { category, name, description, amount } = req.body as {
    category: number;
    type: string;
    name: string;
    description: string;
    amount: bigint;
  };

  const transaction = await prisma.transactions.create({
    data: {
      userId: id,
      name,
      description,
      amount,
      category,
    },
  });

  res.json(transaction);
};

export const getTransaction = async (req: Request, res: Response) => {
  const id = req.params.userId as unknown as bigint;

  const transaction = await prisma.transactions.findMany({
    where: {
      userId: id,
    },
  });

  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  res.json(transaction);
};
