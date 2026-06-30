import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function getProfile(userId: string) {
  const [row] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  // A profile row is created with the user, but guard anyway.
  return row ?? null;
}

export async function setTrackBranch(
  userId: string,
  trackId: string,
  branchId: string,
) {
  await db
    .insert(profiles)
    .values({ userId, trackId, branchId, onboardedAt: new Date() })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: { trackId, branchId, onboardedAt: new Date(), updatedAt: new Date() },
    });
}
