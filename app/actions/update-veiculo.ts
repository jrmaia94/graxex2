"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CreateVeiculo } from "./post-veiculo";
import { User } from "@prisma/client";

export interface UpdateVeiculo extends CreateVeiculo {
  id: number;
}

const dataSchema = z.object({
  clienteId: z.number(),
  modelo: z.string().min(2),
  fabricante: z.string().min(2).nullable(),
  placa: z.string().regex(/\D{3}\-\d\w\d{2}/gm),
  cor: z.string().nullable(),
  frota: z.string().nullable(),
  observacao: z.string().nullable(),
  numEixos: z.number(),
});

export const updateVeiculo = async (veiculo: UpdateVeiculo, user: User) => {
  if (user.perfil) {
    const { id, ...data } = veiculo;
    if (dataSchema.safeParse(veiculo).success) {
      try {
        const updatedVeiculo = await prisma.veiculo.update({
          where: {
            id: veiculo.id,
          },
          data: data,
          include: {
            cliente: true,
          },
        });
        return updatedVeiculo;
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
