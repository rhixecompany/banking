# RESEARCH_REPORT.md

## Project: Banking

**Type:** Fintech (Next.js 16 + banking integrations)
|**Tech Stack:** Next.js 16.2, TS, PostgreSQL, Drizzle ORM, NextAuth v4, Plaid, Dwolla, shadcn/ui, Tailwind 4, Bun
**Status:** Active

---

## Similar Projects

| Project | Relevance |
|---------|-----------|
| comicwise | Shared Next.js + auth + payment flows |
| rhixe_scans | Shared Next.js + auth + media payments |
| rhixecompany-comics | Shared PostgreSQL + Drizzle + Next.js conventions |
| university-libary-jsm | Shared Next.js + Drizzle ORM + Neon serverless patterns |

---

## Key Findings

### Next.js 16.2 (March 2026)
- **Turbopack default** — ~400% faster dev startup, ~50% faster rendering vs 16.0
- **`proxy.ts` replaces `middleware.ts`** — explicit network boundary for auth/redirects
- **Build Adapters API stable** — OpenNext, AWS Amplify, Cloudflare support `proxy.ts`
- **`"use cache"` directive** — explicit granular control; `revalidateTag('key', 'max')` in 16.2
- **Partial Prerendering (PPR)** — static shell + streamed dynamic content

### Drizzle ORM 0.45 Production Patterns
- **~55KB bundle** vs Prisma 7's ~1.6MB — critical for serverless cold starts
- **Prepared statements** — `db.select().prepare("name")` precompiles SQL for hot paths
- **Driver selection** — `neon-http` for edge, `node-postgres` for traditional servers
- **Migration audit** — review generated SQL; `strict: true` catches column renames
- **Never `db push` in production** — use `generate` + `migrate` for audit trail

### Plaid + Dwolla 2026 Patterns
- **Dedicated service layer** — single boundary for token exchange, webhook handling
- **Event-driven pipeline** — webhooks feed background workers; reconciliation jobs catch silent failures
- **Idempotency** — `Idempotency-Key` header + DB constraint prevents duplicate ACH transfers

---

## Cheatsheets

| Topic | Resource |
|-------|----------|
| Next.js 16 Production Checklist | <https://nextjs.org/docs/app/guides/production-checklist> |
| Drizzle ORM | <https://orm.drizzle.dev> |
| Plaid/Dwolla | <https://plaid.com/docs> |

---

## Best Practices

1. **Server Components by default** — `use client` only for interactive UI elements
2. **Idempotency-first transfers** — unique key per intent + DB constraint on `transfer_attempts`
3. **Validate all payloads with Zod** — `drizzle-zod` for schema-derived validators
4. **Rotate secrets quarterly** — Plaid/Dwolla/NextAuth per environment
5. **Database sessions for fintech auth** — revocable, auditable; not JWT for banking

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Assuming Sandbox = Production | OAuth failures in prod | Test in Production Trial plan |
| Missing idempotency keys | Duplicate ACH transfers | `transfer_attempts` table + unique constraint |
| No webhook signature verification | Fraudulent callbacks | Verify Plaid/Dwolla signatures |
| JWT sessions for banking | Irrevocable tokens | Database sessions with revocation |
| `db push` in production | Lost migration audit trail | Use `generate` + `migrate` only |

---

## Performance

1. **Server Components for dashboard** — server-side render with `revalidate` caching
2. **Drizzle prepared statements** — precompile, reduce per-call parsing overhead
3. **Edge `proxy.ts` for auth** — low-latency, no cold start
4. **Partial Prerendering** — static shell + streamed dynamic financial data
5. **Bun install in CI** — 20–30× faster
6. **Upstash Redis** — sub-ms lookup for sessions and rate limiting

---

## Security

1. **Validate external payloads with Zod** — reject malformed Plaid/Dwolla data
2. **Verify webhook signatures** — Plaid `Plaid-Verification` header; Dwolla HMAC
3. **Append-only audit logging** — immutable table for financial events
4. **Rate-limit sensitive endpoints** — Upstash Redis sliding window (auth: 5 req/15min)
5. **MFA for financial ops** — TOTP/WebAuthn via NextAuth; upgrade to 16.2.6+ for 13 security patches

---

## Related Projects (in workspace)

- **comicwise** — shared Next.js + Stripe payment flows; concurrent Drizzle+Prisma migration patterns
- **rhixe_scans** — shared Next.js + auth; dual payment provider architecture (Stripe+PayPal)
- **rhixecompany-comics** — PostgreSQL + Drizzle + Next.js conventions; dual-stack Django reference
- **university-libary-jsm** — Next.js + Drizzle ORM + Neon serverless reference

---

## Resources

| Resource | URL |
|----------|-----|
| Next.js Docs | <https://nextjs.org/docs> |
| Drizzle ORM | <https://orm.drizzle.dev> |
| Plaid API | <https://plaid.com/docs> |
| Dwolla API | <https://developers.dwolla.com/docs> |
| OWASP Security | <https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html> |
| Next.js 16.2 Security | <https://vercel.com/changelog/next-js-may-2026-security-release> |

### Research Methodology
- **Web search:** Tavily (2026 Next.js 16, Drizzle, Plaid/Dwolla)
- **Last verified:** 2026-07-28
