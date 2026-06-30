"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CheckSquare, ExternalLink, Plus, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addResourceAction,
  deleteResourceAction,
  toggleWatchedAction,
  type ResourceState,
} from "@/app/(app)/topic/[slug]/actions";

type Resource = {
  id: string;
  title: string;
  url: string;
  note: string | null;
  watched: boolean;
};

const initial: ResourceState = { ok: false, message: "" };

export function ResourceManager({
  slug,
  resources,
  slotHints,
}: {
  slug: string;
  resources: Resource[];
  slotHints: string[];
}) {
  const [adding, setAdding] = useState(false);
  const [state, action, pending] = useActionState(addResourceAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
      setAdding(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      {resources.length === 0 ? (
        <div className="border-border/70 rounded-lg border border-dashed p-4">
          <p className="text-sm font-medium">No resources yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            This is your space. Add links you actually find useful — there are no
            pre-filled URLs here on purpose. A few ideas for this topic:
          </p>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
            {slotHints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="space-y-2">
          {resources.map((r) => (
            <li
              key={r.id}
              className="border-border/70 flex items-start gap-3 rounded-lg border p-3"
            >
              <form action={toggleWatchedAction} className="pt-0.5">
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="watched" value={(!r.watched).toString()} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground size-6"
                  aria-label={r.watched ? "Mark as not watched" : "Mark as watched"}
                  title={r.watched ? "Watched" : "Mark as watched"}
                >
                  {r.watched ? (
                    <CheckSquare className="size-4" />
                  ) : (
                    <Square className="size-4" />
                  )}
                </Button>
              </form>
              <div className="min-w-0 flex-1">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium hover:underline"
                >
                  <span className={r.watched ? "text-muted-foreground line-through" : ""}>
                    {r.title}
                  </span>
                  <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                </a>
                {r.note && (
                  <p className="text-muted-foreground mt-0.5 text-sm">{r.note}</p>
                )}
              </div>
              <form action={deleteResourceAction}>
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="id" value={r.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={`Remove ${r.title}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form
          ref={formRef}
          action={action}
          className="border-border/70 space-y-3 rounded-lg border p-3"
        >
          <input type="hidden" name="slug" value={slug} />
          <div className="space-y-1.5">
            <Label htmlFor="res-title">Title</Label>
            <Input id="res-title" name="title" placeholder="What is it?" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="res-url">Link</Label>
            <Input
              id="res-url"
              name="url"
              type="url"
              placeholder="https://…"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="res-note">Note (optional)</Label>
            <Input id="res-note" name="note" placeholder="Why it’s useful" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Adding…" : "Add link"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="size-4" />
          Add a resource
        </Button>
      )}
    </div>
  );
}
