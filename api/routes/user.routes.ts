import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

export default function userRouter(app: Router) {
  app.post("/users", createUser);
  app.get("/users/:username", getUser);
  app.put("/users/:username", updateUser);
  app.delete("/users/:username", deleteUser);
}
