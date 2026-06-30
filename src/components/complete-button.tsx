"use client";

import { useTransition } from "react";
import { Check, Circle } from "lucide-react";
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

  function submit() {
    const next = !completed;
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("completed", String(next));
    startTransition(async () => {
      await toggleCompleteAction(fd);
      // The verb matches the resulting confirmation (§10).
      toast.success(next ? "Marked complete" : "Marked not complete");
    });
  }

  return (
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
  );
}
