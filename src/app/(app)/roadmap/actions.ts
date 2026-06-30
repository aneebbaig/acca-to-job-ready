"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-guards";
import { getBranch } from "@/curriculum";
import { setTrackBranch } from "@/lib/profile";

export async function selectTrackBranchAction(formData: FormData) {
  const user = await requireUser();
  const trackId = String(formData.get("trackId"));
  const branchId = String(formData.get("branchId"));

  // Validate against the curriculum so a bad payload can't be saved.
  if (!getBranch(trackId, branchId)) {
    throw new Error("Pick a track and a path first.");
  }

  await setTrackBranch(user.id, trackId, branchId);
  redirect("/roadmap");
}
