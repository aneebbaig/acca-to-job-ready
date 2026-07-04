"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setPending(true);
    setError(null);
    const clean = code.trim();
    const { error } = useBackup
      ? await authClient.twoFactor.verifyBackupCode({ code: clean })
      : await authClient.twoFactor.verifyTotp({ code: clean });
    setPending(false);
    if (error) {
      setError(useBackup ? "Invalid backup code." : "Invalid authentication code.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto mt-24 w-full max-w-sm space-y-4 px-4">
      <h1 className="text-lg font-semibold">Two-factor authentication</h1>
      <label className="text-sm text-muted-foreground" htmlFor="code">
        {useBackup ? "Backup code" : "Authentication code"}
      </label>
      <input
        id="code"
        inputMode={useBackup ? "text" : "numeric"}
        autoComplete="one-time-code"
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && code.trim() && submit()}
        className="w-full rounded-md border px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={pending || !code.trim()}
        className="w-full rounded-md bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Verifying…" : "Verify"}
      </button>
      <button
        type="button"
        className="w-full text-center text-xs text-muted-foreground underline"
        onClick={() => setUseBackup((v) => !v)}
      >
        {useBackup ? "Use authenticator code instead" : "Use a backup code instead"}
      </button>
    </div>
  );
}
