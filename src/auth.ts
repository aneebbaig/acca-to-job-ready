import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { signInSchema } from "@/lib/validation";
import { getUserByEmail } from "@/lib/users";
import { verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await getUserByEmail(parsed.data.email);

        // Always run a verify to keep timing uniform and avoid leaking whether
        // an email exists (§5: no user enumeration). The dummy hash below is a
        // real argon2id hash of a random string.
        const hashToCheck =
          user?.passwordHash ??
          "$argon2id$v=19$m=19456,t=2,p=1$HxlqGKIUVHry89Vv6x3pjg$BZ82WdA39YWrbo0P4xfDnbhu2ZHQYJWArGM+ESb+1lQ";
        const ok = await verifyPassword(hashToCheck, parsed.data.password);

        if (!user || !ok) return null;
        if (user.status !== "active") return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
});
