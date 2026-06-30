# Build Spec — "ACCA → Job-Ready" (open-source roadmap, practice & assessment app)

> **How to use this file:** This is the complete project brief. Treat it as the source of truth. It contains **no code syntax on purpose** — you decide all implementation details, file structure, and exact code. But you must follow the architecture, scope, content-accuracy rules, UX rules, visual rules, and the **attribution rules** below. When anything here conflicts with your defaults, **this document wins.** Do not invent features or content beyond this spec without flagging them clearly in the project docs.

---

## 0. Summary

Build a polished, open-source web app that takes a person who is **ACCA-qualified (or nearly) but has zero work experience and only basic Excel** from "lost" to "employable," focused on the **Pakistani job market**. It gives them: a clear **branching career roadmap**, **AI-graded practice and assessments** that mirror real Pakistani interviews and real on-the-job tasks, **cheatsheets**, the ability to **add their own learning links**, and **honest progress tracking**. Users bring **their own AI API key** (Claude, OpenAI, Grok, or Gemini). It is fully **host-neutral** (deployable on any Node host) and **open-source / portfolio-grade**. **The person commissioning this build does not know ACCA** — you must generate the curriculum (topics, sub-topics, modules) yourself, accurately, per the rules in §3.

---

## 1. Audience, tone, and a hard constraint

- Primary user: a fresh ACCA affiliate in Pakistan who is overwhelmed and doesn't know what to learn, in what order, or where to practice. She is **not technical**. The app must never confuse her (see §10, which is a priority section).
- Voice: calm, encouraging, structured — a supportive mentor who shows the path and marks progress honestly. Never condescending, never pushy, no hype.
- **Hard constraint:** the app may be open-sourced and shown as a portfolio piece. **Do not hardcode any individual's name, photo, relationship, or personal details anywhere** in code, content, commits, or docs. Any personal welcome message must be a single configurable value set after install, never baked into source.

---

## 2. Goals and non-goals

**Goals**
1. Turn "I'm lost" into "I know exactly what to do next."
2. Provide **real practice and assessments** that genuinely measure whether someone has learned — not throwaway MCQs.
3. Build toward **employability in Pakistan** on one of two real tracks.
4. Be a clean, forkable, host-neutral open-source project that doubles as a strong portfolio piece.

**Non-goals (do NOT build)**
- Not an ACCA **exam-prep** product (no exam banks, no paper-by-paper coaching). ACCA's Study Hub/BPP/Kaplan own that, and exam content goes stale. This app covers the **post-qualification employability gap.**
- No game economy: no resource grinding, upgrade timers, loot, or "town hall" mechanics.
- No auto-generated learning videos or course **URLs** (see §3).
- No assertions about current ACCA rules, fees, or pass rates as fact inside the app.

---

## 3. CONTENT-ACCURACY GUARDRAILS (most important section)

The biggest risk is **confidently producing wrong facts.** Enforce a strict line between what's safe to generate and what must be verified or linked.

**3.1 SAFE to generate / treat as static** (stable universal fundamentals):
- Double-entry rules, the accounting equation, the structure and linkage of the three financial statements.
- Excel/Sheets formulas and what they do; reconciliation, accruals/prepayments, depreciation, bad-debt concepts.
- Standard financial-ratio formulas and what they measure.
- The general structure of a competency roadmap (what skills an accountant/auditor needs and a sensible order to learn them).
- Practice tasks with **made-up but internally consistent numbers** (these only need to be self-consistent, not "true").

**3.2 MUST VERIFY or LINK — never invent from memory:**
- ACCA syllabus specifics, paper names/codes, exam structure, pass rates, fees, PER → **link to `accaglobal.com`**, don't restate as fact.
- Any specific accounting/audit **standard reference number** or any numeric **threshold/materiality/rate.**
- Any **Pakistan tax rate, FBR rule, or filing deadline** → link to the official FBR source; never bake a rate into content.
- **Every learning-resource URL.** Do **not** fabricate a single link. Every resource slot is an empty, clearly-labelled placeholder the human fills in (see §9).

