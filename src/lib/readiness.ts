import type { Module } from "@/curriculum/types";
import type { Progress } from "@/db/schema";

// Honest readiness (§8.4): the mean practice mastery across the topics on this
// path that actually have practice. Unpractised topics count as 0, so it
// reflects completed practice — not engagement points. Not a promise you'll pass.
export function computeReadiness(
  modules: Module[],
  progressMap: Map<string, Progress>,
): { pct: number; practised: number; total: number } {
  const practiceTopics = modules
    .flatMap((m) => m.topics)
    .filter((t) => t.skillSpec);
  const total = practiceTopics.length;
  if (total === 0) return { pct: 0, practised: 0, total: 0 };

  let sum = 0;
  let practised = 0;
  for (const t of practiceTopics) {
    const p = progressMap.get(t.slug);
    sum += p?.masteryEstimate ?? 0;
    if ((p?.attempts ?? 0) > 0) practised += 1;
  }
  return { pct: Math.round((sum / total) * 100), practised, total };
}

export function readinessLabel(pct: number): string {
  if (pct >= 75) return "Strong — you're interview-ready on your practised topics.";
  if (pct >= 45) return "Getting there — keep practising the weak ones.";
  if (pct > 0) return "Early days — practise builds this up honestly.";
  return "No practice yet — start a task to build this.";
}
