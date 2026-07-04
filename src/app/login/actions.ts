"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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
  // Generic message whether malformed or wrong — never reveal account existence.
  const generic = { error: "Email or password is incorrect." };
  if (!parsed.success) return generic;

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit(`login:${ip}:${parsed.data.email}`, 8, 5 * 60_000);
  if (!limit.ok) {
    return {
      error: `Too many attempts. Try again in about ${Math.ceil(
        limit.retryAfterSec / 60,
      )} minute(s).`,
    };
  }

  let twoFactor = false;
  try {
    const res = await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
      headers: hdrs,
    });
    twoFactor = !!(res as { twoFactorRedirect?: boolean })?.twoFactorRedirect;
  } catch {
    return generic;
  }
  redirect(twoFactor ? "/login/2fa" : "/");
}
