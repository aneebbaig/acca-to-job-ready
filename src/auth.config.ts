import type { NextAuthConfig } from "next-auth";

// Edge-safe config: NO database or argon2 imports here, so it can run in
// middleware. The Credentials provider with its DB-backed `authorize` lives in
// auth.ts (Node runtime only). This split is the documented Auth.js v5 pattern.

const PUBLIC_PATHS = ["/login", "/setup"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    // Carry id/role/status onto the token so server checks never re-hit the DB
    // just to read a role.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "super_admin" | "admin" | "user";
        session.user.status = token.status as "active" | "inactive";
      }
      return session;
    },
    // Runs in middleware for every matched request. Gate private routes.
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isPublic = PUBLIC_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      );
      if (isPublic) return true;
      return Boolean(auth?.user);
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
