import { Router } from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/category.controller";

export default function categoryRouter(app: Router) {
  app.post("/categories", createCategory);
  app.get("/categories/:userId", getCategory);
}
