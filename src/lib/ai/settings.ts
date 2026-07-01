import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { aiSettings } from "@/db/schema";
import type { ProviderId } from "./types";
import { encryptKey, decryptKey } from "./crypto";

export async function getAiSettings(userId: string) {
  const [row] = await db
    .select()
    .from(aiSettings)
    .where(eq(aiSettings.userId, userId))
    .limit(1);
  return row ?? null;
}

export async function saveAiSettings(
  userId: string,
  provider: ProviderId,
  model: string,
  opts: { storeKey?: string | null } = {},
) {
  // storeKey === undefined → leave stored key as-is.
  // storeKey === null      → clear any stored key (back to browser-only).
  // storeKey === string    → encrypt and store (opt-in).
  const set: {
    provider: ProviderId;
    model: string;
    updatedAt: Date;
    encryptedKey?: string | null;
  } = { provider, model, updatedAt: new Date() };

  if (opts.storeKey === null) set.encryptedKey = null;
  else if (typeof opts.storeKey === "string")
    set.encryptedKey = encryptKey(opts.storeKey);

  await db
    .insert(aiSettings)
    .values({
      userId,
      provider,
      model,
      encryptedKey:
        typeof opts.storeKey === "string" ? set.encryptedKey : undefined,
    })
    .onConflictDoUpdate({ target: aiSettings.userId, set });
}

// Resolve the key for a request: the per-request header wins (browser-stored,
// never persisted); fall back to the opt-in encrypted key if present.
export async function resolveKey(
  userId: string,
  headerKey: string | null,
): Promise<{ provider: ProviderId; model: string; apiKey: string } | null> {
  const row = await getAiSettings(userId);
  if (!row?.provider || !row.model) return null;
  let apiKey = headerKey?.trim() || "";
  if (!apiKey && row.encryptedKey) {
    try {
      apiKey = decryptKey(row.encryptedKey);
    } catch {
      apiKey = "";
    }
  }
  if (!apiKey) return null;
  return { provider: row.provider, model: row.model, apiKey };
}
