"use server";
import { prisma } from "@/lib/prisma";
import { Agendamento, User } from "@prisma/client";
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
            date: agendamento.date,
            serviceCompleted: agendamento.serviceCompleted,
            clienteId: agendamento.clienteId,
            price: agendamento.price,
            paid: agendamento.paid,
            paymentMethod: agendamento.paymentMethod,
            pricePerVeiculo: agendamento.pricePerVeiculo || [],
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
