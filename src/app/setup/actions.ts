"use server";

import { redirect } from "next/navigation";
import { createAdminSchema } from "@/lib/validation";
import { needsFirstRunSetup, createUser, getUserByEmail } from "@/lib/users";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { accounts } from "@/db/auth-schema";

export type SetupState = { error?: string; fieldErrors?: Record<string, string> };

export async function createAdminAction(
  _prev: SetupState,
  formData: FormData,
): Promise<SetupState> {
  if (!(await needsFirstRunSetup())) {
    return { error: "Setup is already complete. Please sign in instead." };
  }

  const parsed = createAdminSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { fieldErrors };
  }

  if (await getUserByEmail(parsed.data.email)) {
    return { error: "That email is already registered." };
  }

  await createUser({ ...parsed.data, role: "super_admin" });

  // Give the new owner a better-auth credential account (password = the argon2
  // hash createUser stored), so they can sign in through better-auth.
  const user = await getUserByEmail(parsed.data.email);
  if (user) {
    await db.insert(accounts).values({
      id: `cred_${user.id}`,
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: user.passwordHash,
    });
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
      headers: await import("next/headers").then((m) => m.headers()),
    });
  }
  redirect("/");
}
