# RESEARCH_REPORT.md

<!-- Template version: 1.0.0 — maintained by repo-research-pipeline skill -->

## Project: Banking

**Type:** Fintech (Next.js 16 + banking integrations)
**Tech Stack:** Next.js 16, TypeScript, PostgreSQL, Drizzle ORM, NextAuth v4, Plaid, Dwolla, shadcn/ui, Tailwind CSS, Bun
**Status:** Active

---

## Similar Projects

| Project | URL | Why Relevant |
|---------|-----|--------------|
| comicwise | `projects/comicwise` | Same Next.js + shadcn/ui + payment patterns |
| rhixe_scans | `projects/rhixe_scans` | Shared Next.js + auth + media-payment concerns |
| rhixecompany-comics | `projects/rhixecompany-comics` | Shared PostgreSQL + Drizzle + Next.js conventions |
| university-libary-jsm | `projects/university-libary-jsm` | Next.js 16 + Drizzle + PostgreSQL + auth patterns |

---

## Key Findings

### Next.js 16 + Fintech (2026)
- Partial Prerendering (PPR) statically pre-renders shell while streaming dynamic content on request
- Turbopack default bundler with ~400% faster dev; Server Actions stable for mutations
- Edge Middleware enables low-latency auth checks before page render

### Drizzle ORM (2026)
- Code-first TypeScript schema; ~7KB bundle vs Prisma's ~1.6MB
- ~900K weekly npm downloads; runs on Cloudflare Workers, Vercel Edge, Bun, Deno
- `drizzle-kit generate`+`migrate` for production; `push` for dev; drizzle-zod for runtime validation

### Plaid: Sandbox vs Production
- Sandbox uses mock data — not a preview of Production
- Trial plan now available (US/CA, Apr 2026) for testing with real data pre-Production
- OAuth redirect URIs must be registered in Production Dashboard

### Dwolla: Idempotency & ACH
- Unique idempotency key per transfer intent prevents duplicate ACH transfers
- Correlation IDs enable multi-leg tracing across the 3-step transfer flow
- `transfer_attempts` table with unique constraint for DB-level idempotency

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| Next.js 16 | https://nextjs.org/docs/app | Docs |
| Drizzle ORM | https://orm.drizzle.dev | Docs |
| Plaid Docs | https://plaid.com/docs | Docs |
| Dwolla API | https://developers.dwolla.com/docs | Docs |
| NextAuth v4 | https://next-auth.js.org | Docs |

---

## Best Practices

1. **Server Components by default** — `'use client'` only for interactivity
2. **Idempotency-first transfers** — key-per-intent with DB unique constraint
3. **Schema by bounded context** — `accounts/`, `transfers/`, `audit/` folders
4. **Validate all payloads with Zod** — before Drizzle writes; use drizzle-zod
5. **Credentials never shared** — separate keys per environment; rotate quarterly

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Assuming Sandbox = Production | OAuth failures in production | Test in Production Trial plan before launch |
| Missing idempotency keys | Duplicate ACH transfers, double charges | `transfer_attempts` table with unique constraint |
| Provider secrets in client code | Credential leakage | Server-only import pattern for all keys |
| Connection pool exhaustion | Latency spikes, 500s | Singleton Drizzle client; pooled connection string |

---

## Performance

1. **Server Components for dashboard** — server-side render with `revalidate` caching
2. **Drizzle `.with()` for relations** — avoid N+1 on account→transactions joins
3. **Background jobs for webhook processing** — queue via job system, not inline
4. **Edge Middleware for auth** — low-latency session check, no cold start
5. **Partial Prerendering** — static layout shell; stream live data on request

---

## Security

1. **Validate external payloads with Zod** — reject malformed Plaid/Dwolla data
2. **Verify webhook signatures** — Plaid `Plaid-Verification` header; Dwolla token
3. **Append-only audit logging** — immutable table for all financial events
4. **Rate-limit sensitive endpoints** — via Middleware or Upstash Redis
5. **Rotate credentials quarterly** — use environment-specific .env files

---

## Related Projects (in workspace)

- **comicwise** — Shared Next.js + auth + payment flows; Stripe subscriptions
- **rhixe_scans** — Shared Next.js + auth; dual payment provider architecture
- **rhixecompany-comics** — PostgreSQL + Drizzle conventions
- **university-libary-jsm** — Next.js 16 + Drizzle + Neon reference

---

## Resources

| Resource | URL | Description |
|----------|-----|-------------|
| Next.js Docs | https://nextjs.org/docs | Framework docs |
| Drizzle ORM | https://orm.drizzle.dev | TypeScript ORM docs |
| Plaid Docs | https://plaid.com/docs | Banking API docs |
| Dwolla API | https://developers.dwolla.com/docs | ACH transfer API docs |
| NextAuth v4 | https://next-auth.js.org | Auth framework |
| OWASP Finance | https://cheatsheetseries.owasp.org/cheatsheets/Financial_Applications_Cheat_Sheet.html | Fintech security |
