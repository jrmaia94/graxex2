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
        data: data,
      });
      return user;
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
