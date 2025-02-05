import { Router } from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middlewares/authenticate";

export default function categoryRouter(app: Router) {
  app.post("/categories", authenticate, createCategory);
  app.get("/categories/:userId", authenticate, getCategory);
}
