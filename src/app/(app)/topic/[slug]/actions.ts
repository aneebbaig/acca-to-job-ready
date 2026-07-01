"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth-guards";
import { getTopic } from "@/curriculum";
import { setCompleted } from "@/lib/progress";
import {
  addResource,
  deleteResource,
  toggleResourceWatched,
  updateResource,
} from "@/lib/resources";

function pathFor(slug: string) {
  return `/topic/${slug}`;
}

function assertTopic(slug: string) {
  if (!getTopic(slug)) throw new Error("Unknown topic.");
}

export async function toggleCompleteAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug"));
  assertTopic(slug);
  const completed = formData.get("completed") === "true";
  await setCompleted(user.id, slug, completed);
  revalidatePath(pathFor(slug));
}

const resourceSchema = z.object({
  title: z.string().trim().min(1, "Add a title.").max(200),
  url: z
    .string()
    .trim()
    .url("Enter a full link starting with http:// or https://"),
  note: z.string().trim().max(500).optional(),
});

export type ResourceState = { ok: boolean; message: string };

export async function addResourceAction(
  _prev: ResourceState,
  formData: FormData,
): Promise<ResourceState> {
  const user = await requireUser();
  const slug = String(formData.get("slug"));
  assertTopic(slug);

  const parsed = resourceSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  await addResource(user.id, slug, parsed.data);
  revalidatePath(pathFor(slug));
  return { ok: true, message: "Link added." };
}

export async function editResourceAction(
  _prev: ResourceState,
  formData: FormData,
): Promise<ResourceState> {
  const user = await requireUser();
  const slug = String(formData.get("slug"));
  const id = String(formData.get("id"));
  assertTopic(slug);

  const parsed = resourceSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }
  await updateResource(user.id, id, parsed.data);
  revalidatePath(pathFor(slug));
  return { ok: true, message: "Link updated." };
}

export async function deleteResourceAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug"));
  const id = String(formData.get("id"));
  await deleteResource(user.id, id);
  revalidatePath(pathFor(slug));
}

export async function toggleWatchedAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug"));
  const id = String(formData.get("id"));
  const watched = formData.get("watched") === "true";
  await toggleResourceWatched(user.id, id, watched);
  revalidatePath(pathFor(slug));
}
