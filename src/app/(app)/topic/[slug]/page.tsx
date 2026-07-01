import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/auth-guards";
import { getTopic, locateTopic } from "@/curriculum";
import { getTopicProgress } from "@/lib/progress";
import { listResources } from "@/lib/resources";
import { getAiSettings } from "@/lib/ai/settings";
import { Cheatsheet } from "@/components/cheatsheet";
import { ResourceManager } from "@/components/resource-manager";
import { CompleteButton } from "@/components/complete-button";
import { TopicPractice } from "@/components/topic-practice";
import { Badge } from "@/components/ui/badge";

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
  const [progress, resources, aiSettings] = await Promise.all([
    getTopicProgress(user.id, slug),
    listResources(user.id, slug),
    getAiSettings(user.id),
  ]);
  const aiReady = Boolean(aiSettings?.provider && aiSettings?.model);

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

      <header className="space-y-3">
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
        <div className="flex items-center gap-3">
          <CompleteButton slug={slug} completed={progress?.completed ?? false} />
          {progress?.bestScore != null && (
            <span className="text-muted-foreground text-sm">
              Best practice score: {Math.round(progress.bestScore * 100)}%
            </span>
          )}
        </div>
      </header>

      {/* Cheatsheet */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cheatsheet</h2>
          <p className="text-muted-foreground text-xs">Quick reference. Verify anything marked.</p>
        </div>
        <Cheatsheet blocks={topic.cheatsheet} />
      </section>

      {/* Practice */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Practice</h2>
        <TopicPractice
          slug={slug}
          hasSkillSpec={Boolean(topic.skillSpec)}
          aiReady={aiReady}
        />
      </section>

      {/* Resources */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your resources</h2>
        <ResourceManager
          slug={slug}
          resources={resources}
          slotHints={topic.resourceSlotHints}
        />
      </section>
    </article>
  );
}
