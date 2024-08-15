"use server";
import { prisma } from "@/lib/prisma";

export const getSomeClientes = async (name: string) => {
  const clientes = await prisma.cliente.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return clientes;
};

export const getAllClientes = async () => {
  const clientes = await prisma.cliente.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return clientes;
};

export const getClienteById = async (id: string) => {
  const cliente = await prisma.cliente.findUnique({
    where: {
      id: id,
    },
  });

  return cliente;
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
