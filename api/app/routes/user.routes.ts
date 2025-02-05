import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/authenticate";

export default function userRouter(app: Router) {
  app.post("/users", createUser);
  app.get("/users/:userId", authenticate, getUser);
  app.put("/users/:userId", authenticate, updateUser);
  app.delete("/users/:userId", authenticate, deleteUser);
}
