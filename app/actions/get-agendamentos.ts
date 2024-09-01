"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const getAgendamentosFuturos = async (user: User) => {
  if (user.perfil) {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        cliente: {
          include: {
            veiculos: true,
          },
        },
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
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getAgendamentosFinalizados = async (user: User) => {
  if (user.perfil) {
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
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getAllAgendamentos = async (user: User) => {
  if (user.perfil) {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        veiculos: {
          include: {
            veiculo: true,
          },
        },
        cliente: {
          include: { veiculos: true },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return agendamentos;
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getAgendamentoById = async (id: number, user: User) => {
  if (user.perfil) {
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
  } else {
    throw Error("Usuário não autorizado!");
  }
};
