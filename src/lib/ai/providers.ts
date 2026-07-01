import type { ProviderId, ProviderMeta } from "./types";

// Provider catalogue. Adding a 5th provider = one entry here + one adapter.
export const PROVIDERS: Record<ProviderId, ProviderMeta> = {
  anthropic: {
    id: "anthropic",
    label: "Anthropic (Claude)",
    defaultModel: "claude-opus-4-8",
    keysUrl: "https://console.anthropic.com/settings/keys",
  },
  openai: {
    id: "openai",
    label: "OpenAI",
    defaultModel: "gpt-5",
    keysUrl: "https://platform.openai.com/api-keys",
  },
  xai: {
    id: "xai",
    label: "xAI (Grok)",
    defaultModel: "grok-4",
    keysUrl: "https://console.x.ai",
  },
  google: {
    id: "google",
    label: "Google (Gemini)",
    defaultModel: "gemini-2.5-flash",
    keysUrl: "https://aistudio.google.com/app/apikey",
    freeNote: "Gemini has historically offered a free tier.",
  },
};

export const PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[];

export function isProviderId(v: unknown): v is ProviderId {
  return typeof v === "string" && v in PROVIDERS;
}
