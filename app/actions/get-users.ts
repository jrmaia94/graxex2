"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

interface AccessProps {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  admin: boolean;
}

export interface UserFull
  extends Pick<
    User,
    "email" | "name" | "id" | "perfil" | "username" | "image"
  > {
  accessLevel?: AccessProps | any;
}

export const getAllUsers = async (user: UserFull) => {
  if (user.perfil && user.accessLevel?.admin) {
    const users = await prisma.user.findMany();
    return users;
  } else {
    throw Error("Usuário não autorizado!");
  }
};
