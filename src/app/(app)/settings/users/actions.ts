"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guards";
import {
  createUserSchema,
  resetPasswordSchema,
} from "@/lib/validation";
import {
  createUser,
  getUserByEmail,
  getUserById,
  listUsers,
  setUserRole,
  setUserStatus,
  resetUserPassword,
} from "@/lib/users";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, ne, sql } from "drizzle-orm";

type ActionResult = { ok: boolean; message: string };

const PATH = "/settings/users";

async function superAdminCount(excludeId?: string): Promise<number> {
  const where = excludeId
    ? and(eq(users.role, "super_admin"), ne(users.id, excludeId))
    : eq(users.role, "super_admin");
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(users)
    .where(where);
  return row?.n ?? 0;
}

export async function createUserAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  // Only a super_admin may mint another super_admin.
  if (parsed.data.role === "super_admin" && admin.role !== "super_admin") {
    return { ok: false, message: "Only a super admin can create super admins." };
  }

  if (await getUserByEmail(parsed.data.email)) {
    return { ok: false, message: "That email is already registered." };
  }

  await createUser(parsed.data);
  revalidatePath(PATH);
  return { ok: true, message: `Created ${parsed.data.email}.` };
}

export async function toggleStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("userId"));
  const target = await getUserById(id);
  if (!target) return;

  // Can't deactivate yourself, and can't deactivate the last active super admin.
  if (id === admin.id) return;
  if (
    target.role === "super_admin" &&
    target.status === "active" &&
    (await superAdminCount(id)) === 0
  ) {
    return;
  }

  await setUserStatus(id, target.status === "active" ? "inactive" : "active");
  revalidatePath(PATH);
}

export async function changeRoleAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("userId"));
  const role = String(formData.get("role")) as
    | "user"
    | "admin"
    | "super_admin";
  if (!["user", "admin", "super_admin"].includes(role)) return;

  const target = await getUserById(id);
  if (!target) return;

  // Only super_admin can grant/revoke super_admin.
  if (
    (role === "super_admin" || target.role === "super_admin") &&
    admin.role !== "super_admin"
  ) {
    return;
  }
  // Don't demote the last super admin.
  if (
    target.role === "super_admin" &&
    role !== "super_admin" &&
    (await superAdminCount(id)) === 0
  ) {
    return;
  }

  await setUserRole(id, role);
  revalidatePath(PATH);
}

export async function resetPasswordAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = resetPasswordSchema.safeParse({
    userId: formData.get("userId"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }
  const target = await getUserById(parsed.data.userId);
  if (!target) return { ok: false, message: "User not found." };

  await resetUserPassword(parsed.data.userId, parsed.data.password);
  return { ok: true, message: `Password reset for ${target.email}.` };
}

export async function getUsers() {
  await requireAdmin();
  return listUsers();
}
