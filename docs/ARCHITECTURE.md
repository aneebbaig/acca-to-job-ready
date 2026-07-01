# Architecture

A short tour of the three parts most worth understanding: the AI provider
adapter, the assessment generation + code-validation flow, and the auth/roles
model.

## Provider-adapter design

The app never talks to an AI provider directly. It uses a small, self-owned
adapter layer (`src/lib/ai/`) with **one internal interface** and **one thin
adapter per provider**:

- `run.ts` exposes `runLLM(provider, request)`, the single call the rest of the
  app makes. Internally it dispatches to a per-provider function that calls that
  provider's **official REST endpoint** (Anthropic Messages API, OpenAI /
  xAI chat-completions, Google Gemini `generateContent`).
- `providers.ts` is the catalogue (label, default model, keys URL). Adding a
  fifth provider is one entry here plus one adapter branch, no feature code
  changes.
- All provider calls run **server-side** (API routes), so keys never touch the
  browser network and there are no CORS problems. HTTP failures are turned into
  friendly messages that never contain the key.

**Key handling.** By default the user's key lives only in their browser
(`localStorage`) and is sent to the server in a per-request `x-ai-key` header;
the server forwards it to the provider and never persists or logs it. Users may
opt in to encrypted-at-rest storage (`AES-256-GCM`, `src/lib/ai/crypto.ts`),
which is the only path that writes a key server-side.

## Assessment generation + code validation

The engine (`src/lib/assessment/`) is built so the model invents only the
*surface*, never *what* is tested.

1. **Skill-spec constrains generation.** Each topic in the curriculum carries a
   skill-spec: the concepts to assess, the allowed task types, a difficulty
   range, rubric criteria, and generator notes. `generate.ts` builds a prompt
   from that spec plus randomised surface hints (industry, names, magnitudes).
2. **Structured task + hidden key.** The model returns a single JSON object: the
   task shown to the learner and a hidden answer key (worked solution, solution
   rows, correct options, or rubric points). Both are validated with zod
   (`schema.ts`).
3. **Code-level validation before serving.** For numeric task types
   (`validate.ts`), the generator's own key is re-checked in code, the journal
   balances, the trial balance ties, the reconciliation agrees. If the model's
   key fails the arithmetic check, the task is **regenerated** rather than
   served (up to a few attempts). Code verifies arithmetic; the model's
   confidence is never trusted for numbers.
4. **Serve without the key.** The task is stored with its hidden key
   (`assessment_attempts`), and only the task is returned to the browser. The
   worked solution is revealed after submission.
5. **Grading.** On submit, numeric answers are graded in code (authoritative for
   the numbers) and the AI adds a point-by-point explanation; MCQs are pure
   code; text/interview answers are graded by the AI against the rubric. The
   grading prompt instructs the model to **flag uncertainty rather than bluff**,
   and the UI carries a persistent note that AI feedback is a study aid, not
   authoritative ACCA material.
6. **Progress.** Scores feed a per-topic mastery estimate and auto-completion on
   a strong pass; every attempt is retained for the mistake-review log.

## Auth and roles

Self-managed on Auth.js v5 + Neon, no hosted auth product.

- **First-run setup.** If the users table is empty, the root layout's guard
  sends every route to a one-time `/setup` page that creates the **super
  admin**. Once any user exists, `/setup` is permanently disabled.
- **Split config.** `auth.config.ts` is edge-safe (no DB, no argon2) and holds
  the session/JWT callbacks and the route-authorization callback used by
  `proxy.ts` (Next 16's middleware successor, Node runtime). `auth.ts` adds the
  credentials provider whose `authorize` hits the DB and verifies the password
  with argon2id.
- **Roles.** `super_admin`, `admin`, `user`. Admin-only user management
  (create, deactivate/reactivate, reset password, change role) is guarded
  server-side in every action (`requireAdmin`), not just hidden in the UI.
- **Per-user isolation.** Every data query is scoped to the authenticated user
  with explicit ownership checks in the `WHERE` clause, the app does not rely
  on Postgres RLS.
- **Security.** argon2id password hashing, secure HTTP-only session cookies,
  CSRF handled by Auth.js, login rate-limiting, generic auth errors (no user
  enumeration), and all secrets via environment variables.

## Data model

`src/db/schema.ts` (Drizzle). User-owned data is keyed by stable topic slugs;
the curriculum itself lives in committed data files, not the database.

- `users`, `profiles` (chosen track/branch, optional personalized welcome).
- `resource_links` (user-added, per topic).
- `progress` (per user per topic: completion, attempts, best score, mastery).
- `assessment_attempts` (task, hidden key, submission, score, feedback).
- `ai_settings` (provider + model; key only if the user opted into storage).
