"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const getSomeClientes = async (name: string, user: User) => {
  if (user.perfil) {
    const clientes = await prisma.cliente.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        veiculos: true,
        agendamentos: {
          include: {
            cliente: true,
            veiculos: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return clientes;
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getAllClientes = async (user: User) => {
  if (user.perfil) {
    const clientes = await prisma.cliente.findMany({
      include: {
        veiculos: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return clientes;
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getClienteById = async (id: number, user: User) => {
  if (user.perfil) {
    const cliente = await prisma.cliente.findUnique({
      where: {
        id: id,
      },
      include: {
        veiculos: true,
      },
    });
    return cliente;
  } else {
    throw Error("Usuário não autorizado!");
  }
};

export const getFullClienteById = async (id: number, user: User) => {
  if (user.perfil) {
    const cliente = await prisma.cliente.findUnique({
      where: {
        id: id,
      },
      include: {
        veiculos: {
          include: {
            agendamentos: {
              include: {
                agendamento: true,
              },
            },
            cliente: true,
          },
        },
        agendamentos: true,
      },
    });
    return cliente;
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
