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
    }
  }
};
