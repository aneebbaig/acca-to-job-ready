# Contributing

Thanks for your interest. This project is open-source and portfolio-grade;
contributions that keep it clean and honest are welcome.

## Getting set up

See the **Local setup** section of the [README](README.md). You'll need Node
20+, a free Neon database, and (only for practice) an AI provider key.

## Ground rules

- **Content accuracy.** Don't add ACCA syllabus specifics, standard reference
  numbers, materiality/tax rates, fees, or pass rates as fact. Link to the
  official source (ACCA, FBR) or mark it "verify". Practice numbers may be
  invented, but must be internally consistent.
- **No fabricated resource URLs.** Resource slots stay empty placeholders.
- **Curriculum is data, not markup.** Edit `src/curriculum/*`, never hardcode
  content into components.
- **Per-user data isolation.** Every query must be scoped to the authenticated
  user with an explicit ownership check.
- **No personal data in source.** Don't hardcode any individual's name, photo,
  or details. The personalized welcome is a per-user value set after install.
- **Keys are never persisted or logged** unless a user explicitly opts into
  encrypted-at-rest storage.

## Workflow

The protected branches (`main`, `develop`, `production`) accept **no direct
pushes**, everything goes through a pull request that CI must pass.

1. Branch off `develop` (e.g. `feat/glossary`).
2. Keep changes focused; match the surrounding code's style.
3. Before opening a PR, run:

   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```

4. Use [Conventional Commits](https://www.conventionalcommits.org) (`feat:`,
   `fix:`, `chore:`, `docs:`), `release-please` relies on them for versioning.
5. Open a PR into `develop`. CI (lint + type-check + build) must be green before
   it can merge.

## Good first tasks

The best contribution right now is a **domain-expert review of the curriculum**
(see [`docs/KNOWN-LIMITATIONS.md`](docs/KNOWN-LIMITATIONS.md)). Adding
skill-specs to topics that lack practice, and building the fast-follow features
listed there, are also high-value.
