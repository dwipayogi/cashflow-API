import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateBudgetData {
  userId: string;
  amount?: number;
  target?: number;
  description?: string;
  type: "SAVINGS" | "EXPENSE";
  endDate?: string;
  category?: string;
}

interface UpdateBudgetData {
  amount?: number;
  target?: number;
  description?: string;
  type?: "SAVINGS" | "EXPENSE";
  endDate?: string;
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

export const createBudgetService = async (data: CreateBudgetData) => {
  let categoryId = null;

  // Handle category creation if provided
  if (data.category) {
    const category = await findOrCreateCategory(data.category);
    categoryId = category?.id || null;
  }

  const budget = await prisma.budget.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      target: data.target,
      description: data.description,
      type: data.type,
      endDate: data.endDate ? new Date(data.endDate) : null,
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

  return budget;
};

export const getAllBudgetsService = async (userId?: string) => {
  const where = userId ? { userId } : {};

  const budgets = await prisma.budget.findMany({
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

  return budgets;
};

export const getBudgetByIdService = async (id: string) => {
  const budget = await prisma.budget.findUnique({
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

  return budget;
};

export const updateBudgetService = async (
  id: string,
  data: UpdateBudgetData
) => {
  let categoryId: string | null | undefined = data.category ? undefined : null;

  // Handle category update if provided
  if (data.category) {
    const category = await findOrCreateCategory(data.category);
    categoryId = category?.id || null;
  }

  const budget = await prisma.budget.update({
    where: { id },
    data: {
      amount: data.amount,
      target: data.target,
      description: data.description,
      type: data.type,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
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

  return budget;
};

export const deleteBudgetService = async (id: string) => {
  try {
    await prisma.budget.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};
