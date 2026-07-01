import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-guards";
import { getProfile } from "@/lib/profile";
import { getProgressMap } from "@/lib/progress";
import { getRoadmapModules, getTrack, getBranch } from "@/curriculum";
import { computeReadiness, readinessLabel } from "@/lib/readiness";
import {
  RoadmapView,
  type RoadmapSection,
} from "@/components/roadmap-view";

export const metadata = { title: "Roadmap" };
export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  // Guided first run: no path chosen yet → go choose one (§10).
  if (!profile?.trackId || !profile?.branchId) {
    redirect("/roadmap/choose");
  }

  const track = getTrack(profile.trackId);
  const branch = getBranch(profile.trackId, profile.branchId);
  // Curriculum changed and the saved branch no longer exists → re-choose.
  if (!track || !branch) redirect("/roadmap/choose");

  const { foundation, branchModules } = getRoadmapModules(
    profile.trackId,
    profile.branchId,
  );
  const progressMap = await getProgressMap(user.id);

  const buildSection = (
    m: (typeof foundation)[number],
    area: "foundation" | "branch",
  ): RoadmapSection => ({
    key: m.slug,
    title: m.title,
    summary: m.summary,
    area,
    topics: m.topics.map((t) => ({
      slug: t.slug,
      title: t.title,
      status: t.status,
      completed: progressMap.get(t.slug)?.completed ?? false,
      hasPractice: Boolean(t.skillSpec),
    })),
  });

  const sections: RoadmapSection[] = [
    ...foundation.map((m) => buildSection(m, "foundation")),
    ...branchModules.map((m) => buildSection(m, "branch")),
  ];

  const allTopics = sections.flatMap((s) => s.topics);
  const total = allTopics.length;
  const done = allTopics.filter((t) => t.completed).length;
  const nextSlug = allTopics.find((t) => !t.completed)?.slug ?? null;

  const r = computeReadiness([...foundation, ...branchModules], progressMap);

  return (
    <RoadmapView
      sections={sections}
      nextSlug={nextSlug}
      done={done}
      total={total}
      trackTitle={track.title}
      branchTitle={branch.title}
      readiness={{ ...r, label: readinessLabel(r.pct) }}
      tools={track.tools}
    />
  );
}
