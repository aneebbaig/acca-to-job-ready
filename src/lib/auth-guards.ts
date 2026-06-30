import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Use in server components / server actions to require a signed-in user.
// Redirects to /login when absent. Returns the session user.
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

// Admin-only (super_admin or admin). Guards user-management server-side, not
// just in the UI (§5).
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "super_admin" && user.role !== "admin") {
    redirect("/");
  }
  return user;
}

export function isAdminRole(role: string) {
  return role === "super_admin" || role === "admin";
}
