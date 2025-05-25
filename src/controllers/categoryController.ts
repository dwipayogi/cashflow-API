import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all categories for the logged in user
export const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const categories = await prisma.category.findMany({
      where: { userId },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await prisma.category.create({
      data: {
        userId,
        name,
        description,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        description:
          description !== undefined
            ? description
            : existingCategory.description,
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
