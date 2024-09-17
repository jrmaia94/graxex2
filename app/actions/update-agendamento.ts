"use server";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { z } from "zod";
import { UserFull } from "./get-users";

const dataSchema = z.object({
  id: z.number(),
  clienteId: z.number(),
  date: z.date(),
  serviceCompleted: z.date().nullable(),
});

export const updateAgendamento = async (
  agendamento: any,
  veiculos: any[],
  user: UserFull
) => {
  if (user.perfil && user.accessLevel.update) {
    const { id, ...data } = agendamento;
    console.log(agendamento);
    if (dataSchema.safeParse(agendamento).success) {
      try {
        await prisma.agendamentosPorVeiculos.deleteMany({
          where: {
            agendamentoId: agendamento.id,
          },
        });

        await prisma.agendamentosPorVeiculos.createMany({
          data: veiculos.map((veiculo) => ({
            agendamentoId: agendamento.id,
            veiculoId: veiculo.id,
          })),
        });
        const updatedAgendamento = await prisma.agendamento.update({
          where: {
            id: agendamento.id,
          },
          data: {
            date: data.date,
            serviceCompleted: data.serviceCompleted,
            clienteId: data.clienteId,
          },
        });

        return updatedAgendamento;
      } catch (error) {
        throw error;
      }
    } else {
      throw Error("Problem with the validation of schema!");
    }
  } else {
    throw Error("Usuário não autorizado!");
  }
};
