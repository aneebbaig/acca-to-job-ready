"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  CheckSquare,
  ExternalLink,
  Pencil,
  Plus,
  Square,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addResourceAction,
  editResourceAction,
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
            <ResourceItem key={r.id} slug={slug} resource={r} />
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

function ResourceItem({ slug, resource }: { slug: string; resource: Resource }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [editState, editAction, editPending] = useActionState(
    editResourceAction,
    initial,
  );

  useEffect(() => {
    if (editState.ok) {
      toast.success(editState.message);
      setEditing(false);
    } else if (editState.message) {
      toast.error(editState.message);
    }
  }, [editState]);

  // Delete with confirm + undo (§10): remove immediately, then offer to restore.
  function remove() {
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("id", resource.id);
    startTransition(async () => {
      await deleteResourceAction(fd);
      toast("Resource removed", {
        action: {
          label: "Undo",
          onClick: () => {
            const re = new FormData();
            re.set("slug", slug);
            re.set("title", resource.title);
            re.set("url", resource.url);
            if (resource.note) re.set("note", resource.note);
            startTransition(async () => {
              await addResourceAction(initial, re);
            });
          },
        },
      });
    });
  }

  function toggleWatched() {
    const fd = new FormData();
    fd.set("slug", slug);
    fd.set("id", resource.id);
    fd.set("watched", String(!resource.watched));
    startTransition(() => toggleWatchedAction(fd));
  }

  if (editing) {
    return (
      <li className="border-border/70 rounded-lg border p-3">
        <form action={editAction} className="space-y-3">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="id" value={resource.id} />
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input name="title" defaultValue={resource.title} required />
          </div>
          <div className="space-y-1.5">
            <Label>Link</Label>
            <Input name="url" type="url" defaultValue={resource.url} required />
          </div>
          <div className="space-y-1.5">
            <Label>Note (optional)</Label>
            <Input name="note" defaultValue={resource.note ?? ""} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={editPending}>
              {editPending ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="border-border/70 flex items-start gap-3 rounded-lg border p-3">
      <button
        type="button"
        onClick={toggleWatched}
        disabled={pending}
        className="text-muted-foreground pt-0.5"
        aria-label={resource.watched ? "Mark as not watched" : "Mark as watched"}
        title={resource.watched ? "Watched" : "Mark as watched"}
      >
        {resource.watched ? (
          <CheckSquare className="size-4" />
        ) : (
          <Square className="size-4" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium hover:underline"
        >
          <span className={resource.watched ? "text-muted-foreground line-through" : ""}>
            {resource.title}
          </span>
          <ExternalLink className="size-3.5 shrink-0" aria-hidden />
        </a>
        {resource.note && (
          <p className="text-muted-foreground mt-0.5 text-sm">{resource.note}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-muted-foreground hover:text-foreground pt-0.5"
        aria-label={`Edit ${resource.title}`}
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="text-muted-foreground hover:text-destructive pt-0.5"
        aria-label={`Remove ${resource.title}`}
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}
