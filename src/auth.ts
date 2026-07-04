import "server-only";
import { headers } from "next/headers";
import { auth as betterAuth } from "@/lib/auth";

/**
 * Back-compat shim: the app calls `await auth()` in server components, guards,
 * and route handlers. Returns the better-auth session ({ user, session }) or
 * null. user carries id/email/name/role/status.
 */
export async function auth() {
  return betterAuth.api.getSession({ headers: await headers() });
}
