import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next 16 proxy (formerly middleware), runs on the Node runtime. Auth gating
// only — the authorized callback in auth.config decides page access. The
// first-run setup redirect lives in server components, which can query the DB.
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  // Gate pages only. API routes do their own auth() + ownership checks and
  // return 401/403 (a redirect is the wrong response for a fetch).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
