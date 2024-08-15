"use server";
import { prisma } from "@/lib/prisma";
import { FormSchema } from "../sign-up/page";
import bcrypt from "bcryptjs";

export const createUser = async (data: FormSchema) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      username: data.username,
      password: hashedPassword,
    },
  });

  return user;
};
