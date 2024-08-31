"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const deleteClienteById = async (id: number, user: User) => {
  if (user.perfil) {
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
