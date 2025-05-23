import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ username, password }) {
        if (!username || !password) return null;
        // buscar usuário
        const user = await prisma.user.findUnique({
          where: { username: username as string },
        });
        // se não encontrar, retornar null
        if (!user || !user.password) return null;
        // se encontrar, verificar se a senha está correta
        const isPasswordValid = await bcrypt.compare(
          password as string,
          user.password
        );
        // se a senha estiver errada, retornar nulo
        if (!isPasswordValid) return null;
        // se a senha estiver correta, retornar o usuário
        return { ...user };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        const email = token.email;
        const id = user.id;
        if (email) {
          const dbUser = await prisma.user.findUnique({
            where: {
              email: email,
            },
            include: {
              clientes: {
                include: {
                  cliente: true,
                },
              },
            },
          });
          token.perfil = dbUser?.perfil;
          token.accessLevel = dbUser?.accessLevel;
          token.ads = dbUser?.viewAds;
          token.typeUser = dbUser?.typeUser;
          token.clientes = dbUser?.clientes;
        } else if (id) {
          const dbUser = await prisma.user.findUnique({
            where: {
              id: id,
            },
            include: {
              clientes: {
                include: {
                  cliente: true,
                },
              },
            },
          });
          token.perfil = dbUser?.perfil;
          token.accessLevel = dbUser?.accessLevel;
          token.ads = dbUser?.viewAds;
          token.typeUser = dbUser?.typeUser;
          token.clientes = dbUser?.clientes;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub || "";
      session.user.perfil = token.perfil;
      session.user.accessLevel = token.accessLevel;
      session.user.ads = token.ads;
      session.user.typeUser = token.typeUser;
      session.user.clientes = token.clientes;

      return session;
    },
  },

  secret: process.env.NEXT_AUTH_SECRET,
});
