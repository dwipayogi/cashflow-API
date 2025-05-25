import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateTransactionData {
  userId: string;
  amount?: number;
  description?: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  category?: string;
}

interface UpdateTransactionData {
  amount?: number;
  description?: string;
  type?: "DEPOSIT" | "WITHDRAWAL";
  category?: string;
}

// Helper function to create or find category
const findOrCreateCategory = async (categoryName: string) => {
  if (!categoryName) return null;

  // First, try to find existing category
  let category = await prisma.category.findFirst({
    where: {
      name: {
        equals: categoryName,
        mode: "insensitive",
      },
    },
  });

  // If not found, create new category
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryName,
        description: `Auto-generated category: ${categoryName}`,
      },
    });
  }

  return category;
};

export const createTransactionService = async (data: CreateTransactionData) => {
  let categoryId = null;

  // Handle category creation if provided
  if (data.category) {
    const category = await findOrCreateCategory(data.category);
    categoryId = category?.id || null;
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      description: data.description,
      type: data.type,
      category: categoryId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      categoryData: true,
    },
  });

  return transaction;
};

export const getAllTransactionsService = async (userId?: string) => {
  const where = userId ? { userId } : {};

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      categoryData: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return transactions;
};

export const getTransactionByIdService = async (id: string) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      categoryData: true,
    },
  });

  return transaction;
};

export const updateTransactionService = async (
  id: string,
  data: UpdateTransactionData
) => {
  let categoryId: string | null | undefined = data.category ? undefined : null;

  // Handle category update if provided
  if (data.category) {
    const category = await findOrCreateCategory(data.category);
    categoryId = category?.id || null;
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      category: categoryId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      categoryData: true,
    },
  });

  return transaction;
};

export const deleteTransactionService = async (id: string) => {
  try {
    await prisma.transaction.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};