**3.3 AI feedback honesty:** the grading prompts must instruct the model to **flag uncertainty** rather than bluff, and the UI shows a persistent low-key note that AI feedback is a study aid, not authoritative ACCA material.

**3.4 Default:** a link to a real source or an honest "verify this" beats a confident invention every time.

### 3b. Curriculum generation policy (important — read with §3)

The commissioner does not know ACCA, so **you must generate the full roadmap**: tracks → branches → modules → topics → sub-topics, comprehensively, for both tracks and all audit branches. This is acceptable **because the structure of professional competencies is stable, well-established knowledge** — it is not the volatile kind of fact that causes harmful hallucination. While generating it:
- Apply §3.2 to the *content inside* each topic (no invented standard numbers, rates, fees, exam specifics, or URLs — link/verify instead).
- Produce the curriculum as **editable data** (seeded into the DB or a committed data file), never hardcoded into UI markup, so it can be corrected without touching app logic.
- Label it in the docs as **"AI-drafted curriculum, pending domain-expert review,"** and list "curriculum review" as a known open task.
- Keep granularity sensible. Each topic should be small and carry: a short plain-language intro, a cheatsheet, a practice **skill-spec** (see §8), and empty resource slots.

---

## 4. Tech stack (host-neutral; verify versions at build time)

Use modern, currently-supported, non-deprecated tooling. **Do not trust your training data for version numbers** — at build time, check the npm registry / official sites for the **current latest stable** of every dependency and use that. Reject anything deprecated or EOL.

- **Framework:** Next.js (App Router), current stable major (16.x line / React 19.x / Node 20+ as of mid-2026; Turbopack default; confirm current conventions from official docs).
- **Language:** TypeScript, strict mode.
- **Database:** **Neon** (serverless Postgres, free tier). Pure Postgres; we bring our own auth (§5). Note Neon's scale-to-zero cold start (~sub-second) and free-tier limits — fine for this app.
- **ORM/migrations:** **Drizzle ORM** (TypeScript-first, reproducible migrations committed to the repo).
- **Auth:** **Auth.js (NextAuth)** with a credentials provider over Neon, plus our own roles and first-run admin flow (§5). **Do not use Neon Auth or any hosted auth product.**
- **UI components:** **shadcn/ui** as the primitive base — but **fully re-themed** so it does not look like stock shadcn or default AI output (§11).
- **AI providers:** a **small, self-owned adapter layer** (no third-party AI SDK) calling each provider's official REST API (§6). This keeps the project dependency-light, host-neutral, and free of vendor branding.

**Host-neutrality (answers the lock-in concern):** this stack runs on **any** Node host — a VPS, Docker, Railway, Render, Netlify, or Vercel. Nothing here forces a specific host. Document one free path (e.g. Neon + a free Node host) but make clear in the README it deploys anywhere.

---

## 5. Authentication, roles, and user management (self-managed)

No hosted auth product. Build it on Auth.js + Neon.

- **First-run setup:** on first launch, if the users table is empty, **every route redirects to a one-time "Create administrator account" page.** After the first admin exists, that page is permanently disabled. This creates the **super admin.**
- **Roles:** `super_admin` and `user` (optionally an `admin` middle role). Super admin can manage all users.
- **User management** (in Settings, **admin-only**, hidden from normal users): list users; create/invite a user; deactivate/reactivate; reset a user's password; assign/change roles. A normal user never sees these controls.
- **Sessions & security:** hash passwords with a strong modern algorithm (e.g. argon2id or bcrypt); secure/HTTP-only cookies; CSRF protection; rate-limit login attempts; avoid user-enumeration in error messages; all secrets via env vars.
- **Authorization (app-layer):** because we're not using Postgres RLS, **every data query is scoped to the authenticated user**, with explicit ownership checks. Admin-only routes and actions are guarded server-side, not just hidden in the UI.

---

## 6. Bring-your-own-key, multi-provider AI (self-owned adapter layer)

