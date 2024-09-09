"use server";

import { z } from "zod";
import { Agendamento, User, Veiculo } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const dataSchema = z.object({
  clienteId: z.number(),
  price: z.number(),
  pricePerVeiculo: z.array(
    z.object({ veiculoId: z.number(), price: z.number() })
  ),
  veiculos: z.array(
    z.object({
      id: z.number(),
      modelo: z.string(),
      fabricante: z.string().nullable(),
      imageUrl: z.string().nullable(),
      placa: z.string().min(7),
      cor: z.string().nullable(),
      numEixos: z.number(),
      clienteId: z.number(),
    })
  ),
  date: z.date(),
  serviceCompleted: z.date().nullable(),
});

export const createAgendamento = async (agendamento: any, user: User) => {
  console.log(agendamento);
  if (user.perfil) {
    if (dataSchema.safeParse(agendamento).success) {
      try {
        const createdAgendamento = await prisma.agendamento.create({
          data: {
            date: agendamento.date,
            clienteId: agendamento.clienteId,
            serviceCompleted: agendamento.serviceCompleted,
            price: agendamento.price,
            pricePerVeiculo: agendamento.pricePerVeiculo,
            veiculos: {
              create: agendamento.veiculos.map((veiculo: any) => {
                return {
                  veiculo: {
                    connect: {
                      id: veiculo.id,
                    },
                  },
                };
              }),
            },
          },
        });
        return createdAgendamento;
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
