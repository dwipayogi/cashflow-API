import type { Request, Response } from "express";
import prisma from "../client";

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await prisma.users.create({
    data: {
      username,
      email,
      password,
    },
  });
  res.json(user);
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.userId as unknown as bigint;
  const users = await prisma.users.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  if (!users) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(users);
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.userId as unknown as bigint;
  const { email, password } = req.body;

  const user = await prisma.users.update({
    where: {
      id,
    },
    data: {
      email,
      password,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.userId as unknown as bigint;
  const user = await prisma.users.delete({
    where: {
      id,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
};
