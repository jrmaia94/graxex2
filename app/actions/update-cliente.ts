"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CreateCliente } from "./post-cliente";
import { User } from "@prisma/client";
import { UserFull } from "./get-users";

export interface UpdateCliente extends CreateCliente {
  id: number;
}

const dataSchema = z.object({
  id: z.number(),
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
});

export const updateCliente = async (cliente: UpdateCliente, user: UserFull) => {
  if (user.perfil && user.accessLevel.update) {
    const { id, ...data } = cliente;
    if (dataSchema.safeParse(cliente).success) {
      try {
        const updatedCliente = await prisma.cliente.update({
          where: {
            id: cliente.id,
          },
          data: data,
        });
        return updatedCliente;
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
