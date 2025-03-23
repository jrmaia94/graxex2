"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { UserFull } from "./get-users";
import { revalidatePath } from "next/cache";
import { AgendamentoAlterado, Veiculo } from "@prisma/client";

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

export const updatePartialAgendamento = async (data: {
  id: number;
  date: Date;
  paymentMethod?: string | null;
}) => {
  try {
    const updatedAgendamento = await prisma.agendamento.update({
      where: {
        id: data.id,
      },
      data,
      include: {
        veiculos: {
          include: {
            veiculo: true,
          },
        },
      },
    });

    return updatedAgendamento;
  } catch (error) {
    throw error;
  }
};

export const addVeiculoToAgendamento = async (
  veiculo: Veiculo,
  agendamentoId: number
) => {
  try {
    const veiculoAdded = await prisma.agendamentosPorVeiculos.create({
      data: {
        agendamentoId,
        veiculoId: veiculo.id,
      },
    });
    const agendamentoUpdated = await prisma.agendamento.update({
      where: {
        id: agendamentoId,
      },
      data: {
        pricePerVeiculo: {
          push: {
            veiculoId: veiculo.id,
            price: calculatePrice(veiculo.numEixos),
            observacao: "",
          },
        },
        price: {
          increment: calculatePrice(veiculo.numEixos),
        },
      },
    });
    revalidatePath("/agendamento-parcial");
    revalidatePath("/agendamento-parcial/id");
    return { veiculoAdded, agendamentoUpdated };
  } catch (error) {
    throw error;
  }
};

export const removeVeiculoToAgendamento = async (
  veiculo: Veiculo,
  agendamento: AgendamentoAlterado
) => {
  try {
    const veiculoRemoved = await prisma.agendamentosPorVeiculos.delete({
      where: {
        veiculoId_agendamentoId: {
          agendamentoId: agendamento.id,
          veiculoId: veiculo.id,
        },
      },
    });
    const agendamentoUpdated = await prisma.agendamento.update({
      where: {
        id: agendamento.id,
      },
      data: {
        pricePerVeiculo:
          agendamento.pricePerVeiculo.filter(
            (item) => item.veiculoId !== veiculo.id
          ) || [],
        price: {
          decrement:
            agendamento.pricePerVeiculo.find((e) => e.veiculoId === veiculo.id)
              ?.price || 0,
        },
      },
    });
    revalidatePath("/agendamento-parcial");
    revalidatePath("/agendamento-parcial/id");
    return { veiculoRemoved, agendamentoUpdated };
  } catch (error) {
    throw error;
  }
};

export const addObsToAgendamento = async (
  agendamento: AgendamentoAlterado,
  veiculo: Veiculo,
  observacao: string,
  valor: number
) => {
  try {
    const valorCorrigido =
      valor -
      (agendamento.pricePerVeiculo.find((i) => i.veiculoId === veiculo.id)
        ?.price || 0);
    const updatedAgendamento = prisma.agendamento.update({
      where: {
        id: agendamento.id,
      },
      data: {
        pricePerVeiculo: agendamento.pricePerVeiculo.map((item) => {
          if (item.veiculoId === veiculo.id) {
            return { ...item, observacao, price: valor };
          } else {
            return item;
          }
        }),
        price: {
          increment: valorCorrigido,
        },
      },
    });
    revalidatePath("/agendamento-parcial");
    revalidatePath("/agendamento-parcial/id");
    return updatedAgendamento;
  } catch (error) {
    throw error;
  }
};

function calculatePrice(eixos: number) {
  switch (eixos) {
    case 9:
      return 110;
    case 8:
      return 100;
    case 7:
      return 90;
    case 6:
      return 80;
    case 5:
      return 75;
    case 4:
      return 70;
    case 3:
      return 60;
    case 2:
      return 50;
  }
}
