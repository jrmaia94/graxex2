"use server";

import { prisma } from "@/lib/prisma";

export const deleteVeiculoById = (id: number) => {
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
};
