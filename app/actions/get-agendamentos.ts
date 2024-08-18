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

export const getAllAgendamentos = async () => {
  const agendamentos = await prisma.agendamento.findMany({
    include: {
      veiculos: {
        include: {
          veiculo: true,
        },
      },
      cliente: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return agendamentos;
};

export const getAgendamentoById = async (id: number) => {
  const agendamento = await prisma.agendamento.findUnique({
    where: {
      id: id,
    },
    include: {
      cliente: true,
      veiculos: {
        include: {
          veiculo: true,
        },
      },
    },
  });

  return agendamento;
};
