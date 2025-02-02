import { Router } from "express";
import {
  createTransaction,
  getTransaction,
} from "../controllers/transaction.controller";

export default function transactionRouter(app: Router) {
  app.post("/users/:userId/transactions", createTransaction);
  app.get("/users/:userId/transactions", getTransaction);
}
