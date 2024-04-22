import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      if (!session.user) return session;

      session.user.name = token.name;
      session.user.email = token.email || "";
      session.user.role = token.role;
      session.user.is2FaEnabled = token.is2FaEnabled;
      session.user.isOAuth = token.isOAuth;

      if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);

      if (!user) return token;

      const account = await getAccountByUserId(user.id);

      token.name = user.name;
      token.email = user.email;
      token.role = user.role;
      token.is2FaEnabled = user.is2FaEnabled;
      token.isOAuth = !!account;

      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) return false;

      if (existingUser.is2FaEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
