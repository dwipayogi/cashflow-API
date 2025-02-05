import { Router } from "express";
import { userLogin, userLogout } from "../controllers/auth.controller";

export default function authRouter(app: Router) {
  app.post("/auth/login", userLogin);
  app.post("/auth/logout", userLogout);
}
