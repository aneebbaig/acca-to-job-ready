import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_PATHS = ["/login", "/setup"];
const PUBLIC_PREFIXES = ["/api/auth", "/_next", "/favicon"];

// Optimistic cookie check (edge-safe). Role checks stay server-side in
// auth-guards (requireAdmin), not here.
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const loggedIn = !!getSessionCookie(req);

  if (!loggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  if (loggedIn && isPublic) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
