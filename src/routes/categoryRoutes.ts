import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.ts";
import { protect } from "../middleware/auth.ts";

const router = express.Router();

// All routes are protected - require authentication
router.use(protect);

// GET all categories
router.get("/", getCategories);

// GET a single category
router.get("/:id", getCategoryById);

// POST create a new category
router.post("/", createCategory);

// PUT update a category
router.put("/:id", updateCategory);

// DELETE a category
router.delete("/:id", deleteCategory);

export default router;
