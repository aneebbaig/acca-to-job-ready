import { requireUser } from "@/lib/auth-guards";
import { getAiSettings } from "@/lib/ai/settings";
import { PROVIDERS, PROVIDER_IDS } from "@/lib/ai/providers";
import { AiSettingsForm } from "./ai-settings-form";

export const metadata = { title: "AI provider" };
export const dynamic = "force-dynamic";

export default async function AiSettingsPage() {
  const user = await requireUser();
  const settings = await getAiSettings(user.id);

  const providers = PROVIDER_IDS.map((id) => ({
    id,
    label: PROVIDERS[id].label,
    defaultModel: PROVIDERS[id].defaultModel,
    keysUrl: PROVIDERS[id].keysUrl,
    freeNote: PROVIDERS[id].freeNote ?? null,
  }));

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI provider</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Practice grading uses your own API key. Pick a provider, paste a key,
          and we&apos;ll test it. Roadmap, cheatsheets, and resources work without
          this — only practice needs it.
        </p>
      </div>
      <AiSettingsForm
        providers={providers}
        current={{
          provider: settings?.provider ?? null,
          model: settings?.model ?? null,
          hasServerKey: Boolean(settings?.encryptedKey),
        }}
      />
    </div>
  );
}
