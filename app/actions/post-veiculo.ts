"use server";
import { prisma } from "@/lib/prisma";
import { User, Veiculo } from "@prisma/client";
import { z } from "zod";
import { UserFull } from "./get-users";

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
  | "ciclo"
  | "nomeMotorista"
  | "phoneMotorista"
>;

const dataSchema = z.object({
  clienteId: z.number(),
  modelo: z.string().min(2),
  fabricante: z.string().min(2).nullable(),
  placa: z.string().regex(/\D{3}\-\d\w\d{2}/gm),
  cor: z.string().nullable(),
  frota: z.string().nullable(),
  observacao: z.string().nullable(),
  numEixos: z.number(),
  nomeMotorista: z.string().optional(),
  phoneMotorista: z.string().optional(),
  ciclo: z.number(),
});

export const createVeiculo = async (veiculo: CreateVeiculo, user: UserFull) => {
  if (user.perfil && user.accessLevel.create) {
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
