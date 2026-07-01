import "server-only";
import type { ProviderId } from "@/lib/ai/types";
import { runLLM, parseJSONLoose } from "@/lib/ai/run";
import { AIError } from "@/lib/ai/types";
import type { SkillSpec, TaskType } from "@/curriculum/types";
import {
  answerKeySchema,
  codeCheckOf,
  familyOf,
  generatedTaskSchema,
  type AnswerKey,
  type GeneratedTask,
} from "./schema";
import { keyArithmeticValid } from "./validate";

export interface GenerateResult {
  taskType: TaskType;
  difficulty: number;
  task: GeneratedTask;
  answerKey: AnswerKey;
}

const SYSTEM = `You generate practice tasks for an accountancy training app aimed at ACCA affiliates in Pakistan. You return ONLY a single JSON object, no prose, no markdown fences.

Rules:
- Invent only the SURFACE: company name, industry, the scenario, and self-consistent numbers (use PKR). Never change WHAT is being tested.
- Numbers must be internally consistent and your worked solution must be arithmetically correct. Double-check every total.
- Do NOT state any real accounting/audit standard number, tax rate, fee, or pass rate as fact. If a concept needs one, keep it conceptual.
- Keep it appropriately sized for the difficulty.

Return this exact shape:
{
  "task": {
    "scenario": "string (the situation)",
    "instructions": "string (what the learner must do)",
    "given": { "title": "string", "columns": [{"key","label","type":"text|number"}], "rows": [ {<key>: value} ] } | null,
    "input": <one of the input shapes below>
  },
  "answerKey": {
    "workedSolution": "string (clear, step-by-step; shown only after they submit)",
    ...fields required for this task type (below)
  }
}`;

