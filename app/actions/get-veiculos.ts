"use server";
import { prisma } from "@/lib/prisma";

export const getSomeVeiculos = async (name: string) => {
  const veiculos = await prisma.veiculo.findMany({
    include: {
      cliente: true,
    },
    where: {
      cliente: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return veiculos;
};

export const getAllVeiculos = async () => {
  const veiculos = await prisma.veiculo.findMany({
    orderBy: {
      clienteId: "asc",
    },
  });

  return veiculos;
};

export const getVeiculoById = async (id: number) => {
  const veiculo = await prisma.veiculo.findUnique({
    where: {
      id: id,
    },
  });

  return veiculo;
};

/* export const getAgendamentosFinalizados = async () => {
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
}; */
