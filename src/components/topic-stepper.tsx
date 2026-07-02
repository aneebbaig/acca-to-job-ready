"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepState = "done" | "current" | "todo";

// A visible, sequential tracker so a distracted or overwhelmed learner always
// sees the order of a topic and the single thing to do right now. Tapping a
// step scrolls to that section.
export function TopicStepper({
  completed,
  hasScore,
  hasPractice,
}: {
  completed: boolean;
  hasScore: boolean;
  hasPractice: boolean;
}) {
  // One, and only one, step is "current", the next thing to do.
  const steps: { id: string; label: string; state: StepState }[] = [
    {
      id: "read",
      label: "Read",
      state: completed || hasScore ? "done" : "current",
    },
    {
      id: "cheatsheet",
      label: "Cheatsheet",
      state: completed || hasScore ? "done" : "todo",
    },
    {
      id: "practice",
      label: hasPractice ? "Practice" : "Practice soon",
      state: hasPractice && (completed || hasScore) ? "done" : "todo",
    },
    {
      id: "complete",
      label: "Mark done",
      state: completed ? "done" : hasScore ? "current" : "todo",
    },
  ];

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <ol className="flex items-center gap-1 overflow-x-auto py-1">
      {steps.map((s, i) => (
        <li key={s.id} className="flex flex-1 items-center gap-1">
          <button
            type="button"
            onClick={() => go(s.id)}
            className="group flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg px-1 py-1.5 text-center"
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold transition-colors",
                s.state === "done" &&
                  "border-primary bg-primary text-primary-foreground",
                s.state === "current" &&
                  "border-brass text-brass bg-brass/10 ring-brass/30 ring-4",
                s.state === "todo" &&
                  "border-border text-muted-foreground group-hover:border-foreground/40",
              )}
            >
              {s.state === "done" ? <Check className="size-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "truncate text-xs font-medium",
                s.state === "current" ? "text-brass" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
          </button>
          {i < steps.length - 1 && (
            <span
              className={cn(
                "h-0.5 w-4 shrink-0 sm:w-8",
                s.state === "done" ? "bg-primary" : "bg-border",
              )}
              aria-hidden
            />
          )}
        </li>
      ))}
    </ol>
  );
}
