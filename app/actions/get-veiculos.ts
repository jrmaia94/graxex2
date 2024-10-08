"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const getSomeVeiculos = async (param: string, user: User) => {
  if (user.perfil) {
    const veiculos = await prisma.veiculo.findMany({
      include: {
        cliente: true,
      },
      where: {
        OR: [
          {
            cliente: {
              name: {
                contains: param,
                mode: "insensitive",
              },
            },
          },
          {
            placa: {
              mode: "insensitive",
              contains: param,
            },
          },
          {
            fabricante: {
              mode: "insensitive",
              contains: param,
            },
          },
          {
            frota: {
              mode: "insensitive",
              contains: param,
            },
          },
          {
            modelo: {
              mode: "insensitive",
              contains: param,
            },
          },
        ],
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
        id: "desc",
      },
      include: {
        cliente: true,
        agendamentos: {
          include: { agendamento: true },
        },
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
      include: {
        cliente: true,
      },
    });
    return veiculo;
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getFullVeiculoById = async (id: number, user: User) => {
  if (user.perfil) {
    const veiculo = await prisma.veiculo.findUnique({
      where: {
        id: id,
      },
      include: {
        agendamentos: {
          include: {
            agendamento: true,
          },
        },
        cliente: true,
      },
    });
    return veiculo;
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
