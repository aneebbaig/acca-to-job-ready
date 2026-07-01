import Link from "next/link";
import { requireUser } from "@/lib/auth-guards";
import { listGradedAttempts } from "@/lib/attempts";
import { getTopic } from "@/curriculum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Grade, AnswerKey } from "@/lib/assessment/schema";

export const metadata = { title: "Mistake review" };
export const dynamic = "force-dynamic";

const TASK_LABEL: Record<string, string> = {
  warmup_mcq: "Warm-up",
  journal_entries: "Journal entries",
  trial_balance_correction: "Trial balance",
  bank_reconciliation: "Bank reconciliation",
  adjusting_entries: "Adjusting entries",
  financial_statement_prep: "Statements from a TB",
  ratio_analysis: "Ratios",
  costing: "Costing",
  risk_identification: "Risk identification",
  audit_procedures: "Audit procedures",
  control_deficiency: "Control deficiency",
  working_paper_note: "Working paper",
  evidence_sampling: "Evidence & sampling",
  technical_viva: "Technical viva",
  hr_behavioural: "HR / behavioural",
  case_analysis: "Case analysis",
  error_spotting: "Error spotting",
  excel_task: "Excel task",
  explain_to_client: "Explain to a client",
};

function scoreTone(score: number | null): { label: string; variant: "secondary" | "outline" } {
  const pct = Math.round((score ?? 0) * 100);
  return { label: `${pct}%`, variant: pct >= 80 ? "secondary" : "outline" };
}

export default async function ReviewPage() {
  const user = await requireUser();
  const attempts = await listGradedAttempts(user.id);

  if (attempts.length === 0) {
    return (
      <div className="space-y-4">
        <Header />
        <div className="border-border/70 rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm font-medium">No attempts yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Once you practise a topic, every attempt shows up here so you can
            review what went wrong and try weak topics again.
          </p>
          <Button render={<Link href="/roadmap" />} className="mt-4" size="sm">
            Go to your roadmap
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Header />
      <ul className="space-y-3">
        {attempts.map((a) => {
          const topic = getTopic(a.topicSlug);
          const grade = a.feedback as Grade | null;
          const key = a.answerKey as AnswerKey;
          const tone = scoreTone(a.score);
          return (
            <li key={a.id} className="rounded-xl border">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                  <Badge variant={tone.variant}>{tone.label}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {topic?.title ?? a.topicSlug}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {TASK_LABEL[a.taskType] ?? a.taskType}
                      {a.submittedAt
                        ? ` · ${new Date(a.submittedAt).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-xs transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <div className="space-y-3 border-t p-4 text-sm">
                  {grade?.points?.map((p, i) => (
                    <p key={i}>
                      <span className="font-medium">{p.label}: </span>
                      <span className="text-muted-foreground">{p.comment}</span>
                    </p>
                  ))}
                  {grade?.tip && (
                    <p className="bg-muted/50 rounded-lg p-3">
                      <span className="font-medium">Next time: </span>
                      {grade.tip}
                    </p>
                  )}
                  {key?.workedSolution && (
                    <details className="rounded-lg border p-3">
                      <summary className="cursor-pointer font-medium">
                        Worked solution
                      </summary>
                      <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                        {key.workedSolution}
                      </p>
                    </details>
                  )}
                  {topic && (
                    <Button
                      render={<Link href={`/topic/${a.topicSlug}`} />}
                      size="sm"
                      variant="outline"
                    >
                      Practise this again
                    </Button>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Mistake review</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Every graded attempt, newest first. Reread the feedback and re-attempt
        your weak topics.
      </p>
    </div>
  );
}