Users supply their own key for one of: **Anthropic Claude, OpenAI, xAI Grok, Google Gemini.** (Gemini has historically offered a free tier — useful for users who can't pay — but don't hardcode that assumption; just support the provider.)

- **One internal interface** with two operations the rest of the app uses: *generate assessment* and *grade submission*. Each returns a **normalized, structured result** so features never care which provider produced it.
- **Adapters:** one thin adapter per provider, each calling that provider's **official REST endpoint** with the correct auth header/model field. **Verify each provider's current API, auth scheme, and request/response shape at build time from their official docs** — do not rely on training data. Adding a fifth provider later = one new adapter.
- **Settings → AI Provider:** the user picks a provider, pastes a key, optionally picks a model; validate with a tiny test call and show clear success/failure.
- **Key security (critical for an open-source, multi-user app):**
  - **Default:** store the key only in the **user's own browser**, send it to a server route **per request**; the server forwards it to the provider and **never persists or logs it.** The key never lives on the server at rest.
  - **Optional, opt-in:** encrypted-at-rest per-user storage for convenience, clearly explained.
  - Never log keys; never put them in error messages; never ship any key in client source. `.env.example` holds placeholders only.
- All provider calls run **server-side** (no calling providers directly from the browser — avoids CORS and key exposure). Handle bad-key/quota/rate-limit errors with a friendly message linking back to Settings.

---

## 7. Data model (prose — you design the schema)

Persist at least:
- **Users** (with role, status, hashed password) and a per-user **profile** (chosen track + branch, preferences, optional personalized welcome text).
- **Curriculum**: track → branch → module → topic → sub-topic, stored as **editable data**, each topic carrying its intro, cheatsheet reference, and a **practice skill-spec** (§8).
- **Resource links**: per topic, user-addable (title, URL, note); seeded as empty placeholders only.
- **Cheatsheets**: per topic, structured static content (§9).
- **Progress**: per user per topic — manual `completed` flag + practice stats (attempts, best score, last attempt, mastery estimate).
- **Assessment attempts**: per user — the generated task, its hidden answer key/rubric, the user's submission, the score, the feedback, timestamp (powers the mistake-review log and readiness score).
- **AI settings**: provider + model per user (key handled per §6, preferably not stored server-side).

Enforce per-user data isolation in every query (app-layer, §5).

---

## 8. Assessment engine (the heart of the app — build this richly)

The point is to **measure real competence**, the way a Pakistani audit firm or finance employer actually would — not generic multiple-choice. Generic MCQs are allowed only as a small warm-up layer; the real assessments are the task types below.

### 8.1 How tasks are generated (grounded, randomized, not hallucinated)
- Each topic stores a **skill-spec**: the concept(s) to assess, the **allowed task types** for that topic, a difficulty range, and **rubric/grading criteria.** The generator is constrained by this spec — the AI invents only the **surface** (company name, industry, the actual numbers, the scenario), never *what* is being tested.
- The generator must also return a **hidden answer key / worked solution** as structured data, stored with the task.
- **Code-level validation before serving:** for numeric tasks, re-check the math in code (e.g. the corrected trial balance actually balances; the reconciliation actually ties; the journal is balanced). If the model's own key fails the code check, **regenerate** rather than serve a broken task. Code verifies arithmetic — never trust the model's confidence for numbers.
- **Randomization:** vary industry, names, magnitudes, and which sub-concept, parameterized by difficulty, so tasks can't be memorized. Repeating a topic yields a fresh variant.

### 8.2 Task-type catalog (build these; map each to topics via the skill-spec)

