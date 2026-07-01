import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { requireUser } from "@/lib/auth-guards";
import { getProfile } from "@/lib/profile";
import { getProgressMap } from "@/lib/progress";
import { getRoadmapModules, getTrack, getBranch } from "@/curriculum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] ?? "there";
  const profile = await getProfile(user.id);

  const onboarded = Boolean(profile?.trackId && profile?.branchId);

  if (!onboarded) {
    return (
      <div className="space-y-6">
        <Greeting firstName={firstName} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Find your starting point</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Two minutes to pick a direction, then we’ll show you exactly what to
              learn first. Nothing is locked in.
            </p>
            <Button render={<Link href="/roadmap/choose" />}>
              <Compass className="size-4" />
              Choose your path
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const track = getTrack(profile!.trackId!);
  const branch = getBranch(profile!.trackId!, profile!.branchId!);
  const { foundation, branchModules } = getRoadmapModules(
    profile!.trackId!,
    profile!.branchId!,
  );
  const progressMap = await getProgressMap(user.id);
  const topics = [...foundation, ...branchModules].flatMap((m) => m.topics);
  const total = topics.length;
  const done = topics.filter((t) => progressMap.get(t.slug)?.completed).length;
  const next = topics.find((t) => !progressMap.get(t.slug)?.completed);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Greeting firstName={firstName} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {next ? "Pick up where you left off" : "You’ve completed your roadmap"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>
                {track?.title} · {branch?.title}
              </span>
              <span className="font-mono">
                {done}/{total} · {pct}%
              </span>
            </div>
            <Progress value={pct} />
          </div>

          {next ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-brass text-xs font-medium uppercase tracking-wide">
                  Next step
                </p>
                <p className="font-medium">{next.title}</p>
              </div>
              <Button render={<Link href={`/topic/${next.slug}`} />}>
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          ) : (
            <Button render={<Link href="/roadmap" />} variant="outline">
              Review your roadmap
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Greeting({ firstName }: { firstName: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome, {firstName}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        One clear next step at a time.
      </p>
    </div>
  );
}
