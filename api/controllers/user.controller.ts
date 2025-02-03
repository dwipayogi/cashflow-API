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
  res.send(user);
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const users = await prisma.users.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  if (!users) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  res.send(users);
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const { email, password } = req.body;

  const user = await prisma.users.update({
    where: {
      id: Number(id),
    },
    data: {
      email,
      password,
    },
  });

  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  res.send({ message: `User ${user.username} updated` });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.userId as string;
  const user = await prisma.users.delete({
    where: {
      id: Number(id),
    },
  });

  if (!user) {
    res.status(404).send({ message: "User not found" });
    return;
  }

  res.send({ message: `User ${user.username} deleted` });
};
