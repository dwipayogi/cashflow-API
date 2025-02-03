import type { Request, Response } from "express";
import prisma from "../client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  if (user.password !== password) {
    res.status(401).send({ message: "Incorrect password" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.send({ message: "Login successful", token });
};

export const userLogout = async (req: Request, res: Response) => {
  res.send({ message: "Logout successful" });
}