import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/auth-guards";
import { getTopic, locateTopic, getAdjacentTopics } from "@/curriculum";
import { getProfile } from "@/lib/profile";
import { getTopicProgress } from "@/lib/progress";
import { listResources } from "@/lib/resources";
import { getAiSettings } from "@/lib/ai/settings";
import { Cheatsheet } from "@/components/cheatsheet";
import { ResourceManager } from "@/components/resource-manager";
import { CompleteButton } from "@/components/complete-button";
import { TopicPractice } from "@/components/topic-practice";
import { TopicStepper } from "@/components/topic-stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  return { title: topic?.title ?? "Topic" };
}

// A small numbered marker so the flow of a topic reads as steps.
function StepHeading({ n, children, hint }: { n: number; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-secondary text-secondary-foreground flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold">
        {n}
      </span>
      <h2 className="text-lg font-semibold">{children}</h2>
      {hint && <p className="text-muted-foreground ml-auto text-xs">{hint}</p>}
    </div>
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const user = await requireUser();
  const located = locateTopic(slug);
  const [progress, resources, aiSettings, profile] = await Promise.all([
    getTopicProgress(user.id, slug),
    listResources(user.id, slug),
    getAiSettings(user.id),
    getProfile(user.id),
  ]);
  const aiReady = Boolean(aiSettings?.provider && aiSettings?.model);
  const { next } = getAdjacentTopics(
    profile?.trackId ?? null,
    profile?.branchId ?? null,
    slug,
  );

  return (
    <article className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
        <Link href="/roadmap" className="hover:text-foreground">
          Roadmap
        </Link>
        {located && (
          <>
            <ChevronRight className="size-3.5" aria-hidden />
            <span>{located.module.title}</span>
          </>
        )}
      </nav>

      {/* Sequence tracker: always visible, one current step highlighted. */}
      <div className="bg-card rounded-xl border p-2">
        <TopicStepper
          completed={progress?.completed ?? false}
          hasScore={progress?.bestScore != null}
          hasPractice={Boolean(topic.skillSpec)}
        />
      </div>

      <header id="read" className="scroll-mt-20 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{topic.title}</h1>
          {topic.status === "stub" && (
            <Badge variant="outline" className="text-amber-700">
              Draft, pending review
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          {topic.intro}
        </p>
        {/* Self-explaining: how to work through this topic. */}
        <p className="text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 text-xs">
          Work top to bottom: read this intro, skim the cheatsheet, try a
          practice task, then mark it complete when you feel solid.
        </p>
        <div id="complete" className="flex scroll-mt-20 items-center gap-3">
          <CompleteButton slug={slug} completed={progress?.completed ?? false} />
          {progress?.bestScore != null && (
            <span className="text-muted-foreground text-sm">
              Best practice score:{" "}
              <span className="font-mono">
                {Math.round(progress.bestScore * 100)}%
              </span>
            </span>
          )}
        </div>
      </header>

      {/* Cheatsheet */}
      <section id="cheatsheet" className="scroll-mt-20 space-y-3">
        <StepHeading n={1} hint="Quick reference. Verify anything marked.">
          Cheatsheet
        </StepHeading>
        <Cheatsheet blocks={topic.cheatsheet} />
      </section>

      {/* Practice */}
      <section id="practice" className="scroll-mt-20 space-y-3">
        <StepHeading n={2} hint="Unlimited fresh, AI-graded tasks.">
          Practice
        </StepHeading>
        <TopicPractice
          slug={slug}
          hasSkillSpec={Boolean(topic.skillSpec)}
          aiReady={aiReady}
        />
      </section>

      {/* Resources */}
      <section id="resources" className="scroll-mt-20 space-y-3">
        <StepHeading n={3} hint="Save your own links.">
          Your resources
        </StepHeading>
        <ResourceManager
          slug={slug}
          resources={resources}
          slotHints={topic.resourceSlotHints}
        />
      </section>

      {/* Always show what comes next so the path is never a dead end. */}
      {next && (
        <div className="bg-muted/50 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
          <div>
            <p className="text-brass text-xs font-medium uppercase tracking-wide">
              Next up
            </p>
            <p className="font-medium">{next.title}</p>
          </div>
          <Button render={<Link href={`/topic/${next.slug}`} />} variant="outline">
            Go to next topic
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </article>
  );
}
