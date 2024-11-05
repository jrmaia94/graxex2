"use server";
import { prisma } from "@/lib/prisma";
import { Cliente } from "@prisma/client";
import { z } from "zod";
import { UserFull } from "./get-users";

export type CreateCliente = Pick<
  Cliente,
  "name" | "address" | "CPFCNPJ" | "phone" | "ciclo"
>;

const dataSchema = z.object({
  name: z.string().min(2),
  address: z.string().nullable(),
  CPFCNPJ: z
    .union([
      z.string().regex(/\d{3}\.\d{3}\.\d{3}\-\d{2}/gm),
      z.string().regex(/\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}/gm),
    ])
    .nullable(),
  phone: z
    .string()
    .regex(/\+55\(\d{2}\)\d{5}\-\d{4}/gm)
    .nullable(),
  ciclo: z.number(),
});

export const createCliente = async (cliente: CreateCliente, user: UserFull) => {
  if (user.perfil && user.accessLevel.create) {
    if (dataSchema.safeParse(cliente).success) {
      try {
        const createdCliente = await prisma.cliente.create({
          data: cliente,
        });
        return createdCliente;
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
