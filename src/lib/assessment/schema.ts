import { z } from "zod";
import type { TaskType } from "@/curriculum/types";

// How a task is answered and graded. Numeric "rows" tasks with a code check are
// re-verified in code before serving and on grading (§8.1); everything else is
// AI-graded against a rubric.
export type Family = "mcq" | "rows" | "text";
export type CodeCheck = "journal_balanced" | "tb_balanced" | "reconciles" | null;

export function familyOf(t: TaskType): Family {
  if (t === "warmup_mcq") return "mcq";
  if (
    t === "journal_entries" ||
    t === "trial_balance_correction" ||
    t === "bank_reconciliation" ||
    t === "adjusting_entries" ||
    t === "financial_statement_prep"
  )
    return "rows";
  return "text";
}

// Which tasks get hard arithmetic verification in code (never trust the model's
// numbers, §8.1). The rest are AI-graded.
export function codeCheckOf(t: TaskType): CodeCheck {
  if (t === "journal_entries") return "journal_balanced";
  if (t === "trial_balance_correction") return "tb_balanced";
  if (t === "bank_reconciliation") return "reconciles";
  return null;
}

// ---- Generated task (validated with zod after the model returns) ----------

const columnSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "number"]).default("text"),
});

const givenTableSchema = z.object({
  title: z.string().default(""),
  columns: z.array(columnSchema).min(1),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))).default([]),
});

const inputRows = z.object({
  kind: z.literal("rows"),
  columns: z.array(columnSchema).min(1),
  minRows: z.number().int().min(1).max(20).default(3),
});
const inputMcq = z.object({
  kind: z.literal("mcq"),
  options: z.array(z.object({ id: z.string(), label: z.string() })).min(2),
  multiple: z.boolean().default(false),
});
const inputFields = z.object({
  kind: z.literal("fields"),
  fields: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        multiline: z.boolean().default(true),
      }),
    )
    .min(1),
});

export const generatedTaskSchema = z.object({
  scenario: z.string().min(1),
  instructions: z.string().min(1),
  given: givenTableSchema.nullable().optional(),
  input: z.discriminatedUnion("kind", [inputRows, inputMcq, inputFields]),
});
export type GeneratedTask = z.infer<typeof generatedTaskSchema>;

// ---- Hidden answer key (validated; stored with the attempt) ----------------

export const answerKeySchema = z.object({
  // Revealed only after submission (§8.3).
  workedSolution: z.string().min(1),
  // Numeric tasks: the solution rows the code re-checks and grades against.
  solutionRows: z
    .array(z.record(z.string(), z.union([z.string(), z.number()])))
    .optional(),
  // Column keys holding debit/credit (for journal/TB balance checks).
  debitKey: z.string().optional(),
  creditKey: z.string().optional(),
  // Reconciliation: two figures that must end equal.
  reconciledA: z.number().optional(),
  reconciledB: z.number().optional(),
  // MCQ correct answers.
  correctOptionIds: z.array(z.string()).optional(),
  // AI-graded rubric points.
  rubricPoints: z
    .array(z.object({ id: z.string(), point: z.string() }))
    .optional(),
});
export type AnswerKey = z.infer<typeof answerKeySchema>;

// ---- Submission (from the user) -------------------------------------------

export const submissionSchema = z.object({
  rows: z
    .array(z.record(z.string(), z.union([z.string(), z.number()])))
    .optional(),
  selectedOptionIds: z.array(z.string()).optional(),
  fields: z.record(z.string(), z.string()).optional(),
});
export type Submission = z.infer<typeof submissionSchema>;

// ---- Normalized grade result ----------------------------------------------

export const gradeSchema = z.object({
  score: z.number().min(0).max(1),
  points: z.array(
    z.object({
      label: z.string(),
      status: z.enum(["correct", "partial", "wrong", "missing"]),
      comment: z.string(),
    }),
  ),
  tip: z.string(),
  interviewerNote: z.string().optional(),
  uncertainty: z.string().optional(),
});
export type Grade = z.infer<typeof gradeSchema>;
