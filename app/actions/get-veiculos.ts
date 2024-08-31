"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const getSomeVeiculos = async (name: string, user: User) => {
  if (user.perfil) {
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
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getAllVeiculos = async (user: User) => {
  if (user.perfil) {
    const veiculos = await prisma.veiculo.findMany({
      orderBy: {
        clienteId: "asc",
      },
    });
    return veiculos;
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getVeiculoById = async (id: number, user: User) => {
  if (user.perfil) {
    const veiculo = await prisma.veiculo.findUnique({
      where: {
        id: id,
      },
    });
    return veiculo;
  } else {
    throw Error("Usuário não autorizado!");
  }
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
