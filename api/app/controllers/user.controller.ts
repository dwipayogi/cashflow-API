import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../client";

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const userExists = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    res.status(400).send({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      username,
      email,
      password: hashedPassword,
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

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const user = await prisma.users.update({
    where: {
      id: Number(id),
    },
    data: {
      email,
      ...(hashedPassword && { password: hashedPassword }),
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
