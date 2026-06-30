"use server";

import { redirect } from "next/navigation";
import { createAdminSchema } from "@/lib/validation";
import { needsFirstRunSetup, createUser, getUserByEmail } from "@/lib/users";
import { signIn } from "@/auth";

export type SetupState = { error?: string; fieldErrors?: Record<string, string> };

export async function createAdminAction(
  _prev: SetupState,
  formData: FormData,
): Promise<SetupState> {
  // The first-run page is permanently disabled once any user exists (§5).
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

  // Guard against a race: re-check the email isn't taken.
  if (await getUserByEmail(parsed.data.email)) {
    return { error: "That email is already registered." };
  }

  await createUser({ ...parsed.data, role: "super_admin" });

  // Sign the new admin straight in, then land on the dashboard.
  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirect: false,
  });
  redirect("/");
}
