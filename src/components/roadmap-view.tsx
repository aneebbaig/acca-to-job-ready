import Link from "next/link";
import { Check, Circle, Dot, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export type RoadmapTopic = {
  slug: string;
  title: string;
  status: "ready" | "stub";
  completed: boolean;
  hasPractice: boolean;
};
export type RoadmapSection = {
  key: string;
  title: string;
  summary: string;
  area: "foundation" | "branch";
  topics: RoadmapTopic[];
};

export function RoadmapView({
  sections,
  nextSlug,
  done,
  total,
  trackTitle,
  branchTitle,
}: {
  sections: RoadmapSection[];
  nextSlug: string | null;
  done: number;
  total: number;
  trackTitle: string;
  branchTitle: string;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Overview + you-are-here */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your roadmap</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {trackTitle} · {branchTitle}
            </p>
          </div>
          <Button render={<Link href="/roadmap/choose" />} variant="ghost" size="sm">
            Change path
          </Button>
        </div>

        <div className="space-y-1.5">
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>
              {done} of {total} topics complete
            </span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} />
        </div>

        {nextSlug && (
          <div className="bg-muted/50 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Your next step
              </p>
              <p className="font-medium">{titleOf(sections, nextSlug)}</p>
            </div>
            <Button render={<Link href={`/topic/${nextSlug}`} />}>
              Continue
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-7">
        {sections.map((section) => (
          <section key={section.key} className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{section.title}</h2>
                {section.area === "foundation" && (
                  <span className="text-muted-foreground text-xs">Shared foundation</span>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{section.summary}</p>
            </div>

            <ol className="border-border/70 ml-2 space-y-1 border-l pl-4">
              {section.topics.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/topic/${t.slug}`}
                    className={cn(
                      "group -ml-px flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60",
                      t.slug === nextSlug && "bg-muted/60",
                    )}
                  >
                    <NodeIcon
                      completed={t.completed}
                      isNext={t.slug === nextSlug}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        t.completed && "text-muted-foreground",
                      )}
                    >
                      {t.title}
                    </span>
                    {t.hasPractice && (
                      <span className="text-muted-foreground ml-auto text-xs">
                        Practice
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function NodeIcon({
  completed,
  isNext,
}: {
  completed: boolean;
  isNext: boolean;
}) {
  if (completed)
    return (
      <span className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full">
        <Check className="size-3" />
      </span>
    );
  if (isNext)
    return (
      <span className="border-primary text-primary flex size-5 shrink-0 items-center justify-center rounded-full border-2">
        <Dot className="size-4" />
      </span>
    );
  return <Circle className="text-muted-foreground/50 size-5 shrink-0" />;
}

function titleOf(sections: RoadmapSection[], slug: string): string {
  for (const s of sections) {
    const t = s.topics.find((x) => x.slug === slug);
    if (t) return t.title;
  }
  return "Continue";
}
