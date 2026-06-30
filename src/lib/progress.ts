import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { progress } from "@/db/schema";

// All progress rows for a user, keyed by topic slug. Always user-scoped (§5).
export async function getProgressMap(userId: string) {
  const rows = await db
    .select()
    .from(progress)
    .where(eq(progress.userId, userId));
  return new Map(rows.map((r) => [r.topicSlug, r]));
}

export async function getTopicProgress(userId: string, topicSlug: string) {
  const [row] = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.topicSlug, topicSlug)))
    .limit(1);
  return row ?? null;
}

// Upsert the manual completion flag.
export async function setCompleted(
  userId: string,
  topicSlug: string,
  completed: boolean,
) {
  await db
    .insert(progress)
    .values({ userId, topicSlug, completed })
    .onConflictDoUpdate({
      target: [progress.userId, progress.topicSlug],
      set: { completed, updatedAt: new Date() },
    });
}

// Record an attempt's effect on the topic's stats. Auto-completes on a strong
// pass (§9: auto-completion from passed practice). Mastery is an honest rolling
// estimate, not engagement points (§8.4).
export async function recordAttemptStats(
  userId: string,
  topicSlug: string,
  score: number,
) {
  const existing = await getTopicProgress(userId, topicSlug);
  const attempts = (existing?.attempts ?? 0) + 1;
  const bestScore = Math.max(existing?.bestScore ?? 0, score);
  // Mastery: blend prior estimate with the new score, weighted to recent.
  const prior = existing?.masteryEstimate ?? 0;
  const mastery = existing ? prior * 0.6 + score * 0.4 : score;
  const autoComplete = bestScore >= 0.8;

  await db
    .insert(progress)
    .values({
      userId,
      topicSlug,
      attempts,
      bestScore,
      masteryEstimate: mastery,
      lastAttemptAt: new Date(),
      completed: autoComplete,
    })
    .onConflictDoUpdate({
      target: [progress.userId, progress.topicSlug],
      set: {
        attempts,
        bestScore,
        masteryEstimate: mastery,
        lastAttemptAt: new Date(),
        // Never un-complete a manually completed topic.
        completed: autoComplete || (existing?.completed ?? false),
        updatedAt: new Date(),
      },
    });
}
