import { Router } from "express";
import {
  createTransaction,
  getTransaction,
} from "../controllers/transaction.controller";

export default function transactionRouter(app: Router) {
  app.post("/transactions/:userId", createTransaction);
  app.get("/transactions/:userId", getTransaction);
}
