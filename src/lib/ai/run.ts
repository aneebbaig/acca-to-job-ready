import "server-only";
import { AIError, type LLMRequest, type LLMResult, type ProviderId } from "./types";

// All provider calls run server-side (§6): avoids CORS and keeps the user's key
// off the client. The key is forwarded per-request and never logged or stored.

const TIMEOUT_MS = 60_000;

async function callJSON(
  url: string,
  init: RequestInit,
): Promise<{ ok: boolean; status: number; body: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new AIError("The AI provider took too long to respond. Try again.");
    }
    throw new AIError("Couldn't reach the AI provider. Check your connection.");
  } finally {
    clearTimeout(timer);
  }
}

// Turn a provider HTTP failure into a friendly message (never leak the key).
function friendlyError(status: number): string {
  if (status === 401 || status === 403)
    return "That API key was rejected. Check it in Settings.";
  if (status === 429)
    return "You've hit your provider's rate limit or quota. Try again shortly.";
  if (status >= 500) return "The AI provider had a problem. Try again.";
  return "The AI request failed. Check your key and model in Settings.";
}

// --- Anthropic (Messages API) --------------------------------------------
// Verified against the official Messages API: x-api-key + anthropic-version
// headers; response is a content array of blocks.
async function anthropic(req: LLMRequest): Promise<LLMResult> {
  const { ok, status, body } = await callJSON(
    "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": req.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: req.model,
        max_tokens: req.maxTokens ?? 4096,
        system: req.system,
        messages: [{ role: "user", content: req.user }],
      }),
    },
  );
  if (!ok) throw new AIError(friendlyError(status), status);
  const blocks = (body as { content?: { type: string; text?: string }[] })
    .content;
  const text = blocks
    ?.filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("")
    .trim();
  if (!text) throw new AIError("The AI returned an empty response.");
  return { text };
}

// --- OpenAI-compatible (OpenAI + xAI Grok) -------------------------------
// xAI's API is OpenAI-compatible; only the base URL differs.
async function openAICompatible(
  req: LLMRequest,
  baseUrl: string,
): Promise<LLMResult> {
  const { ok, status, body } = await callJSON(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${req.apiKey}`,
    },
    body: JSON.stringify({
      model: req.model,
      messages: [
        { role: "system", content: req.system },
        { role: "user", content: req.user },
      ],
      ...(req.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!ok) throw new AIError(friendlyError(status), status);
  const text = (
    body as { choices?: { message?: { content?: string } }[] }
  ).choices?.[0]?.message?.content?.trim();
  if (!text) throw new AIError("The AI returned an empty response.");
  return { text };
}

// --- Google Gemini (generateContent) -------------------------------------
async function google(req: LLMRequest): Promise<LLMResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    req.model,
  )}:generateContent`;
  const { ok, status, body } = await callJSON(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": req.apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: req.system }] },
      contents: [{ role: "user", parts: [{ text: req.user }] }],
      generationConfig: req.json
        ? { responseMimeType: "application/json" }
        : {},
    }),
  });
  if (!ok) throw new AIError(friendlyError(status), status);
  const text = (
    body as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    }
  ).candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
  if (!text) throw new AIError("The AI returned an empty response.");
  return { text };
}

// The single dispatch the rest of the app uses.
export function runLLM(provider: ProviderId, req: LLMRequest): Promise<LLMResult> {
  switch (provider) {
    case "anthropic":
      return anthropic(req);
    case "openai":
      return openAICompatible(req, "https://api.openai.com/v1");
    case "xai":
      return openAICompatible(req, "https://api.x.ai/v1");
    case "google":
      return google(req);
  }
}

// Strip Markdown code fences a model may wrap JSON in, then parse.
export function parseJSONLoose<T>(text: string): T {
  let s = text.trim();
  const fence = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) s = fence[1].trim();
  // If there's leading prose, grab the first {...} or [...] span.
  if (s[0] !== "{" && s[0] !== "[") {
    const start = s.search(/[{[]/);
    if (start >= 0) s = s.slice(start);
  }
  return JSON.parse(s) as T;
}
