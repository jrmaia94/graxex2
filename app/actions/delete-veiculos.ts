"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const deleteVeiculoById = (id: number, user: User) => {
  if (user.perfil) {
    try {
      const veiculoDeleted = prisma.veiculo.delete({
        where: {
          id: id,
        },
      });
      return veiculoDeleted;
    } catch (error) {
      throw error;
    }
  } else {
    throw Error("Usuário não autorizado!");
  }
};
