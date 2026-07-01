"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Check,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { withKeyHeader } from "@/lib/ai/key-storage";

type Column = { key: string; label: string; type: "text" | "number" };
type Task = {
  scenario: string;
  instructions: string;
  given?: { title: string; columns: Column[]; rows: Record<string, string | number>[] } | null;
  input:
    | { kind: "rows"; columns: Column[]; minRows: number }
    | { kind: "mcq"; options: { id: string; label: string }[]; multiple: boolean }
    | { kind: "fields"; fields: { key: string; label: string; multiline: boolean }[] };
};
type Grade = {
  score: number;
  points: { label: string; status: "correct" | "partial" | "wrong" | "missing"; comment: string }[];
  tip: string;
  interviewerNote?: string;
  uncertainty?: string;
};

const DISCLAIMER =
  "AI feedback is a study aid, not authoritative ACCA material. Verify anything important against an official source.";

export function TopicPractice({
  slug,
  hasSkillSpec,
  aiReady,
}: {
  slug: string;
  hasSkillSpec: boolean;
  aiReady: boolean;
}) {
  const [phase, setPhase] = useState<"idle" | "loading" | "answering" | "grading" | "done">("idle");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [grade, setGrade] = useState<Grade | null>(null);
  const [worked, setWorked] = useState<string>("");

  if (!hasSkillSpec) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-5 text-sm">
          Guided practice for this topic is on the way. For now, work through the
          cheatsheet and add your own resources below.
        </CardContent>
      </Card>
    );
  }

  if (!aiReady) {
    return (
      <Card>
        <CardContent className="space-y-3 py-5">
          <p className="text-sm">
            Practice here is graded by AI using your own API key, so it stays free
            and private. Add a key once to unlock it.
          </p>
          <Button render={<Link href="/settings/ai" />} size="sm">
            Set up practice
          </Button>
        </CardContent>
      </Card>
    );
  }

  async function start() {
    setPhase("loading");
    setGrade(null);
    setWorked("");
    try {
      const res = await fetch("/api/assessment/generate", {
        method: "POST",
        headers: withKeyHeader({ "content-type": "application/json" }),
        body: JSON.stringify({ topicSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Couldn't start practice.");
        setPhase("idle");
        return;
      }
      const t = data.task as Task;
      setTask(t);
      setAttemptId(data.attemptId);
      // Seed inputs.
      if (t.input.kind === "rows") {
        const blank = () =>
          Object.fromEntries(t.input.kind === "rows" ? t.input.columns.map((c) => [c.key, ""]) : []);
        setRows(Array.from({ length: t.input.minRows }, blank));
      }
      setSelected([]);
      setFields({});
      setPhase("answering");
    } catch {
      toast.error("Couldn't reach the server.");
      setPhase("idle");
    }
  }

  async function submit() {
    if (!attemptId || !task) return;
    setPhase("grading");
    const submission =
      task.input.kind === "rows"
        ? { rows }
        : task.input.kind === "mcq"
          ? { selectedOptionIds: selected }
          : { fields };
    try {
      const res = await fetch("/api/assessment/grade", {
        method: "POST",
        headers: withKeyHeader({ "content-type": "application/json" }),
        body: JSON.stringify({ attemptId, submission }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Grading failed.");
        setPhase("answering");
        return;
      }
      setGrade(data.grade);
      setWorked(data.workedSolution ?? "");
      setPhase("done");
    } catch {
      toast.error("Couldn't reach the server.");
      setPhase("answering");
    }
  }

  return (
    <div className="space-y-4">
      {phase === "idle" && (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-5">
            <p className="text-sm">
              Generate a fresh, randomised task and get graded feedback.
            </p>
            <Button onClick={start}>
              <Sparkles className="size-4" />
              Start practice
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "loading" && (
        <Card>
          <CardContent className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Generating a task and checking the maths…
          </CardContent>
        </Card>
      )}

      {task && phase !== "idle" && phase !== "loading" && (
        <Card>
          <CardContent className="space-y-4 py-5">
            <div className="space-y-2">
              <p className="text-sm whitespace-pre-wrap">{task.scenario}</p>
              <p className="text-sm font-medium">{task.instructions}</p>
            </div>

            {task.given && task.given.rows.length > 0 && (
              <GivenTable given={task.given} />
            )}

            {/* Inputs (disabled once graded) */}
            <fieldset disabled={phase === "grading" || phase === "done"} className="space-y-3">
              {task.input.kind === "rows" && (
                <RowsEditor
                  columns={task.input.columns}
                  rows={rows}
                  setRows={setRows}
                />
              )}
              {task.input.kind === "mcq" && (
                <McqInput
                  options={task.input.options}
                  multiple={task.input.multiple}
                  selected={selected}
                  setSelected={setSelected}
                />
              )}
              {task.input.kind === "fields" && (
                <FieldsInput
                  fields={task.input.fields}
                  values={fields}
                  setValues={setFields}
                />
              )}
            </fieldset>

            {phase === "answering" && (
              <Button onClick={submit}>Submit answer</Button>
            )}
            {phase === "grading" && (
              <Button disabled>
                <Loader2 className="size-4 animate-spin" /> Grading…
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {phase === "done" && grade && (
        <Feedback grade={grade} worked={worked} onRetry={start} />
      )}
    </div>
  );
}

function GivenTable({
  given,
}: {
  given: { title: string; columns: Column[]; rows: Record<string, string | number>[] };
}) {
  return (
    <div className="space-y-1">
      {given.title && <p className="text-sm font-medium">{given.title}</p>}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {given.columns.map((c) => (
                <th key={c.key} className="px-3 py-2 text-left font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {given.rows.map((r, i) => (
              <tr key={i} className="border-t">
                {given.columns.map((c) => (
                  <td key={c.key} className="px-3 py-1.5 tabular-nums">
                    {String(r[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowsEditor({
  columns,
  rows,
  setRows,
}: {
  columns: Column[];
  rows: Record<string, string>[];
  setRows: (r: Record<string, string>[]) => void;
}) {
  function update(i: number, key: string, value: string) {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r));
    setRows(next);
  }
  function addRow() {
    setRows([...rows, Object.fromEntries(columns.map((c) => [c.key, ""]))]);
  }
  function removeRow(i: number) {
    setRows(rows.filter((_, idx) => idx !== i));
  }
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-2 py-2 text-left font-medium">
                  {c.label}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                {columns.map((c) => (
                  <td key={c.key} className="p-1">
                    <Input
                      inputMode={c.type === "number" ? "decimal" : "text"}
                      value={r[c.key] ?? ""}
                      onChange={(e) => update(i, c.key, e.target.value)}
                      className="h-8 border-0 shadow-none focus-visible:ring-1"
                    />
                  </td>
                ))}
                <td className="p-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove row"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="size-4" /> Add row
      </Button>
    </div>
  );
}

function McqInput({
  options,
  multiple,
  selected,
  setSelected,
}: {
  options: { id: string; label: string }[];
  multiple: boolean;
  selected: string[];
  setSelected: (s: string[]) => void;
}) {
  function toggle(id: string) {
    if (multiple) {
      setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
    } else {
      setSelected([id]);
    }
  }
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <label
          key={o.id}
          className="flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm has-checked:border-primary"
        >
          <input
            type={multiple ? "checkbox" : "radio"}
            name="mcq"
            checked={selected.includes(o.id)}
            onChange={() => toggle(o.id)}
            className="mt-0.5"
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

function FieldsInput({
  fields,
  values,
  setValues,
}: {
  fields: { key: string; label: string; multiline: boolean }[];
  values: Record<string, string>;
  setValues: (v: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <label className="text-sm font-medium">{f.label}</label>
          {f.multiline ? (
            <Textarea
              rows={4}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          ) : (
            <Input
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  correct: "text-emerald-700",
  partial: "text-amber-700",
  wrong: "text-destructive",
  missing: "text-destructive",
};

function Feedback({
  grade,
  worked,
  onRetry,
}: {
  grade: Grade;
  worked: string;
  onRetry: () => void;
}) {
  const pct = Math.round(grade.score * 100);
  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Score: {pct}%</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="size-4" /> New variant
          </Button>
        </div>

        <ul className="space-y-2">
          {grade.points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className={STATUS_STYLE[p.status] ?? ""}>
                {p.status === "correct" ? (
                  <Check className="size-4" />
                ) : p.status === "partial" ? (
                  <AlertTriangle className="size-4" />
                ) : (
                  <X className="size-4" />
                )}
              </span>
              <span>
                <span className="font-medium">{p.label}: </span>
                <span className="text-muted-foreground">{p.comment}</span>
              </span>
            </li>
          ))}
        </ul>

        {grade.tip && (
          <p className="bg-muted/50 rounded-lg p-3 text-sm">
            <span className="font-medium">Next time: </span>
            {grade.tip}
          </p>
        )}

        {grade.interviewerNote && (
          <p className="text-sm">
            <span className="font-medium">An interviewer&apos;s view: </span>
            {grade.interviewerNote}
          </p>
        )}

        {grade.uncertainty && (
          <p className="text-amber-700 text-sm">
            <span className="font-medium">Note: </span>
            {grade.uncertainty}
          </p>
        )}

        {worked && (
          <details className="rounded-lg border p-3">
            <summary className="cursor-pointer text-sm font-medium">
              Worked solution
            </summary>
            <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
              {worked}
            </p>
          </details>
        )}

        <p className="text-muted-foreground text-xs">{DISCLAIMER}</p>
      </CardContent>
    </Card>
  );
}
