// Self-owned AI adapter layer (§6). No third-party AI SDK — each provider has a
// thin adapter that calls its official REST endpoint. The rest of the app only
// uses the two operations in this interface and never cares which provider ran.

export type ProviderId = "anthropic" | "openai" | "xai" | "google";

export interface ProviderMeta {
  id: ProviderId;
  label: string;
  // A sensible current-stable default model; the user can override it. Model
  // names move fast — the validate step surfaces a bad one with a clear message.
  defaultModel: string;
  // Where the user gets a key (shown in Settings).
  keysUrl: string;
  freeNote?: string;
}

export interface LLMRequest {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  // Ask the provider to return strict JSON where supported.
  json?: boolean;
  maxTokens?: number;
}

export interface LLMResult {
  text: string;
}

// Thrown by adapters with a user-friendly message (never includes the key).
export class AIError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "AIError";
  }
}
