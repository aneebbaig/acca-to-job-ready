import "server-only";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, profiles } from "@/db/schema";
import { hashPassword } from "@/lib/password";

export async function userCount(): Promise<number> {
  const [row] = await db.select({ n: sql<number>`count(*)::int` }).from(users);
  return row?.n ?? 0;
}

// True until the first (super-admin) account exists. Drives the first-run flow.
export async function needsFirstRunSetup(): Promise<boolean> {
  return (await userCount()) === 0;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return user ?? null;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

type CreateInput = {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "super_admin";
};

export async function createUser(input: CreateInput) {
  const passwordHash = await hashPassword(input.password);
  const [created] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
    })
    .returning();
  // Every user gets an (empty) profile row up front.
  await db.insert(profiles).values({ userId: created.id });
  return created;
}

export async function listUsers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt);
}

export async function setUserStatus(
  id: string,
  status: "active" | "inactive",
) {
  await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id));
}

export async function setUserRole(
  id: string,
  role: "user" | "admin" | "super_admin",
) {
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id));
}

export async function resetUserPassword(id: string, password: string) {
  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, id));
}
