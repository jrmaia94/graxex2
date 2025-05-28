"use server";

import { prisma } from "@/lib/prisma";
import { UserFull } from "./get-users";

export const updateUser = async (data: UserFull, user: UserFull) => {
  if (user) {
    if (user.accessLevel?.admin) {
      const user = prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          accessLevel: data.accessLevel,
          perfil: data.perfil,
          typeUser: data.typeUser,
        },
      });
      return user;
    } else {
      throw Error("Usuário não autorizado");
    }
  } else {
    throw Error("Problema na verificação do usuário");
  }
};

export const addClienteInUser = async (
  clienteId: number[],
  userId: string,
  user: UserFull
) => {
  if (user) {
    if (user.accessLevel?.admin) {
      await prisma.usuariosPorCliente.deleteMany({
        where: {
          userId,
        },
      });

      await prisma.usuariosPorCliente.createMany({
        data: clienteId.map((id) => ({
          userId,
          clienteId: id,
        })),
      });
    } else {
      throw Error("Usuário não autorizado");
    }
  } else {
    throw Error("Problema na verificação do usuário");
  }
};

export const disableAdsForUser = async (user: UserFull) => {
  if (user) {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        viewAds: false,
      },
    });
    return updatedUser;
  } else {
    throw Error("Problema na verificação do usuário");
  }
};

export const getAdsSituation = async (user: UserFull) => {
  if (user) {
    const getUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    return getUser;
  } else {
    throw Error("Problema na verificação do usuário");
  }
};
