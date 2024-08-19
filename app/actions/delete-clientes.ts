"use server";

import { prisma } from "@/lib/prisma";

export const deleteClienteById = async (id: number) => {
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
};
