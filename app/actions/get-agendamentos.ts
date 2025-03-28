"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export const getAgendamentosFuturos = async (user: User) => {
  if (user.perfil) {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        cliente: {
          include: {
            veiculos: {
              include: {
                cliente: true,
              },
            },
          },
        },
        veiculos: {
          include: {
            veiculo: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
      where: {
        serviceCompleted: null,
      },
      orderBy: {
        serviceCompleted: "desc",
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
        cliente: {
          include: {
            veiculos: {
              include: {
                cliente: true,
              },
            },
          },
        },
        veiculos: {
          include: {
            veiculo: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
      where: {
        serviceCompleted: {
          not: null,
        },
      },
      orderBy: {
        serviceCompleted: "desc",
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
            veiculo: {
              include: {
                cliente: true,
              },
            },
          },
        },
        cliente: {
          include: {
            veiculos: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
      orderBy: {
        serviceCompleted: "desc",
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
        veiculos: {
          include: {
            veiculo: {
              include: {
                cliente: true,
              },
            },
          },
        },
        cliente: {
          include: {
            veiculos: {
              include: {
                cliente: true,
                agendamentos: { include: { agendamento: true } },
              },
            },
          },
        },
      },
    });

    return agendamento;
  } else {
    throw Error("Usuário não autorizado!");
  }
};
