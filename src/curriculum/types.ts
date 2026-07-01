// ---------------------------------------------------------------------------
// Curriculum types. The curriculum is AI-DRAFTED, pending domain-expert review
// (see docs/known-limitations). It lives in editable data files (curriculum/*),
// NOT in UI markup, so a maintainer can correct it without touching app logic.
//
// Content rules baked into these types (§3): cheatsheets carry stable
// fundamentals only; anything needing a specific standard number, rate, fee or
// jurisdiction figure must be a `verify` callout that links out, never an
// asserted fact. No learning-resource URLs are ever stored here; topics expose
// empty, labelled resource slots the user fills in themselves.
// ---------------------------------------------------------------------------

// The assessment task types (§8.2). The generator may only produce a task type
// listed in a topic's skill-spec; it invents the surface, never what is tested.
export type TaskType =
  | "warmup_mcq"
  | "trial_balance_correction"
  | "journal_entries"
  | "bank_reconciliation"
  | "adjusting_entries"
  | "financial_statement_prep"
  | "ratio_analysis"
  | "costing"
  | "risk_identification"
  | "audit_procedures"
  | "control_deficiency"
  | "working_paper_note"
  | "evidence_sampling"
  | "technical_viva"
  | "hr_behavioural"
  | "case_analysis"
  | "error_spotting"
  | "excel_task"
  | "explain_to_client";

// Which family a task type belongs to, drives how the submission UI and the
// grader behave (code-checked numeric vs AI-rubric text).
export type TaskFamily = "numeric" | "structured" | "text" | "mcq";

export interface SkillSpec {
  // The concept(s) this topic assesses, in plain language.
  concepts: string[];
  // Task types the generator is allowed to choose from for this topic.
  taskTypes: TaskType[];
  // Inclusive difficulty band (1 = gentle ... 5 = stretch).
  difficulty: { min: number; max: number };
  // Plain-language grading criteria the AI grader is held to.
  rubric: string[];
  // Extra constraints handed to the generator (e.g. "use PKR; invent the
  // numbers; keep the trial balance to ~8 accounts"). Never standard numbers.
  generatorNotes?: string;
}

// A cheatsheet is a list of blocks. `verify` blocks are for anything that would
// otherwise require a §3.2 fact: they link out instead of asserting.
export type CheatsheetBlock =
  | { kind: "points"; heading: string; points: string[] }
  | { kind: "terms"; heading: string; terms: { term: string; def: string }[] }
  | {
      kind: "formula";
      heading: string;
      formulas: { name: string; expr: string; means: string }[];
    }
  | { kind: "verify"; heading: string; note: string; link: { label: string; url: string } };

export interface Topic {
  slug: string; // stable, globally unique, keys all per-user data
  title: string;
  // One short, plain-language paragraph: what this is and why it matters.
  intro: string;
  cheatsheet: CheatsheetBlock[];
  // Labels for the empty resource slots shown on the topic page (no URLs, §3.2).
  resourceSlotHints: string[];
  // Present = practice is available. Absent = editable stub pending content.
  skillSpec?: SkillSpec;
  // "ready" = reviewed-enough to use; "stub" = scaffold, content pending (§3b).
  status: "ready" | "stub";
}

export interface Module {
  slug: string;
  title: string;
  summary: string;
  topics: Topic[];
}

export interface Branch {
  id: string;
  title: string;
  // Plain-language, no ACCA jargon required from the learner (§10).
  description: string;
  advanced?: boolean; // optional specialism offshoot (§13)
  modules: Module[];
}

export interface Track {
  id: string;
  title: string;
  tagline: string;
  description: string;
  // Honest framing shown at selection time (§13).
  goal: string;
  // Real software worth getting comfortable with on this track. Names only, no
  // invented feature/pricing claims; firm-only tools are marked "on the job".
  tools: { name: string; note: string }[];
  branches: Branch[];
}

export interface Curriculum {
  // Shared by both tracks (§13).
  foundation: Module[];
  tracks: Track[];
}
