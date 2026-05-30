# Security Audit — South Calling Festival

Date: 2026-05-30
Scope: Express API (`server.js`, `routes/`), config, static assets, repository hygiene.

## Summary

A full hardening pass was completed. Rate limiting, input validation/sanitisation,
payload limits, security headers, CORS lockdown, and dashboard authentication were
added. Repository secret hygiene was fixed. **Two manual follow-ups remain** (see
"Residual risks").

All controls were verified live (see "Verification").

---

## Findings & status

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | High | logo.dev API token hardcoded in `.claude/settings.local.json`, which was **tracked in Git** | Fixed — redacted, untracked, gitignored. **Rotate the key** (still in git history). |
| 2 | High | No `.gitignore`; `node_modules` (3626 files), `dist`, and local settings were tracked | Fixed — `.gitignore` added; all three untracked via `git rm --cached`. |
| 3 | High | No rate limiting on any endpoint | Fixed — global 300/15min per IP + strict **5/15min per IP** on each write endpoint. |
| 4 | Medium | No request body size limit; malformed JSON crashed/echoed | Fixed — 10 KB cap (`413`), malformed JSON → `400`, central error handler. |
| 5 | Medium | Weak/partial input validation (e.g. `email.includes('@')`) | Fixed — typed validation, length caps, control-char stripping, enum/date checks, non-object bodies rejected. |
| 6 | Medium | CORS open to all origins (`cors()`) | Fixed — same-origin by default; cross-origin only via `CORS_ORIGINS`. |
| 7 | Medium | `/dashboard` + `/api/analytics/{stats,daily}` exposed analytics with no auth | Fixed — gated behind `DASHBOARD_TOKEN`. **Set it in production.** |
| 8 | Low | Missing security headers; `X-Powered-By` leaked framework | Fixed — CSP, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, COOP, Permissions-Policy; `x-powered-by` disabled. |
| 9 | Low | Dashboard used inline `<script>`/`onclick` (forces weak CSP) | Fixed — moved to `/dashboard.js`; CSP `script-src 'self'`. |
| 10 | Info | `nodemailer` installed but unused | No SMTP credentials in code. Placeholders added to `.env.example` if wired later. |
| 11 | Info | Data stores (subscribers/messages/orders/analytics) are in-memory | Not persisted; lost on restart. No DB credentials to leak. Move to a DB (creds in env) if persistence is needed. |

## Secret scan result

Full scan of the working tree (excluding `node_modules`) for keys/tokens/passwords/SMTP:
- **Only one** real secret found: the logo.dev publishable token `pk_…` in `.claude/settings.local.json`
  (two historical one-off `curl` commands used to download partner logos).
- **Not** present in the frontend bundle, server code, or `data/`.
- The partner logos are already saved as static files, so the token is not needed at runtime.

## What changed

New:
- `.gitignore`, `.env.example`
- `config/env.js` — minimal `.env` loader (no dependency)
- `middleware/rateLimit.js` — in-memory per-IP limiter
- `middleware/validate.js` — sanitisers (string/email/date/enum, object guard)
- `middleware/security.js` — security headers + `DASHBOARD_TOKEN` gate
- `public/dashboard.js` — externalised dashboard script
- `SECURITY.md` — this report

Updated:
- `server.js` — env loader, trust-proxy guard, security headers, CORS allowlist, 10 KB body cap,
  global rate limit, gated dashboard, central error handler, `x-powered-by` disabled.
- `routes/api.js` — strict per-endpoint limiters + full input sanitisation on newsletter/contact/order.
- `routes/analytics.js` — validated `/track`; gated `/stats` and `/daily`.
- `public/dashboard.html` — removed inline script/`onclick`; loads `/dashboard.js`; forwards token.
- `.claude/settings.local.json` — token redacted.

## Configuration (production)

Create `.env` (gitignored) from `.env.example` and set:
- `DASHBOARD_TOKEN` — long random value (protects `/dashboard` + analytics reads).
- `CORS_ORIGINS` — your real origin(s), comma-separated, only if cross-origin is needed.
- `TRUST_PROXY=1` — only if behind a proxy/load balancer you control.
- Terminate TLS at your proxy/host and enable HSTS there.

## Verification (all passed)

- Security headers present on every response (CSP, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`); `X-Powered-By` absent.
- Malformed JSON → `400`; body > 10 KB → `413`.
- Missing/invalid email → `400`.
- 6 rapid `POST /api/contact`: first 5 → `200`, 6th → `429` (`Retry-After` set).
- With `DASHBOARD_TOKEN` set: analytics read & `/dashboard.html` → `401` without token, `200` with token.

## Residual risks — manual action required

1. **Rotate the logo.dev key.** Redaction does not remove it from existing Git history.
   If the repo was ever pushed, also scrub history (BFG / `git filter-repo`) or consider the key burned.
   (It is a publishable `pk_` key — low impact — but rotate regardless.)
2. **Set `DASHBOARD_TOKEN` in production.** Until set, the analytics dashboard and read endpoints stay public.