**Practical / numeric (core "can she actually do the job"):**
1. **Trial-balance correction** — an unbalanced or mis-posted TB to fix. *Submit:* corrected figures in a structured table. *Grade:* code checks it balances and matches the key; AI explains errors.
2. **Journal entries from transactions** — a batch of business events to record. *Submit:* structured rows (account, debit, credit). *Grade:* code checks balanced + AI checks correct accounts/amounts vs key.
3. **Bank reconciliation** — bank statement vs cash book. *Submit:* reconciling items + adjusted balances. *Grade:* code checks it reconciles; AI checks the items.
4. **Adjusting/closing entries** — accruals, prepayments, depreciation, bad debts. *Submit:* structured entries. *Grade:* AI vs key, with arithmetic re-checked in code.
5. **Financial-statement prep from a TB** — produce key IS/BS lines. *Submit:* line items. *Grade:* code arithmetic + AI.
6. **Ratio computation + interpretation** — compute ratios and explain what they say. *Submit:* numbers + short text. *Grade:* numbers code-checked; interpretation AI-graded.
7. **Costing/management** — variance analysis, breakeven, simple budgets. *Submit:* structured + short reasoning. *Grade:* code + AI.

**Audit (Track A):**
8. **Risk identification** — a scenario; list risks of material misstatement and why. *Submit:* structured list. *Grade:* AI rubric vs expected risk points.
9. **Design audit procedures** for a given assertion. *Submit:* free text. *Grade:* AI rubric.
10. **Control-deficiency analysis** — deficiency → implication → recommendation table. *Submit:* structured rows. *Grade:* AI rubric.
11. **Working-paper note** — write a clear, correct working-paper note. *Grade:* AI on correctness, structure, clarity.
12. **Evidence/sampling reasoning** — justify an approach. *Grade:* AI rubric.

**Interview-style (the Pakistani interview reality):**
13. **Technical viva questions** — e.g. walk through how the three statements connect; provision vs reserve; deferred tax in plain terms; statutory vs internal audit; materiality; going concern; types of audit opinion; accrual vs cash basis. *Submit:* typed answer as if spoken. *Grade:* AI scores correctness, depth, and structure, plus a **"how an interviewer would rate this"** note. (Avoid questions that hinge on specific standard numbers/rates per §3.2, or mark them verify.)
14. **HR/behavioural** — why audit, strengths/weaknesses, handling deadlines. *Grade:* AI feedback on structure (e.g. STAR), specificity, confidence.

**Judgment & review:**
15. **Case/scenario analysis** — a business situation to analyse. *Submit:* free text. *Grade:* AI rubric.
16. **Error-spotting / review** — a prepared statement or working paper with **planted errors** (the generator records them as the key). *Submit:* the errors found. *Grade:* code/AI vs the known error key. This directly trains review skill — exactly what junior auditors do.

**Tooling & communication:**
17. **Excel/spreadsheet task** — a small dataset + a task ("summarise X with a pivot", "write the formula for Y"). *Submit:* the formula/approach as text, or download the dataset, do it in real Excel, and report the result. *Grade:* AI checks the formula/approach logic. (Optionally also offer **downloadable messy CSVs** for real-Excel practice.)
18. **"Explain to a client"** — explain a concept simply and correctly. *Grade:* AI on clarity + accuracy. Trains the communication skill freelancing demands.

### 8.3 Submission mechanics
- Each task type gets a **tailored input**: structured mini-tables (numeric/journal/reconciliation/deficiency), text areas (analysis/interview/explain), selection/checkbox (error-spotting, warm-up MCQs).
- **Autosave drafts.** Submitting **locks** the attempt. The **worked solution is revealed only after submission**, so she actually attempts it first.
- After grading, show: score, point-by-point what's right/wrong/missing, the **worked solution**, a concrete **"next time, do this"** tip, and (for interview tasks) the interviewer's-eye view — always with the §3.3 disclaimer.
- **Retry** spins up a fresh randomized variant. Every attempt is saved for the **mistake-review log** (§9).

### 8.4 Difficulty & readiness
- Difficulty adapts to recent scores per topic.
- Aggregate scores into a per-topic **mastery** estimate and a per-track **"readiness" indicator** — an honest reflection of completed practice, not engagement points. This becomes her "am I ready to apply / take a test?" signal.

---

## 9. Features

