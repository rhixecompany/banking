# RESEARCH_REPORT.md

## Project: Banking

**Type:** Fintech (Next.js 16 + banking integrations)
**Tech Stack:** Next.js 16, TypeScript, PostgreSQL, Drizzle ORM, NextAuth v4, Plaid, Dwolla, shadcn/ui, Tailwind CSS, Bun
**Status:** Active

---

## Similar Projects

| Project | Relevance |
|---------|-----------|
| comicwise | Shared Next.js + auth + payment flows |
| rhixe_scans | Shared Next.js + auth + media payments |
| rhixecompany-comics | Shared PostgreSQL + Drizzle + Next.js |
| university-libary-jsm | Shared Next.js + Drizzle + Neon + auth |

---

## Key Findings

### Next.js 16 Production Best Practices (2026)
- **Server Components by default** — `use client` only for interactivity
- **`proxy.ts` replaces `middleware.ts`** — explicit network boundary
- **Cache Components** — `"use cache"` directive; `cacheComponents: true`
- **Turbopack (stable)** — 2–5× faster builds, 10× faster Fast Refresh
- **Partial Prerendering (PPR)** — static shell + streamed dynamic content
- **Production checklist**: Server Components, Route Handlers, Server Actions

### Drizzle ORM Key Advantages
- **~12 KB bundle** vs Prisma 7's ~1.6 MB — critical for serverless/edge deployments
- **Code-first TypeScript schema** — instant type inference, no codegen step
- **SQL-like query API** (`select`, `from`, `where`) — familiar to SQL-comfortable teams
- **First-class edge support** — works with Neon HTTP, Turso, D1 drivers
- **Drizzle Kit** migrations produce plain SQL files — transparent and portable

### Plaid + Dwolla Integration Patterns
- **Plaid Sandbox → Production Trial → Production** — never skip the Trial plan
- **Dwolla idempotency** — `Idempotency-Key` header + DB constraint prevents duplicates
- **Webhook verification** — Plaid `Plaid-Verification` header; Dwolla HMAC
- **Webhook offloading** — process callbacks via job queue, not inline

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| Next.js 16 | <https://nextjs.org/docs/app/guides/production-checklist> | Guide |
| Drizzle ORM | <https://orm.drizzle.dev> | Docs |
| Plaid/Dwolla API | <https://plaid.com/docs> | Docs |
| OWASP Fintech Security | <https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html> | Cheat Sheet |

---

## Best Practices

1. **Server Components by default** — `use client` only for interactive UI elements
2. **Idempotency-first transfers** — unique key per intent with DB constraint
3. **Validate all payloads with Zod** — before writes; use `drizzle-zod`
4. **Separate env per environment** — rotate Plaid/Dwolla/NextAuth secrets quarterly
5. **Database sessions for auth** — revocable, auditable; not JWT for fintech

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Assuming Sandbox = Production | OAuth failures in prod | Test in Production Trial plan |
| Missing idempotency keys | Duplicate ACH transfers | `transfer_attempts` table with unique constraint |
| No webhook signature verification | Fraudulent callbacks | Verify Plaid/Dwolla signatures |
| JWT sessions for banking | Irrevocable tokens | Database sessions with revocation |

---

## Performance

1. **Server Components for dashboard** — server-side render with `revalidate` caching
2. **Drizzle `.with()` for relations** — avoid N+1 on joined queries
3. **Edge proxy.ts for auth** — low-latency session validation, no cold start
4. **Partial Prerendering** — static shell + streamed dynamic data
5. **Bun install in CI** — 20–30× faster dependency installation vs npm

---

## Security

1. **Validate external payloads with Zod** — reject malformed Plaid/Dwolla data
2. **Verify webhook signatures** — Plaid `Plaid-Verification` header; Dwolla HMAC
3. **Append-only audit logging** — immutable table for financial events
4. **Rate-limit sensitive endpoints** — Upstash Redis or proxy.ts
5. **MFA for all financial operations** — TOTP/WebAuthn via NextAuth

---

## Related Projects (in workspace)

- **comicwise** — shared Next.js + Stripe payment flows
- **rhixe_scans** — shared Next.js + auth; dual payment provider architecture
- **rhixecompany-comics** — PostgreSQL + Drizzle + Next.js conventions
- **university-libary-jsm** — Next.js + Drizzle + Neon reference
- **profile** — shared Django conventions

---

## Resources

| Resource | URL |
|----------|-----|
| Next.js Docs | <https://nextjs.org/docs> |
| Drizzle ORM | <https://orm.drizzle.dev> |
| Plaid API | <https://plaid.com/docs> |
| Dwolla API | <https://developers.dwolla.com/docs> |
| OWASP Security | <https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html> |

### Research Methodology
- **Web search:** web_search / web-research-pipeline
- **Documentation:** web_extract
- **Framework docs:** Next.js docs, Drizzle ORM docs, Plaid/Dwolla API docs
- **Last verified:** 2026-07-16
