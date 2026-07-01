import { BookOpen, Compass, Target } from "lucide-react";

const STEPS = [
  {
    icon: Compass,
    title: "Pick your path",
    body: "Choose a track once. We lay out exactly what to learn, and in what order.",
  },
  {
    icon: BookOpen,
    title: "Learn each topic",
    body: "Read the short intro and cheatsheet, then practise with tasks an employer would actually set.",
  },
  {
    icon: Target,
    title: "Build readiness",
    body: "Every topic you finish and every practice score builds an honest 'am I ready?' signal.",
  },
];

// A calm, self-explaining strip that answers "what is this and how do I use it?"
// for a first-time, non-technical user.
export function HowItWorks() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {STEPS.map((s, i) => (
        <div key={s.title} className="border-border/70 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <span className="bg-brass/10 text-brass flex size-7 items-center justify-center rounded-full font-mono text-sm font-semibold">
              {i + 1}
            </span>
            <s.icon className="text-muted-foreground size-4" aria-hidden />
          </div>
          <p className="mt-2 font-medium">{s.title}</p>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}
