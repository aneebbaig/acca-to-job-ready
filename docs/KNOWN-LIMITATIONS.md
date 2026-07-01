# Known limitations & open tasks

Honest list of what is intentionally incomplete or worth improving.

- **The curriculum is AI-drafted, pending domain-expert review.** The track →
  branch → module → topic structure and topic content were generated as a
  starting scaffold. The overall shape of professional competencies is stable,
  well-established knowledge, but the specifics deserve a review by a qualified
  ACCA professional before this is relied on. **"Curriculum review" is the top
  open task.** Topics marked _"Draft — pending review"_ in the UI are scaffolded
  stubs.

- **AI feedback is a study aid, not authoritative material.** Grading runs on
  the user's own LLM and can be wrong. The app surfaces this and instructs the
  model to flag uncertainty, but feedback should not be treated as an official
  ACCA verdict.

- **Resource links are user-supplied by design.** The app ships **no** learning
  URLs. Every resource slot is an empty placeholder the user fills in. This is
  deliberate — fabricated links are worse than none.

- **No standard numbers, rates, fees, or pass rates are asserted.** Anything
  jurisdiction- or standard-specific links out (ACCA, FBR) or is marked
  "verify". Don't add such figures to the curriculum data — link instead.

- **Login rate-limiting is in-memory.** Fine for a single instance; swap for a
  durable store (e.g. Upstash/Redis) when running multiple instances.

- **Code arithmetic validation covers the three core numeric types** — journal
  entries, trial-balance correction, and bank reconciliation are re-checked in
  code before serving and on grading. Adjusting entries, financial-statement
  prep, ratios, and costing are AI-graded; extending the in-code arithmetic
  re-check to those is a good next step. Control-deficiency answers use free-text
  fields rather than a strict three-column table.

- **Excel module is a starting slice** — lookups and pivot tables are authored;
  conditional logic, data validation, Power Query, and simple modelling are
  worth adding as topics.

- **One task type is unmapped: `costing`** (variance analysis, breakeven, simple
  budgets). The engine supports it, but the §13 seed curriculum has no
  management-accounting topic to attach it to yet — add one and reference
  `costing` in its skill-spec.

- **Practice depth varies by topic.** The assessment engine is wired across the
  foundation and the audit/freelance skill-specs, but not every topic has a
  skill-spec yet. Topics without one show a "practice coming" note.

- **Fast-follow features not yet built:** a sequential interview simulator, a
  portfolio builder from completed tasks, a CV/cover-letter/Upwork-proposal
  helper, a glossary, spaced repetition, downloadable Excel practice CSVs, an
  "ask the tutor" scoped Q&A, and per-topic notes/bookmarks. The data model is
  designed so these slot in.

- **Provider model defaults move.** Default model names per provider are
  reasonable at time of writing but change often; the Settings page lets the
  user override the model and validates it with a test call.
