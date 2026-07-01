import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

// AES-256-GCM for the OPT-IN at-rest storage of a user's API key (§6). By
// default keys are never stored server-side at all; this is only used when the
// user explicitly opts in. Never log the plaintext.

function getKey(): Buffer {
  const secret = process.env.KEY_ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error(
      "KEY_ENCRYPTION_SECRET is not set, required to store AI keys at rest.",
    );
  }
  const buf = Buffer.from(secret, "base64");
  if (buf.length !== 32) {
    throw new Error("KEY_ENCRYPTION_SECRET must be 32 bytes (base64-encoded).");
  }
  return buf;
}

export function encryptKey(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // iv.tag.ciphertext, all base64.
  return `${iv.toString("base64")}.${tag.toString("base64")}.${enc.toString("base64")}`;
}

export function decryptKey(stored: string): string {
  const [ivB64, tagB64, dataB64] = stored.split(".");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    getKey(),
    Buffer.from(ivB64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);
  return dec.toString("utf8");
}
