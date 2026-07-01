import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTopic } from "@/curriculum";
import { resolveKey } from "@/lib/ai/settings";
import { generateDataset } from "@/lib/assessment/dataset";
import { AIError } from "@/lib/ai/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  let body: { topicSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Bad request." }, { status: 400 });
  }
  const topic = body.topicSlug ? getTopic(body.topicSlug) : undefined;
  if (!topic?.skillSpec?.taskTypes.includes("excel_task")) {
    return NextResponse.json(
      { message: "No spreadsheet practice for this topic." },
      { status: 400 },
    );
  }

  const resolved = await resolveKey(session.user.id, req.headers.get("x-ai-key"));
  if (!resolved) {
    return NextResponse.json(
      { message: "Add your AI key in Settings to generate a dataset." },
      { status: 400 },
    );
  }

  try {
    const dataset = await generateDataset(
      resolved.provider,
      resolved.apiKey,
      resolved.model,
      topic.title,
      topic.skillSpec.concepts,
    );
    return NextResponse.json(dataset);
  } catch (e) {
    const message =
      e instanceof AIError ? e.message : "Couldn't build a dataset. Try again.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
