"use client";

// By default the user's API key lives ONLY in their browser (§6). It is sent to
// the server per request in a header and never persisted server-side. These
// helpers are the browser store.

const STORAGE_KEY = "acca_ai_key";

export function getStoredKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setStoredKey(key: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    /* storage unavailable; nothing to do */
  }
}

export function clearStoredKey() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// Attach the browser key to a fetch as a per-request header.
export function withKeyHeader(headers: HeadersInit = {}): HeadersInit {
  const key = getStoredKey();
  return key ? { ...headers, "x-ai-key": key } : headers;
}
