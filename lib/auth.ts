import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
    async jwt({ token, account }) {
      if (account) {
        const id = account.providerAccountId;

        const user = await prisma.user.findUnique({
          where: {
            id: id,
          },
        });

        token.perfil = user?.perfil;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub || "";
      session.user.perfil = token.perfil;

      return session;
    },
  },
});
