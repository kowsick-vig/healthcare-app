import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const A = (process.env.ADMIN_EMAILS || "").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
const P = (process.env.PROVIDER_EMAILS || "").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);

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
        return { id: "dev-" + email, email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email.toLowerCase();
      const em = (token.email as string) || "";
      (token as any).role = A.includes(em) ? "ADMIN" : P.includes(em) ? "PROVIDER" : "PATIENT";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        (session.user as any).role = (token as any).role || "PATIENT";
      }
      return session;
    },
  },
  debug: true,
};
