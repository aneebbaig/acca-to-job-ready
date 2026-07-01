# ACCA → Job-Ready

An open-source roadmap, practice, and assessment app that takes a person who is
**ACCA-qualified (or nearly) but has no work experience** from "lost" to
employable — focused on the **Pakistani job market**.

It gives them a clear branching **career roadmap**, **practice and assessments**
that mirror real Pakistani interviews and on-the-job tasks (graded by AI using
the user's own API key), per-topic **cheatsheets**, a place to **save their own
learning links**, and honest **progress tracking**.

> The practice feature is **AI-graded using your own API key** — Anthropic,
> OpenAI, xAI, or Google. This is the one product capability that uses an LLM;
> nothing else here depends on it.

## Who it's for

A fresh ACCA affiliate in Pakistan who is overwhelmed and doesn't know what to
learn, in what order, or where to practise. The interface is written for a
non-technical first-time user: one clear next step per screen, plain language,
mobile-first.

Two tracks:

- **Firm / Audit** — the credential and experience route (training contract at a
  Pakistani audit firm), with external, internal, IT, and forensic branches.
- **Freelance / Accounting** — the income and flexibility route (bookkeeping and
  accounts for clients, QuickBooks/Xero, month-end, FBR IRIS basics, and getting
  clients on Upwork/LinkedIn).

## Features

- **Roadmap** — a visual, branching track → branch → module → topic map with a
  clear "you are here", next step, and honest progress bar.
- **Topic pages** — plain-language intro, a printable/collapsible cheatsheet,
  your own resource links, real practice, and completion tracking.
- **Assessment engine** — generates randomised, grounded tasks (journal entries,
  trial-balance correction, bank reconciliation, ratios, risk identification,
  audit procedures, technical/HR interview questions, "explain to a client", and
  more). Numeric tasks are **re-checked in code** before serving and on grading;
  feedback includes a point-by-point breakdown, a worked solution, and a
  "next time" tip.
- **Mistake-review log** — every graded attempt, so you can see what went wrong
  and re-attempt weak topics.
- **Bring-your-own-key AI** — pick a provider, paste a key; by default the key
  lives only in your browser and is forwarded per request, never stored on the
  server.

## Tech stack

| Choice | Why |
| --- | --- |
| **Next.js (App Router) + TypeScript** | One framework for UI, routing, and server routes; runs on any Node host. |
| **Neon (serverless Postgres)** | Free tier, pure Postgres, no vendor lock-in. |
| **Drizzle ORM** | TypeScript-first schema with reproducible migrations committed to the repo. |
| **Auth.js (v5) + credentials** | Self-managed auth over Neon — our own roles and first-run admin, no hosted auth product. |
| **shadcn/ui (fully re-themed)** | Accessible primitives, themed so it doesn't read as stock/AI-default. |
| **Self-owned AI adapter layer** | One thin adapter per provider calling its official REST API — dependency-light, host-neutral, no vendor SDK. |

## Local setup

Prerequisites: Node 20+ and a free [Neon](https://neon.tech) database.

1. **Clone and install**

   ```bash
   git clone <your-repo-url>
   cd acca-to-job-ready
   npm install
   ```

2. **Create a Neon database** at [neon.tech](https://neon.tech) and copy the
   pooled connection string.

3. **Configure env** — copy the example and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | What it is |
   | --- | --- |
   | `DATABASE_URL` | Neon pooled connection string (`postgresql://…?sslmode=require`). |
   | `AUTH_SECRET` | Session secret. Generate: `openssl rand -base64 32`. |
   | `AUTH_URL` | App base URL (default `http://localhost:3000`). |
   | `KEY_ENCRYPTION_SECRET` | 32-byte base64 key, only needed if users opt to store their AI key on the server. Generate: `openssl rand -base64 32`. |

4. **Run migrations**

   ```bash
   npm run db:migrate
   ```

5. **Start**

   ```bash
   npm run dev
   ```

6. **First-run admin** — open the app. With an empty users table, every route
   redirects to a one-time "Create administrator account" page. The account you
   create there is the super admin and can manage all other users
   (Settings → Users). That page is permanently disabled afterwards.

7. **Bring an AI key** (optional, only for practice) — Settings → AI provider.
   Pick a provider, paste a key, and test it. By default the key is kept in your
   browser only.

## Editing the curriculum, cheatsheets, and resource slots

No app code needs to change. The curriculum is **committed data** under
`src/curriculum/`:

- `foundation.ts` — the shared foundation modules and topics.
- `tracks.ts` — the two tracks, their branches, modules, and topics.
- `types.ts` — the shape of a topic (intro, cheatsheet blocks, resource slot
  hints, and the practice skill-spec).

Each topic carries its intro, cheatsheet, empty resource-slot hints, and an
optional skill-spec (which drives practice). Edit the data, and the roadmap,
topic pages, and generator pick it up. **No learning-resource URLs are shipped —
resource slots are empty placeholders the user fills in themselves.**

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the provider adapter,
assessment generation + code-validation, and auth/roles fit together, and
[`docs/KNOWN-LIMITATIONS.md`](docs/KNOWN-LIMITATIONS.md) for open items.

## Deploy anywhere (Node host)

This stack runs on any Node host — a VPS, Docker, Railway, Render, Netlify, or
Vercel. Nothing forces a specific host.

**One free path:** a free [Neon](https://neon.tech) database plus a free Node
host. Set the same environment variables from step 3 in the host's dashboard,
point the build at `npm run build` and start at `npm run start`, then run
`npm run db:migrate` once against your production `DATABASE_URL`.

Notes:

- Server routes that call AI providers run on the Node runtime so they can
  forward the user's key per request.
- Neon's free tier scales to zero (a sub-second cold start on the first request)
  and has branch-storage limits — fine for this app. A lightweight keep-alive
  ping is optional and not required.

## License

MIT © Aneeb Baig. See [`LICENSE`](LICENSE).

Screenshots: _add here._