**Ship in v1 (with the first vertical slice / immediately after):**
- **Roadmap view** (§7.2 below) and **track/branch selection.**
- **Topic pages** with intro + **cheatsheet** + **resource manager** + **assessment engine** + **checkmark/progress.**
- **Cheatsheets** — per topic, quick-reference of stable fundamentals (§3.1). Anything needing a specific standard number/rate/jurisdiction figure must link out or be marked "verify." Printable, collapsible, mobile-friendly.
- **Resource manager** — per topic the user adds/edits/deletes their own links (title, URL, note). Every topic seeded with **empty, clearly-labelled placeholder slots**; **no pre-filled URLs** (§3.2). Optional "mark as watched."
- **Progress & checkmarks** — manual checkmark + auto-completion from passed practice; per-module and overall progress; honest **readiness** indicator; optional light streak.
- **Mistake-review log** — review past attempts, see what was wrong and the worked solution; re-attempt weak topics.

**Strong fast-follow features (design the data model so these slot in; build after v1 — do NOT attempt all of these in the 2-day window):**
- **Interview simulator** — AI plays a Pakistani audit-firm / finance interviewer and runs a sequential mock interview (technical + HR), then gives structured feedback. Very high value; flag as the top fast-follow.
- **Portfolio builder** — compile her best completed practical tasks into a clean, downloadable portfolio (directly useful for Upwork/freelance and job applications).
- **CV / cover-letter / Upwork-proposal helper** — AI-assisted, tailored to an ACCA fresher in the Pakistani market, with editable templates.
- **Glossary** — searchable terms (safe fundamentals generated; standard-specific terms link out).
- **Spaced repetition** — resurface topics she scored low on.
- **Downloadable Excel practice datasets** (messy CSVs) for real-Excel practice with self-check.
- **"Ask the tutor"** — scoped Q&A about the current topic, with the §3.3 disclaimer.
- **Per-topic notes / journaling** and **bookmarks/favorites.**

Mark anything beyond v1 clearly in the docs as a roadmap item, so scope stays controlled.

### 7.2 Roadmap view (the cure for "lost")
A visual, branching roadmap (track → branch → module → topic) with a clear **"you are here" / next step** and an overall progress bar. Tapping a node opens it. Keep it legible and calm on mobile. No game mechanics.

---

## 10. UX principles (PRIORITY — the app must never confuse a non-technical first-time user)

This is a primary success criterion, not a nice-to-have.
- **One clear primary action per screen.** Every screen answers "what do I do next?" Never a blank dead-end.
- **Guided first run.** After login, walk her gently into picking a track and starting the first topic. Explain the two tracks in plain language (no ACCA jargon required from her).
- **Plain, user-side language everywhere.** Name things by what she controls and recognises, not by how the system works. Sentence case, active voice, no filler. A button's verb matches the resulting confirmation ("Mark complete" → "Marked complete").
- **Progressive disclosure.** Don't show everything at once; reveal depth as she goes.
- **Consistency.** Same layout, same vocabulary, predictable navigation throughout.
- **Mobile-first.** Big tap targets, fast, thumb-friendly. She will likely use a phone.
- **Immediate feedback** on every action; clear loading/disabled states; **confirm + undo** for anything destructive.
- **Instructive empty and error states.** Empty = an invitation to act ("No resources yet — add your first link"). Errors explain what happened and how to fix it, in the interface's voice, never vague, never apologetic.
- **Low setup cost to first value.** Roadmap, cheatsheets, and resources must work **without** an AI key; only the practice grading needs one. Make the key step skippable at first.

---

## 11. Visual identity (must NOT look AI-generated or templated)

