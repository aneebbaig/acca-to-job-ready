"use client";

import { useState, useTransition } from "react";
import { Check, Circle, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleCompleteAction } from "@/app/(app)/topic/[slug]/actions";

export function CompleteButton({
  slug,
  completed,
}: {
  slug: string;
  completed: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [celebrate, setCelebrate] = useState(false);

  function submit() {
    const next = !completed;
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("completed", String(next));
    startTransition(async () => {
      await toggleCompleteAction(fd);
      // The verb matches the resulting confirmation (§10).
      toast.success(next ? "Nice, topic done" : "Marked not complete");
      if (next) {
        // A small, reduced-motion-safe reward.
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1400);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={submit}
        disabled={pending}
        variant={completed ? "secondary" : "default"}
      >
        {completed ? (
          <>
            <Check className="size-4" /> Completed
          </>
        ) : (
          <>
            <Circle className="size-4" /> Mark complete
          </>
        )}
      </Button>
      {celebrate && (
        <span className="text-brass flex items-center gap-1 text-sm font-medium animate-in fade-in zoom-in">
          <PartyPopper className="size-4" />
          Well done
        </span>
      )}
    </div>
  );
}
