import Link from "next/link";
import { ArrowRight, Compass, ListChecks, Map } from "lucide-react";
import { requireUser } from "@/lib/auth-guards";
import { getProfile } from "@/lib/profile";
import { getProgressMap } from "@/lib/progress";
import { getRoadmapModules, getTrack, getBranch } from "@/curriculum";
import { computeReadiness, readinessLabel } from "@/lib/readiness";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HowItWorks } from "@/components/how-it-works";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] ?? "there";
  const profile = await getProfile(user.id);
  const onboarded = Boolean(profile?.trackId && profile?.branchId);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-brass text-sm font-medium">Welcome, {firstName}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {onboarded ? "Here's your next step" : "Let's get you started"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          This is your home base. It always shows the one thing to do next.
        </p>
      </div>

      {onboarded ? (
        <ContinuePanel userId={user.id} profile={profile!} />
      ) : (
        <StartPanel />
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium">How Job-Ready works</h2>
        <HowItWorks />
      </section>
    </div>
  );
}

function StartPanel() {
  return (
    <Card className="border-brass/40 bg-brass/5">
      <CardHeader>
        <CardTitle className="text-base">Step 1: choose your path</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Two minutes to pick a direction. We explain both options in plain
          language, then show you exactly what to learn first. You can change it
          any time.
        </p>
        <Button render={<Link href="/roadmap/choose" />} size="lg">
          <Compass className="size-4" />
          Choose your path
        </Button>
      </CardContent>
    </Card>
  );
}

async function ContinuePanel({
  userId,
  profile,
}: {
  userId: string;
  profile: { trackId: string | null; branchId: string | null };
}) {
  const track = getTrack(profile.trackId!);
  const branch = getBranch(profile.trackId!, profile.branchId!);
  const { foundation, branchModules } = getRoadmapModules(
    profile.trackId!,
    profile.branchId!,
  );
  const modules = [...foundation, ...branchModules];
  const progressMap = await getProgressMap(userId);
  const topics = modules.flatMap((m) => m.topics);
  const total = topics.length;
  const done = topics.filter((t) => progressMap.get(t.slug)?.completed).length;
  const next = topics.find((t) => !progressMap.get(t.slug)?.completed);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const r = computeReadiness(modules, progressMap);

  return (
    <div className="space-y-4">
      <Card className="border-brass/40 bg-brass/5">
        <CardContent className="space-y-4 py-5">
          <p className="text-muted-foreground text-xs">
            {track?.title} · {branch?.title}
          </p>
          {next ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-brass text-xs font-medium uppercase tracking-wide">
                    Do this next
                  </p>
                  <p className="text-lg font-semibold">{next.title}</p>
                  <p className="text-muted-foreground text-sm">
                    Open it, read the intro and cheatsheet, then try a practice
                    task.
                  </p>
                </div>
                <Button render={<Link href={`/topic/${next.slug}`} />} size="lg">
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <p className="font-semibold">You've finished every topic. 🎯</p>
              <p className="text-muted-foreground text-sm">
                Keep practising weak topics to push your readiness higher.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two honest signals + shortcuts */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border p-4">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Progress
          </p>
          <p className="font-mono text-2xl font-semibold">{pct}%</p>
          <p className="text-muted-foreground mb-2 text-xs">
            {done} of {total} topics complete
          </p>
          <Progress value={pct} />
        </div>
        <div className="border-brass/40 rounded-xl border p-4">
          <p className="text-brass text-xs font-medium uppercase tracking-wide">
            Readiness
          </p>
          <p className="text-brass font-mono text-2xl font-semibold">{r.pct}%</p>
          <p className="text-muted-foreground text-xs">{readinessLabel(r.pct)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button render={<Link href="/roadmap" />} variant="outline" size="sm">
          <Map className="size-4" />
          See the full roadmap
        </Button>
        <Button render={<Link href="/review" />} variant="outline" size="sm">
          <ListChecks className="size-4" />
          Review past attempts
        </Button>
      </div>
    </div>
  );
}