**Follow the installed `frontend-design` skill** (`/mnt/skills/public/frontend-design/SKILL.md`) and its process. Key requirements distilled:
- Use **shadcn/ui** for accessible primitives, then **fully re-theme it** — custom palette, type, radius, spacing, shadows — so the result does **not** read as stock shadcn or default AI UI.
- **Explicitly avoid the three AI-default looks:** (1) warm cream background + high-contrast serif + terracotta accent; (2) near-black background + single acid-green/vermilion accent; (3) broadsheet hairline rules with zero border-radius. Don't spend free design choices on these.
- **Make a real token system first:** 4–6 named hex colors; a deliberate type pairing (a characterful display face used with restraint + a clean body face + a utility face for data/labels); a stated layout concept; and **one signature element** the app is remembered by. Derive every color/type decision from these tokens.
- **Ground it in the subject:** the feeling should support *building professional confidence and competence* — disciplined, trustworthy, quietly warm; legible and calm, not a sterile corporate dashboard and not flashy. Pick a specific, justifiable direction; don't default.
- **Restraint:** spend boldness in one place, keep the rest quiet. **Quality floor:** responsive to mobile, visible keyboard focus, reduced-motion respected. Use motion sparingly — over-animation reads as AI-generated.
- Treat **copy as design material** per the skill: plain, specific, user-side.

---

## 12. Attribution policy (strict — read carefully)

This is the developer's own project and portfolio piece. **No AI tool, assistant, or agent may be credited or referenced anywhere.** Concretely, there must be **no mention of any AI assistant/agent/tool** (by any name) in:
- the app UI, footer, about page, error pages, or HTML `<title>`/meta/`generator` tags;
- the README, any docs, or screenshots/copy;
- code comments;
- **commit messages, commit author, or commit email** — commits are authored as the developer, in a normal human conventional-commit style, with **no AI co-author trailer or "generated by" line**;
- `package.json` (name/author/description), the LICENSE author line, or any config defaults.

Remove any framework/CLI boilerplate that injects such attribution. The developer's name (configurable) is the author. 

Note the one allowed, *functional* use of the word "AI": describing the practice feature, which runs on the **user's own LLM key** (e.g. "AI-graded practice with your own API key"). That describes a product capability and is fine; it must never imply the app itself was built by an AI.

---

## 13. Curriculum skeleton (seed — you expand this comprehensively per §3b)

Treat this as a starting scaffold to expand into a full, well-structured roadmap with proper sub-topics. Keep each topic small and editable; where detail would require §3.2 facts, link/placeholder instead.

**Shared Foundation (both tracks):**
1. Advanced Excel for accountants — pivot tables, lookup functions, conditional logic, data validation, Power Query concepts, simple modeling.
2. Financial statements — reading and building IS/BS/cash-flow from a trial balance; how the three statements link.
3. Ledgers, journals, and bank/ledger reconciliation; accruals, prepayments, depreciation, bad debts.

**Track A — Firm / Audit** (goal: training contract at a Pakistani audit firm → real experience). Branches:
- **A1. External / Statutory Audit:** the audit process, risk & materiality (concepts, not invented numbers), assertions, evidence, sampling, documentation/working papers, plus firm-interview and training-contract prep.
- **A2. Internal Audit:** governance, risk & controls, control testing, reporting to management; how it differs from external audit.
- *Specialism offshoots (advanced, optional):* **A3. IT / Information-Systems Audit** (controls in a computerised environment, access/data integrity); **A4. Forensic / Investigative Audit** (fraud indicators, investigative approach, evidence handling — high level).

**Track B — Freelance / Accounting** (goal: earn via bookkeeping/accounts for clients): QuickBooks Online → Xero → month-end close → management accounts → **FBR IRIS basics** (link to FBR; never invent rates) → **portfolio + Upwork/LinkedIn profile setup** + client communication.

Onboarding must state plainly: **Track A is the credential/experience route (you become an "auditor"); Track B is the income/flexibility route (bookkeeping/accounts); you cannot freelance as a statutory auditor.** With no experience, the common real-world sequence is firm-first for experience, then freelance later with credibility — present as guidance, not a rule.

---

## 14. Open-source docs & README (portfolio-grade)

