import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { assessmentAttempts } from "@/db/schema";
import { getTopic } from "@/curriculum";
import { resolveKey } from "@/lib/ai/settings";
import { getTopicProgress } from "@/lib/progress";
import { generateTask } from "@/lib/assessment/generate";
import { AIError } from "@/lib/ai/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { topicSlug?: string; tier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Bad request." }, { status: 400 });
  }
  const topic = body.topicSlug ? getTopic(body.topicSlug) : undefined;
  if (!topic || !topic.skillSpec) {
    return NextResponse.json(
      { message: "This topic has no practice yet." },
      { status: 400 },
    );
  }
  const spec = topic.skillSpec;

  // Map the picked tier to a concrete difficulty + optional task type. The
  // difficulty range lives in the skill-spec, so the client never needs it.
  const { min, max } = spec.difficulty;
  const mid = Math.round((min + max) / 2);
  let tierDifficulty: number | null = null;
  let preferredType: typeof spec.taskTypes[number] | undefined;
  switch (body.tier) {
    case "warmup":
      if (spec.taskTypes.includes("warmup_mcq")) {
        preferredType = "warmup_mcq";
        tierDifficulty = min;
      }
      break;
    case "easy":
      tierDifficulty = min;
      break;
    case "medium":
      tierDifficulty = mid;
      break;
    case "hard":
      tierDifficulty = max;
      break;
    // "adaptive" or unset: fall through to score-based adaptation.
  }

  const resolved = await resolveKey(userId, req.headers.get("x-ai-key"));
  if (!resolved) {
    return NextResponse.json(
      { message: "Add your AI key in Settings to practise." },
      { status: 400 },
    );
  }

  // Adapt difficulty to the learner's recent best score on this topic (§8.4).
  const progress = await getTopicProgress(userId, topic.slug);

  try {
    const { taskType, difficulty, task, answerKey } = await generateTask(
      resolved.provider,
      resolved.apiKey,
      resolved.model,
      spec,
      {
        preferredType,
        difficulty: tierDifficulty,
        recentScore: progress?.masteryEstimate ?? progress?.bestScore ?? null,
      },
    );

    const [attempt] = await db
      .insert(assessmentAttempts)
      .values({
        userId,
        topicSlug: topic.slug,
        taskType,
        difficulty,
        task,
        answerKey, // hidden, never returned until after submission
      })
      .returning({ id: assessmentAttempts.id });

    // Return the task only, never the answer key (§8.3).
    return NextResponse.json({ attemptId: attempt.id, taskType, difficulty, task });
  } catch (e) {
    const message =
      e instanceof AIError ? e.message : "Couldn't generate a task. Try again.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
