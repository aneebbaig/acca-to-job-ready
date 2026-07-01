import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { resourceLinks } from "@/db/schema";

export async function listResources(userId: string, topicSlug: string) {
  return db
    .select()
    .from(resourceLinks)
    .where(
      and(
        eq(resourceLinks.userId, userId),
        eq(resourceLinks.topicSlug, topicSlug),
      ),
    )
    .orderBy(resourceLinks.createdAt);
}

export async function addResource(
  userId: string,
  topicSlug: string,
  data: { title: string; url: string; note?: string },
) {
  const [row] = await db
    .insert(resourceLinks)
    .values({ userId, topicSlug, ...data })
    .returning();
  return row;
}

export async function updateResource(
  userId: string,
  id: string,
  data: { title: string; url: string; note?: string },
) {
  await db
    .update(resourceLinks)
    .set(data)
    .where(and(eq(resourceLinks.id, id), eq(resourceLinks.userId, userId)));
}

// Ownership is enforced in the WHERE clause — a user can only touch their own
// rows even if they guess another id (§5, app-layer isolation).
export async function deleteResource(userId: string, id: string) {
  await db
    .delete(resourceLinks)
    .where(and(eq(resourceLinks.id, id), eq(resourceLinks.userId, userId)));
}

export async function toggleResourceWatched(
  userId: string,
  id: string,
  watched: boolean,
) {
  await db
    .update(resourceLinks)
    .set({ watched })
    .where(and(eq(resourceLinks.id, id), eq(resourceLinks.userId, userId)));
}
