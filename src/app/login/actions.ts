"use server";

import { headers } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { signInSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  // Same generic message whether the input is malformed or the credentials are
  // wrong — never reveal whether an account exists (§5).
  const generic = { error: "Email or password is incorrect." };
  if (!parsed.success) return generic;

  // Rate-limit by IP + email: 8 attempts / 5 min.
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit(`login:${ip}:${parsed.data.email}`, 8, 5 * 60_000);
  if (!limit.ok) {
    return {
      error: `Too many attempts. Try again in about ${Math.ceil(
        limit.retryAfterSec / 60,
      )} minute(s).`,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    // signIn throws a redirect on success — let framework errors propagate.
    unstable_rethrow(error);
    if (error instanceof AuthError) return generic;
    throw error;
  }
  return {};
}
