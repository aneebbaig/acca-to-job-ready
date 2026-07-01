"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Loader2, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { withKeyHeader } from "@/lib/ai/key-storage";

type Dataset = { filename: string; csv: string; task: string; selfCheck: string };

// Real-Excel practice: generate a messy CSV, download it, do the task in a
// spreadsheet, then self-check. Only shown on topics with a spreadsheet task.
export function DatasetPractice({
  slug,
  aiReady,
}: {
  slug: string;
  aiReady: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [revealed, setRevealed] = useState(false);

  if (!aiReady) return null;

  function downloadCsv(d: Dataset) {
    const blob = new Blob([d.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = d.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function generate() {
    setLoading(true);
    setRevealed(false);
    try {
      const res = await fetch("/api/practice/dataset", {
        method: "POST",
        headers: withKeyHeader({ "content-type": "application/json" }),
        body: JSON.stringify({ topicSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Couldn't build a dataset.");
        return;
      }
      setDataset(data);
      downloadCsv(data);
      toast.success("Dataset downloaded.");
    } catch {
      toast.error("Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 py-5">
        <div className="flex items-center gap-2">
          <Table2 className="text-muted-foreground size-4" />
          <p className="text-sm font-medium">Real-spreadsheet practice</p>
        </div>
        <p className="text-muted-foreground text-sm">
          Download a messy dataset, do the task in Excel or Google Sheets, then
          check your answer. Best way to build real speed.
        </p>
        <Button onClick={generate} disabled={loading} variant="outline" size="sm">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {dataset ? "Download another" : "Download a dataset"}
        </Button>

        {dataset && (
          <div className="space-y-3 border-t pt-3">
            <p className="text-muted-foreground text-xs">
              Saved <span className="font-mono">{dataset.filename}</span> to your
              downloads.
            </p>
            <div>
              <p className="text-sm font-medium">Your task</p>
              <p className="text-muted-foreground text-sm">{dataset.task}</p>
            </div>
            {revealed ? (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium">Self-check answer</p>
                <p className="text-muted-foreground text-sm">{dataset.selfCheck}</p>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRevealed(true)}
              >
                Reveal the answer to check
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
