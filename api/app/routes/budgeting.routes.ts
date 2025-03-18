import { Router } from "express";

import {
  createBudget,
  getBudgets,
  getBudget,
  deleteBudget,
} from "../controllers/budgeting.controller";

export default function budgetingRouter(app: Router) {
  app.post("/budgets/:userId", createBudget);
  app.get("/budgets/:userId", getBudgets);
  app.get("/budgets/:userId/:budgetId", getBudget);
  app.delete("/budgets/:userId/:budgetId", deleteBudget);
}