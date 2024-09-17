"use server";

import { prisma } from "@/lib/prisma";
import { UserFull } from "./get-users";

export const deleteClienteById = async (id: number, user: UserFull) => {
  if (user.perfil && user.accessLevel.delete) {
    try {
      const clienteDeleted = await prisma.cliente.delete({
        where: {
          id: id,
        },
      });
      return clienteDeleted;
    } catch (error) {
      throw error;
    }
  } else {
    throw Error("Usuário não autorizado!");
  }
};
