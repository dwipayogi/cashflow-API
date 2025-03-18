import type { Request, Response } from "express";
import prisma from "../../client";
import capitalizeWords from "../lib/capitalizeWord";

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = await prisma.categories.findUnique({
    where: {
      name: capitalizeWords(name),
    },
  });

  if (category) {
    res
      .status(400)
      .send({ success: false, message: "Category already exists" });
    return;
  }

  const newCategory = await prisma.categories.create({
    data: {
      name: capitalizeWords(name),
    },
  });
  res
    .status(201)
    .send({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
};

export const getCategory = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const transaction = await prisma.transactions.findMany({
    where: {
      userId: Number(id),
    },
    select: {
      category: true,
    },
  });

  if (!transaction) {
    res.status(404).send({ success: false, message: "Category not found" });
    return;
  }

  const categories = await prisma.categories.findMany({
    where: {
      id: {
        in: transaction.map((t) => t.category),
      },
    },
  });
  const category = categories.map((c) => c.name);

  res
    .status(200)
    .send({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
};
