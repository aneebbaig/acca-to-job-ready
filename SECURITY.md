# Security Policy

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Report privately via
GitHub's [security advisories](https://github.com/aneebbaig/acca-to-job-ready/security/advisories/new).
You'll get an acknowledgement, and a fix or mitigation plan once the report is
triaged.

## Scope worth flagging

This app handles authentication and users' own AI API keys, so the sensitive
areas are:

- **Auth & sessions** — password hashing (argon2id), session cookies, CSRF,
  login rate-limiting, user enumeration.
- **Per-user data isolation** — every query is scoped to the authenticated user;
  a way to read or modify another user's data is a valid report.
- **API key handling** — by default a user's AI key is stored only in their
  browser and forwarded per request; it must never be logged, persisted, or
  exposed to other users. Opt-in server storage is AES-256-GCM encrypted.

## Good practice for deployers

- Set a strong random `AUTH_SECRET` and `KEY_ENCRYPTION_SECRET`.
- Never commit `.env.local`. Only `.env.example` (placeholders) is tracked.
- Keep dependencies current (Dependabot PRs are enabled).
