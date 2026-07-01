import { hash, verify } from "@node-rs/argon2";

// Argon2id via @node-rs/argon2 (prebuilt native, works on serverless hosts like
// Vercel). Argon2id is this library's default algorithm. Same modern
// memory-hard hashing (§5), tuned for interactive login.
const OPTIONS = {
  memoryCost: 19456, // ~19 MiB
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, OPTIONS);
}

export async function verifyPassword(
  hashed: string,
  plain: string,
): Promise<boolean> {
  try {
    return await verify(hashed, plain);
  } catch {
    return false;
  }
}
