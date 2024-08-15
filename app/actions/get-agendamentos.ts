"use server";
import { prisma } from "@/lib/prisma";

export const getAgendamentos = async () => {
  const agendamentos = await prisma.agendamento.findMany({
    include: {
      cliente: true,
      veiculos: {
        include: {
          veiculo: true,
        },
      },
    },
  });

  return agendamentos;
};
