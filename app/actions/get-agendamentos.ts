"use server";
import { prisma } from "@/lib/prisma";

export const getAgendamentosFuturos = async () => {
  const agendamentos = await prisma.agendamento.findMany({
    include: {
      cliente: true,
      veiculos: {
        include: {
          veiculo: true,
        },
      },
    },
    where: {
      serviceCompleted: null,
    },
    orderBy: {
      date: "asc",
    },
  });

  return agendamentos;
};

export const getAgendamentosFinalizados = async () => {
  const agendamentos = await prisma.agendamento.findMany({
    include: {
      cliente: true,
      veiculos: {
        include: {
          veiculo: true,
        },
      },
    },
    where: {
      serviceCompleted: {
        not: null,
      },
    },
    orderBy: {
      serviceCompleted: "asc",
    },
  });

  return agendamentos;
};
