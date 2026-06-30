"use client";

import { useState, useTransition } from "react";
import { Check, ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { selectTrackBranchAction } from "@/app/(app)/roadmap/actions";

type BranchLite = {
  id: string;
  title: string;
  description: string;
  advanced?: boolean;
};
type TrackLite = {
  id: string;
  title: string;
  tagline: string;
  goal: string;
  description: string;
  branches: BranchLite[];
};

export function TrackSelector({
  tracks,
  current,
}: {
  tracks: TrackLite[];
  current?: { trackId: string | null; branchId: string | null };
}) {
  const [trackId, setTrackId] = useState<string | null>(
    current?.trackId ?? null,
  );
  const [branchId, setBranchId] = useState<string | null>(
    current?.branchId ?? null,
  );
  const [pending, startTransition] = useTransition();

  const track = tracks.find((t) => t.id === trackId);

  function submit() {
    if (!trackId || !branchId) return;
    const fd = new FormData();
    fd.set("trackId", trackId);
    fd.set("branchId", branchId);
    startTransition(() => selectTrackBranchAction(fd));
  }

  return (
    <div className="space-y-8">
      {/* Honest framing (§13) — guidance, not a rule. */}
      <Alert>
        <Compass className="size-4" />
        <AlertTitle>Two honest paths</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          <span>
            <strong className="text-foreground">Firm / Audit</strong> is the
            credential route — you become an auditor and earn recognised
            experience.{" "}
            <strong className="text-foreground">Freelance / Accounting</strong> is
            the income route — bookkeeping and accounts for clients. You can’t
            freelance as a statutory auditor. With no experience, many people go
            firm-first, then freelance later with credibility. This is guidance,
            not a rule — you can switch any time.
          </span>
        </AlertDescription>
      </Alert>

      {/* Step 1: pick a track */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium">1. Choose your path</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tracks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTrackId(t.id);
                setBranchId(null);
              }}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                trackId === t.id
                  ? "border-primary ring-primary/30 ring-2"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t.title}</span>
                {trackId === t.id && <Check className="text-primary size-4" />}
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs font-medium uppercase tracking-wide">
                {t.tagline}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">{t.description}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Goal: </span>
                {t.goal}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: pick a branch */}
      {track && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium">2. Pick where to focus</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {track.branches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBranchId(b.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  branchId === b.id
                    ? "border-primary ring-primary/30 ring-2"
                    : "border-border hover:border-foreground/30",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{b.title}</span>
                  {b.advanced && (
                    <span className="text-muted-foreground shrink-0 text-xs">
                      Advanced
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {b.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={submit} disabled={!trackId || !branchId || pending}>
          {pending ? "Saving…" : "Start this path"}
          <ArrowRight className="size-4" />
        </Button>
        {(!trackId || !branchId) && (
          <p className="text-muted-foreground text-sm">
            Choose a path and a focus to continue.
          </p>
        )}
      </div>
    </div>
  );
}
