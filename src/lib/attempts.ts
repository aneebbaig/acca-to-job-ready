import "server-only";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { assessmentAttempts } from "@/db/schema";

// Recent graded attempts for the mistake-review log (§9). User-scoped.
export async function listGradedAttempts(userId: string, limit = 50) {
  return db
    .select({
      id: assessmentAttempts.id,
      topicSlug: assessmentAttempts.topicSlug,
      taskType: assessmentAttempts.taskType,
      score: assessmentAttempts.score,
      feedback: assessmentAttempts.feedback,
      answerKey: assessmentAttempts.answerKey,
      submittedAt: assessmentAttempts.submittedAt,
    })
    .from(assessmentAttempts)
    .where(
      and(
        eq(assessmentAttempts.userId, userId),
        isNotNull(assessmentAttempts.submittedAt),
      ),
    )
    .orderBy(desc(assessmentAttempts.submittedAt))
    .limit(limit);
}
