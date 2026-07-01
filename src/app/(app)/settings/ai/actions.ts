"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guards";
import { isProviderId } from "@/lib/ai/providers";
import { saveAiSettings } from "@/lib/ai/settings";

export type SaveState = { ok: boolean; message: string };

export async function saveAiAction(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const user = await requireUser();
  const provider = String(formData.get("provider"));
  const model = String(formData.get("model")).trim();
  const storage = String(formData.get("storage")); // "device" | "server"
  const key = String(formData.get("key") ?? "").trim();

  if (!isProviderId(provider)) return { ok: false, message: "Pick a provider." };
  if (!model) return { ok: false, message: "Enter a model name." };

  if (storage === "server") {
    if (!key) {
      return {
        ok: false,
        message: "Enter your key to store it encrypted on the server.",
      };
    }
    await saveAiSettings(user.id, provider, model, { storeKey: key });
  } else {
    // Browser-only: clear any server-stored key; the browser holds it.
    await saveAiSettings(user.id, provider, model, { storeKey: null });
  }

  revalidatePath("/settings/ai");
  return { ok: true, message: "Saved." };
}
