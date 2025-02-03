import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../client";

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

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).send({ message: "Incorrect password" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.send(token);
};

export const userLogout = async (req: Request, res: Response) => {
  res.send({ message: "Logout successful" });
}