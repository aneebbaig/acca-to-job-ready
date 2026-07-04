import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor, bearer } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { hash, verify } from "@node-rs/argon2";
import { db, schema } from "@/db";

// Fleet better-auth standard, adapted to acca's drizzle + argon2 stack.
// - drizzle adapter (keeps the existing data layer).
// - Custom argon2 hash/verify so existing password_hash values stay valid
//   (backfilled into the account table).
// - disableSignUp: first user comes through /setup; no open registration.
const ARGON = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    disableSignUp: true,
    password: {
      hash: (password) => hash(password, ARGON),
      verify: ({ hash: h, password }) => verify(h, password).catch(() => false),
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: false },
      status: { type: "string", defaultValue: "active", input: false },
    },
  },
  rateLimit: { enabled: true, window: 60, max: 100 },
  plugins: [twoFactor(), bearer(), nextCookies()],
});
