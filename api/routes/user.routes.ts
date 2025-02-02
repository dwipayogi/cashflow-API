import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

export default function userRouter(app: Router) {
  app.post("/users", createUser);
  app.get("/users/:userId", getUser);
  app.put("/users/:userId", updateUser);
  app.delete("/users/:userId", deleteUser);
}
