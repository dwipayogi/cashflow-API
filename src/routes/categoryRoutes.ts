import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

// All category routes are protected
router.use(protect);

// CRUD routes for categories
router.post("/", createCategory); // Create category
router.get("/", getCategories); // Get all categories
router.get("/:id", getCategoryById); // Get category by ID
router.put("/:id", updateCategory); // Update category
router.delete("/:id", deleteCategory); // Delete category

export default router;
