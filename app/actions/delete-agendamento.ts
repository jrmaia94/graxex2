"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const deleteAgendamentoById = async (id: number, user: User) => {
  if (user.perfil) {
    if (id > 0) {
      try {
        await prisma.agendamentosPorVeiculos.deleteMany({
          where: {
            agendamentoId: id,
          },
        });

        const agendamentoDeleted = await prisma.agendamento.delete({
          where: {
            id: id,
          },
        });

        return agendamentoDeleted;
      } catch (error) {
        throw error;
      }
    } else {
      throw Error("Id inválido!");
    }
  } else {
    throw Error("Usuário não autorizado!");
  }
};
