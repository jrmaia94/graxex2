"use server";

import { prisma } from "@/lib/prisma";

export const updateIsPaidAgendamento = async (id: number, isPaid: boolean) => {
  return await prisma.agendamento.update({
    where: { id },
    data: {
      paid: isPaid,
    },
  });
};
