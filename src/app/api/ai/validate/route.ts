import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { runLLM } from "@/lib/ai/run";
import { AIError } from "@/lib/ai/types";
import { isProviderId } from "@/lib/ai/providers";

// Validate a provider + model + key with a tiny test call (§6). The key arrives
// in a per-request header and is never persisted or logged here.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  }

  const apiKey = req.headers.get("x-ai-key")?.trim();
  let body: { provider?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Bad request." }, { status: 400 });
  }
  const { provider, model } = body;
  if (!isProviderId(provider) || !model || !apiKey) {
    return NextResponse.json(
      { ok: false, message: "Pick a provider, enter a model, and paste a key." },
      { status: 400 },
    );
  }

  try {
    await runLLM(provider, {
      apiKey,
      model,
      system: "You are a connectivity test. Reply with the single word OK.",
      user: "Reply OK.",
      maxTokens: 5,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message =
      e instanceof AIError ? e.message : "The test call failed. Check the model name.";
    return NextResponse.json({ ok: false, message });
  }
}
