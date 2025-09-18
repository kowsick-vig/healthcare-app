import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "credentials",
      name: "Dev Login",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(creds) {
        const email = (creds?.email ?? "").toString().trim().toLowerCase();
        if (!email) return null;
        // ensure user exists in DB so you can store roles there
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email }, // role defaults to PATIENT per your schema
        });
        return { id: user.id, email: user.email } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // on sign-in, ensure email on token
      if (user?.email) token.email = user.email.toLowerCase();
      // fetch role from DB
      if (token.email) {
        const u = await prisma.user.findUnique({ where: { email: token.email as string } });
        (token as any).role = u?.role ?? "PATIENT";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = (token.email as string) || session.user.email;
        (session.user as any).role = (token as any).role || "PATIENT";
      }
      return session;
    },
  },
  debug: true,
};
