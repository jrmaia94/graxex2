"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { UserFull } from "./get-users";
import { Agendamento } from "@prisma/client";

const dataSchema = z.object({
  clienteId: z.number(),
  price: z.number(),
  paid: z.boolean().optional(),
  paymentMethod: z.string().optional(),
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

export const createAgendamento = async (agendamento: any, user: UserFull) => {
  if (user.perfil && user.accessLevel.create) {
    if (dataSchema.safeParse(agendamento).success) {
      try {
        const data = {
          date: agendamento.date,
          clienteId: agendamento.clienteId,
          serviceCompleted: agendamento.serviceCompleted,
          price: agendamento.price,
          paid: agendamento.paid,
          paymentMethod: agendamento.paymentMethod,
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
        };
        const createdAgendamento = await prisma.agendamento.create({
          data: data,
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

export const createPartialAgendamento = async (
  agendamento: Pick<Agendamento, "clienteId" | "date">
) => {
  return await prisma.agendamento.create({
    data: {
      clienteId: agendamento.clienteId,
      date: agendamento.date,
      paid: false,
      serviceCompleted: agendamento.date,
    },
    include: {
      veiculos: {
        include: {
          agendamento: true,
        },
      },
      cliente: true,
    },
  });
};
