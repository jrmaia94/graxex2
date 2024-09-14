"use server";
import { prisma } from "@/lib/prisma";
import { User, Veiculo } from "@prisma/client";
import { z } from "zod";

export type CreateVeiculo = Pick<
  Veiculo,
  | "modelo"
  | "fabricante"
  | "cor"
  | "numEixos"
  | "placa"
  | "clienteId"
  | "frota"
  | "observacao"
>;

const dataSchema = z.object({
  clienteId: z.number(),
  modelo: z.string().min(2),
  fabricante: z.string().min(2).nullable(),
  placa: z.string().regex(/\D{3}\-\d\w\d{2}/gm),
  cor: z.string(),
  frota: z.string().nullable(),
  observacao: z.string().nullable(),
  numEixos: z.number(),
});

export const createVeiculo = async (veiculo: CreateVeiculo, user: User) => {
  if (user.perfil) {
    if (dataSchema.safeParse(veiculo).success) {
      try {
        const createdVeiculo = await prisma.veiculo.create({
          data: veiculo,
          include: {
            cliente: true,
          },
        });
        return createdVeiculo;
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
