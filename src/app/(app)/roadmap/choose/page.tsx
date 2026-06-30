import { requireUser } from "@/lib/auth-guards";
import { getProfile } from "@/lib/profile";
import { curriculum } from "@/curriculum";
import { TrackSelector } from "@/components/track-selector";

export const metadata = { title: "Choose your path" };
export const dynamic = "force-dynamic";

export default async function ChoosePage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const firstName = user.name?.split(" ")[0] ?? "there";
  const returning = Boolean(profile?.trackId);

  // Only pass what the picker needs (keep it serializable, no skill-specs).
  const tracks = curriculum.tracks.map((t) => ({
    id: t.id,
    title: t.title,
    tagline: t.tagline,
    goal: t.goal,
    description: t.description,
    branches: t.branches.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      advanced: b.advanced,
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {returning ? "Change your path" : `Let’s get you oriented, ${firstName}`}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {returning
            ? "Switching is fine — your progress is kept."
            : "Pick a direction to follow. You can change it any time, and nothing is locked in."}
        </p>
      </div>
      <TrackSelector
        tracks={tracks}
        current={
          profile
            ? { trackId: profile.trackId, branchId: profile.branchId }
            : undefined
        }
      />
    </div>
  );
}
