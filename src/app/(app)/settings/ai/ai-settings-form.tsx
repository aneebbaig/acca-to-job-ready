"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStoredKey, setStoredKey, clearStoredKey } from "@/lib/ai/key-storage";
import { saveAiAction, type SaveState } from "./actions";

type ProviderLite = {
  id: string;
  label: string;
  defaultModel: string;
  keysUrl: string;
  freeNote: string | null;
};

const initial: SaveState = { ok: false, message: "" };

export function AiSettingsForm({
  providers,
  current,
}: {
  providers: ProviderLite[];
  current: { provider: string | null; model: string | null; hasServerKey: boolean };
}) {
  const [provider, setProvider] = useState(current.provider ?? providers[0].id);
  const meta = providers.find((p) => p.id === provider)!;
  const [model, setModel] = useState(current.model ?? meta.defaultModel);
  const [key, setKey] = useState("");
  const [storage, setStorage] = useState<"device" | "server">(
    current.hasServerKey ? "server" : "device",
  );
  const [testing, setTesting] = useState(false);
  const [tested, setTested] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, action, saving] = useActionState(saveAiAction, initial);

  // On first load, surface whether a browser key is already present.
  useEffect(() => {
    if (!current.hasServerKey && getStoredKey()) setKey(getStoredKey());
  }, [current.hasServerKey]);

  useEffect(() => {
    if (state.ok) {
      // Persist (or clear) the browser key depending on storage choice.
      if (storage === "device") {
        if (key) setStoredKey(key);
      } else {
        clearStoredKey();
      }
      toast.success("AI provider saved.");
    } else if (state.message) {
      toast.error(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function onProviderChange(id: string | null) {
    if (!id) return;
    setProvider(id);
    const p = providers.find((x) => x.id === id)!;
    setModel(p.defaultModel);
    setTested(false);
  }

  async function testKey() {
    if (!key) {
      toast.error("Paste your key first.");
      return;
    }
    setTesting(true);
    setTested(false);
    try {
      const res = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "content-type": "application/json", "x-ai-key": key },
        body: JSON.stringify({ provider, model }),
      });
      const data = await res.json();
      if (data.ok) {
        setTested(true);
        toast.success("Key works.");
      } else {
        toast.error(data.message ?? "The key didn't work.");
      }
    } catch {
      toast.error("Couldn't reach the server.");
    } finally {
      setTesting(false);
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <input type="hidden" name="provider" value={provider} />
        <Select value={provider} onValueChange={onProviderChange}>
          <SelectTrigger id="provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providers.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          {meta.freeNote ? `${meta.freeNote} ` : ""}
          <a
            href={meta.keysUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-0.5 hover:underline"
          >
            Get a key <ExternalLink className="size-3" />
          </a>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          name="model"
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            setTested(false);
          }}
          required
        />
        <p className="text-muted-foreground text-xs">
          Default shown. Change it if you prefer a different model.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="key">API key</Label>
        <div className="flex gap-2">
          <Input
            id="key"
            name="key"
            type="password"
            autoComplete="off"
            placeholder={current.hasServerKey ? "•••••• (stored)" : "Paste your key"}
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setTested(false);
            }}
          />
          <Button type="button" variant="outline" onClick={testKey} disabled={testing}>
            {testing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : tested ? (
              <CheckCircle2 className="size-4 text-emerald-600" />
            ) : null}
            Test
          </Button>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Where to keep the key</legend>
        <input type="hidden" name="storage" value={storage} />
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="radio"
            name="storage-choice"
            checked={storage === "device"}
            onChange={() => setStorage("device")}
            className="mt-1"
          />
          <span>
            <span className="font-medium">This device only (recommended).</span>{" "}
            <span className="text-muted-foreground">
              Stored in your browser, sent per request, never saved on the server.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="radio"
            name="storage-choice"
            checked={storage === "server"}
            onChange={() => setStorage("server")}
            className="mt-1"
          />
          <span>
            <span className="font-medium">Encrypted on the server.</span>{" "}
            <span className="text-muted-foreground">
              Convenient across devices. Stored encrypted at rest.
            </span>
          </span>
        </label>
      </fieldset>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