function contractFor(taskType: TaskType): string {
  const fam = familyOf(taskType);
  const check = codeCheckOf(taskType);

  if (check === "journal_balanced" || check === "tb_balanced") {
    return `INPUT SHAPE (rows):
"input": { "kind": "rows", "columns": [
  {"key":"account","label":"Account","type":"text"},
  {"key":"debit","label":"Debit (PKR)","type":"number"},
  {"key":"credit","label":"Credit (PKR)","type":"number"}
], "minRows": 4 }
ANSWER KEY: include "solutionRows" (array of {account,debit,credit}), "debitKey":"debit", "creditKey":"credit".
Total debits MUST equal total credits in solutionRows. Use 0 (not blank) for the unused side of each line.
${
        check === "tb_balanced"
          ? 'For trial-balance correction, "given" must hold the unbalanced/mis-posted trial balance to fix, and solutionRows the corrected balances.'
          : taskType === "adjusting_entries"
            ? 'For adjusting entries, "given" holds the period-end information (accruals, prepayments, depreciation, bad debts), and solutionRows the correct adjusting journal lines.'
            : 'For journal entries, "given" may hold the list of transactions, and solutionRows the correct journal lines.'
      }`;
  }

  if (check === "numeric_match") {
    if (taskType === "financial_statement_prep") {
      return `INPUT SHAPE (rows):
"input": { "kind": "rows", "columns": [
  {"key":"line","label":"Line item","type":"text"},
  {"key":"amount","label":"Amount (PKR)","type":"number"}
], "minRows": 5 }
"given" must hold the trial balance to work from.
ANSWER KEY: include "solutionRows" (the expected key IS/BS lines with {line, amount}), "valueKey":"amount", "idKeys":["line"], and "balanceA" (total assets) and "balanceB" (total liabilities + equity), they MUST be equal.`;
    }
    if (taskType === "ratio_analysis") {
      return `INPUT SHAPE (rows):
"input": { "kind": "rows", "columns": [
  {"key":"ratio","label":"Ratio","type":"text"},
  {"key":"value","label":"Your value","type":"number"},
  {"key":"meaning","label":"What it tells you","type":"text"}
], "minRows": 3 }
"given" must hold the summarised figures (PKR) needed to compute the ratios. Use only universal ratio formulas (current ratio, gross/net margin, gearing, etc.).
ANSWER KEY: include "solutionRows" (each {ratio, value, meaning}), "valueKey":"value", "idKeys":["ratio"]. The value must equal your own correct computation from the given figures.`;
    }
    // costing
    return `INPUT SHAPE (rows):
"input": { "kind": "rows", "columns": [
  {"key":"item","label":"Item","type":"text"},
  {"key":"value","label":"Value (PKR or units)","type":"number"}
], "minRows": 3 }
"given" must hold the cost / volume / budget data needed (variance, breakeven, or a simple budget).
ANSWER KEY: include "solutionRows" (each {item, value}), "valueKey":"value", "idKeys":["item"]. Every value must be arithmetically correct from the given data.`;
  }

  if (check === "reconciles") {
    return `INPUT SHAPE (fields):
"input": { "kind": "fields", "fields": [
  {"key":"items","label":"Reconciling items and adjustments","multiline":true},
  {"key":"reconciledA","label":"Adjusted cash book balance (PKR)","multiline":false},
  {"key":"reconciledB","label":"Adjusted bank statement balance (PKR)","multiline":false}
] }
"given" must hold the cash book balance, the bank statement balance, and the differences (unpresented cheques, outstanding lodgements, charges, etc.).
ANSWER KEY: include "reconciledA" and "reconciledB" as numbers, they MUST be equal (the agreed reconciled figure).`;
  }

  if (fam === "mcq") {
    return `INPUT SHAPE (mcq):
"input": { "kind": "mcq", "options": [{"id":"a","label":"..."},{"id":"b","label":"..."},{"id":"c","label":"..."},{"id":"d","label":"..."}], "multiple": false }
ANSWER KEY: include "correctOptionIds" (array of the correct option id(s)).`;
  }

  if (fam === "rows") {
    return `INPUT SHAPE (rows):
"input": { "kind": "rows", "columns": [ ...the columns the learner fills, each {"key","label","type"} ], "minRows": 3 }
ANSWER KEY: include "solutionRows" (the correct rows using the same keys).`;
  }

  // text family
  return `INPUT SHAPE (fields):
"input": { "kind": "fields", "fields": [ {"key":"answer","label":"Your answer","multiline":true} ] }
(For tables like deficiency→implication→recommendation you may use several fields.)
ANSWER KEY: include "rubricPoints" (array of {"id","point"}), the specific points a strong answer must cover.`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const INDUSTRIES = [
  "a textile trader",
  "a small software house",
  "a retail pharmacy",
  "a construction subcontractor",
  "a catering business",
  "a mobile-phone wholesaler",
  "a logistics startup",
  "a poultry farm",
];

export async function generateTask(
  provider: ProviderId,
  apiKey: string,
  model: string,
  skillSpec: SkillSpec,
  opts: {
    preferredType?: TaskType;
    recentScore?: number | null;
    difficulty?: number | null;
  } = {},
): Promise<GenerateResult> {
  const { min, max } = skillSpec.difficulty;
  const taskType =
    opts.preferredType && skillSpec.taskTypes.includes(opts.preferredType)
      ? opts.preferredType
      : pick(skillSpec.taskTypes);

  // Difficulty priority: an explicit tier the learner picked wins; otherwise
  // adapt to their recent score (§8.4); otherwise pick from the easier half.
  let difficulty: number;
  if (typeof opts.difficulty === "number") {
    difficulty = opts.difficulty;
  } else if (typeof opts.recentScore === "number") {
    const t = Math.max(0, Math.min(1, opts.recentScore));
    // Centre on the score, nudge up slightly to keep it stretching.
    difficulty = Math.round(min + Math.min(1, t + 0.1) * (max - min));
  } else {
    const mid = Math.floor((min + max) / 2);
    difficulty = Math.floor(Math.random() * (mid - min + 1)) + min;
  }
  difficulty = Math.max(min, Math.min(max, difficulty));

  const user = `Concept(s) to assess: ${skillSpec.concepts.join("; ")}
Task type: ${taskType}
Difficulty: ${difficulty} (1 easy ... 5 hard)
Randomisation hints: base it on ${pick(INDUSTRIES)}; vary names, amounts, and which sub-point you test.
Constraints from the curriculum: ${skillSpec.generatorNotes ?? "none"}

${contractFor(taskType)}`;

  let lastErr = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const { text } = await runLLM(provider, {
      apiKey,
      model,
      system: SYSTEM,
      user,
      json: true,
      maxTokens: 3000,
    });
    let parsed: { task: unknown; answerKey: unknown };
    try {
      parsed = parseJSONLoose(text);
    } catch {
      lastErr = "The AI returned something that wasn't valid JSON.";
      continue;
    }
    const task = generatedTaskSchema.safeParse(parsed.task);
    const key = answerKeySchema.safeParse(parsed.answerKey);
    if (!task.success || !key.success) {
      lastErr = "The generated task didn't match the expected shape.";
      continue;
    }
    // Code-level validation before serving (§8.1): the model's own key must
    // actually balance / tie. Otherwise regenerate.
    if (!keyArithmeticValid(taskType, key.data)) {
      lastErr = "The generated task didn't pass the arithmetic check.";
      continue;
    }
    return { taskType, difficulty, task: task.data, answerKey: key.data };
  }
  throw new AIError(
    `Couldn't generate a valid task after a few tries (${lastErr}). Please try again.`,
  );
}
