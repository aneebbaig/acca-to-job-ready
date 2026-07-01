import type { TaskType } from "@/curriculum/types";
import { codeCheckOf, type AnswerKey, type Submission } from "./schema";

const EPS = 0.01;
type Row = Record<string, string | number>;

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[, ]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function norm(v: unknown): string {
  return String(v ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function sum(rows: Row[], key: string): number {
  return rows.reduce((acc, r) => acc + num(r[key]), 0);
}

// Verify the model's OWN answer key actually satisfies the arithmetic before we
// serve the task. If it fails, the caller regenerates rather than ship a broken
// task (§8.1).
export function keyArithmeticValid(
  taskType: TaskType,
  key: AnswerKey,
): boolean {
  const check = codeCheckOf(taskType);
  if (!check) return true;

  if (check === "journal_balanced" || check === "tb_balanced") {
    const rows = key.solutionRows ?? [];
    if (rows.length === 0 || !key.debitKey || !key.creditKey) return false;
    const d = sum(rows, key.debitKey);
    const c = sum(rows, key.creditKey);
    return Math.abs(d - c) < EPS && (d > 0 || c > 0);
  }
  if (check === "reconciles") {
    if (key.reconciledA == null || key.reconciledB == null) return false;
    return Math.abs(key.reconciledA - key.reconciledB) < EPS;
  }
  return true;
}

export interface CodeGrade {
  score: number; // 0..1
  points: { label: string; status: "correct" | "partial" | "wrong" | "missing"; comment: string }[];
}

// Code-grade a numeric rows task by comparing the submission to the key, and
// re-checking that the submission itself balances/ties.
export function gradeNumericRows(
  taskType: TaskType,
  key: AnswerKey,
  submission: Submission,
): CodeGrade | null {
  const check = codeCheckOf(taskType);
  if (!check) return null;

  const subRows = submission.rows ?? [];
  const points: CodeGrade["points"] = [];

  if (check === "reconciles") {
    // The user submits adjusted balances in two fields; we re-tie them.
    const a = num(submission.fields?.reconciledA);
    const b = num(submission.fields?.reconciledB);
    const ties = Math.abs(a - b) < EPS && (a !== 0 || b !== 0);
    points.push({
      label: "Adjusted balances agree",
      status: ties ? "correct" : "wrong",
      comment: ties
        ? "Your two adjusted balances reconcile."
        : "Your adjusted balances don't yet agree — recheck the reconciling items.",
    });
    const expected = key.reconciledA ?? 0;
    const right = ties && Math.abs(a - expected) < EPS;
    return { score: right ? 1 : ties ? 0.6 : 0.2, points };
  }

  // journal_balanced / tb_balanced
  const solRows = key.solutionRows ?? [];
  const dKey = key.debitKey!;
  const cKey = key.creditKey!;
  const idKeys = solRows.length
    ? Object.keys(solRows[0]).filter((k) => k !== dKey && k !== cKey)
    : [];

  // 1) Does the submission itself balance?
  const subBalances =
    Math.abs(sum(subRows, dKey) - sum(subRows, cKey)) < EPS &&
    sum(subRows, dKey) > 0;
  points.push({
    label: "Entries balance",
    status: subBalances ? "correct" : "wrong",
    comment: subBalances
      ? "Total debits equal total credits."
      : "Total debits don't equal total credits.",
  });

  // 2) Match each key row to a submission row by identifier.
  let matched = 0;
  let partial = 0;
  for (const sol of solRows) {
    const sig = idKeys.map((k) => norm(sol[k])).join("|");
    const cand = subRows.find(
      (r) => idKeys.map((k) => norm(r[k])).join("|") === sig,
    );
    if (!cand) {
      points.push({
        label: idKeys.map((k) => sol[k]).join(" "),
        status: "missing",
        comment: "Expected line not found in your answer.",
      });
      continue;
    }
    const dOk = Math.abs(num(cand[dKey]) - num(sol[dKey])) < EPS;
    const cOk = Math.abs(num(cand[cKey]) - num(sol[cKey])) < EPS;
    if (dOk && cOk) {
      matched++;
      points.push({
        label: idKeys.map((k) => sol[k]).join(" "),
        status: "correct",
        comment: "Correct amounts.",
      });
    } else {
      partial++;
      points.push({
        label: idKeys.map((k) => sol[k]).join(" "),
        status: "partial",
        comment: `Amounts differ from the worked solution.`,
      });
    }
  }

  const total = Math.max(solRows.length, 1);
  // Score: row accuracy, with a small weight on the balance check.
  const rowScore = (matched + 0.4 * partial) / total;
  const score = Math.max(0, Math.min(1, rowScore * 0.85 + (subBalances ? 0.15 : 0)));
  return { score, points };
}
