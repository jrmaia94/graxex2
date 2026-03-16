"use server";

import { prisma } from "@/lib/prisma";

export const getGroups = async () => {
  const groups = await prisma.grupoCliente.findMany({
    include: {
      veiculos: true,
    },
  });
  return groups;
};