Write docs a hiring manager or fellow developer would respect — and that follow §12 (no AI attribution anywhere).
- **README:** what the app is and who it's for; a concise feature overview; a clear architecture summary (stack + why each choice); full local setup; how to create a free Neon database and wire env vars; how the first-run admin setup works; how to bring an AI key; **how to deploy on any Node host** (with one concrete free example); and **how a maintainer edits the curriculum, cheatsheets, and resource slots without touching app code.** Leave placeholders for screenshots.
- **`.env.example`** with placeholders only; never commit secrets.
- **Architecture doc** (short): the provider-adapter design, the assessment-generation + code-validation flow, and the auth/roles model.
- **CONTRIBUTING** + a **known-limitations** list: curriculum is AI-drafted pending expert review; AI feedback is a study aid; resource links are user-supplied by design.
- A permissive license (MIT is a fine default), authored to the developer.

---

## 15. Deployment

- Runs on **any Node host.** Document one free path (Neon free Postgres + a free Node host) and state clearly it isn't required — no host lock-in.
- Document every environment variable.
- Server routes that call AI providers must run in a runtime compatible with per-request key forwarding (§6).
- Note Neon's free-tier behaviour (scale-to-zero cold start, branch storage limits) in the README; optionally offer a lightweight keep-alive, but don't over-engineer.

---

## 16. Build order (the developer wants ~2 days — DO EXACTLY THIS)

**Ship one complete vertical slice first; scaffold the rest. Do not hand-author all of both tracks in one pass — that's where things stall or hallucinate.**
1. Scaffold the app (verify latest stable versions first). Set up Neon, Drizzle, schema + migrations.
2. Build **auth**: first-run super-admin setup page, login, roles, and the admin **user-management** screen.
3. Seed the **curriculum data** and build **one Foundation topic end-to-end**: intro + cheatsheet + empty resource slots + checkmark + progress.
4. Build the **roadmap view** with track/branch selection and progress.
5. Build **Settings → AI provider** (BYO key) + the **adapter layer** + the **assessment engine**, wired into that one Foundation topic — including code-level validation of numeric tasks and the mistake-review log. Get the full practice loop working on the slice.
6. Once the slice is proven, **expand the curriculum** across modules (per §3b/§13) and add cheatsheets + resource slots throughout; remaining topics can be editable stubs.
7. Polish: visual identity per §11, the UX pass per §10, mobile, empty/error states, README/docs/license per §14, scrub all attribution per §12, deploy.

---

## 17. Definition of done
- A user signs up (or is created by the admin), the first-run admin flow works, roles and user management work.
- A user picks a track/branch, optionally sets an AI key for any of the four providers, and immediately has a clear next step.
- At least the Foundation topic(s) are fully usable: intro + cheatsheet + add-your-own-resource + **real assessment** (generate → tailored submission → graded feedback with worked solution) + checkmark + progress + mistake-review.
- Numeric tasks are **code-validated** before serving and on grading; no fabricated URLs anywhere; syllabus/standard/rate facts are linked, not asserted; AI feedback shows the uncertainty note.
- The UI is distinctive (not stock shadcn / not an AI-default look), mobile-first, and easy for a non-technical first-time user.
- **No AI/assistant attribution anywhere** (app, docs, commits, metadata).
- Deploys cleanly on a free Node host + Neon with a documented `.env`; repo is open-source-ready (license, README, architecture doc, `.env.example`, no secrets, no personal data, reproducible migrations).

---

## 18. Do-NOT list (recap)
- Don't build exam prep / question banks; don't reduce assessments to generic MCQs.
- Don't invent ACCA syllabus details, standard numbers, tax rates, fees, or pass rates — link/verify.
- Don't generate or pre-fill any learning-resource URLs.
- Don't add game-economy mechanics.
- Don't store or log users' API keys server-side by default; never expose them client-side.
- Don't hardcode any personal/individual data.
- Don't use Neon Auth or any hosted auth product; build the self-managed auth in §5.
- Don't credit or reference any AI tool/assistant/agent anywhere (§12).
- Don't ship stock-shadcn or an AI-default aesthetic (§11).
- Don't pin outdated/deprecated package versions — verify latest stable at build time.
- Don't try to author all curriculum content in one pass — vertical slice first (§16).
- Don't add undocumented features; record any additions in the docs.
