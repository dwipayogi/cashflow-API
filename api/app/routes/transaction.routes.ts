import { Router } from "express";
import {
  createTransaction,
  getTransaction,
} from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/authenticate";

export default function transactionRouter(app: Router) {
  app.post("/transactions/:userId", authenticate, createTransaction);
  app.get("/transactions/:userId", authenticate, getTransaction);
}
