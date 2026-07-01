import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { assessmentAttempts } from "@/db/schema";
import { resolveKey } from "@/lib/ai/settings";
import { gradeSubmission } from "@/lib/assessment/grade";
import {
  answerKeySchema,
  generatedTaskSchema,
  submissionSchema,
} from "@/lib/assessment/schema";
import { recordAttemptStats } from "@/lib/progress";
import { AIError } from "@/lib/ai/types";
import type { TaskType } from "@/curriculum/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { attemptId?: string; submission?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Bad request." }, { status: 400 });
  }
  if (!body.attemptId) {
    return NextResponse.json({ message: "Missing attempt." }, { status: 400 });
  }

  // Ownership check: only the user's own attempt (§5).
  const [attempt] = await db
    .select()
    .from(assessmentAttempts)
    .where(
      and(
        eq(assessmentAttempts.id, body.attemptId),
        eq(assessmentAttempts.userId, userId),
      ),
    )
    .limit(1);
  if (!attempt) {
    return NextResponse.json({ message: "Attempt not found." }, { status: 404 });
  }

  const key = answerKeySchema.parse(attempt.answerKey);

  // Submitting locks the attempt; if already graded, just return it.
  if (attempt.submittedAt) {
    return NextResponse.json({
      grade: attempt.feedback,
      workedSolution: key.workedSolution,
      locked: true,
    });
  }

  const submission = submissionSchema.safeParse(body.submission);
  if (!submission.success) {
    return NextResponse.json({ message: "Your answer couldn't be read." }, { status: 400 });
  }

  const resolved = await resolveKey(userId, req.headers.get("x-ai-key"));
  if (!resolved) {
    return NextResponse.json(
      { message: "Add your AI key in Settings to grade this." },
      { status: 400 },
    );
  }

  const task = generatedTaskSchema.parse(attempt.task);

  try {
    const grade = await gradeSubmission(
      resolved.provider,
      resolved.apiKey,
      resolved.model,
      attempt.taskType as TaskType,
      task,
      key,
      submission.data,
    );

    await db
      .update(assessmentAttempts)
      .set({
        submission: submission.data,
        score: grade.score,
        feedback: grade,
        submittedAt: new Date(),
      })
      .where(eq(assessmentAttempts.id, attempt.id));

    await recordAttemptStats(userId, attempt.topicSlug, grade.score);

    return NextResponse.json({ grade, workedSolution: key.workedSolution });
  } catch (e) {
    const message =
      e instanceof AIError ? e.message : "Grading failed. Try again.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
