"use server";

import { prisma } from "@/lib/prisma";
import { UserFull } from "./get-users";

export const deleteVeiculoById = (id: number, user: UserFull) => {
  if (user.perfil && user.accessLevel.delete) {
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
