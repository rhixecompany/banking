# RESEARCH_REPORT.md

## Project: Banking

**Type:** Fintech (Next.js 16 + banking integrations)
**Tech Stack:** Next.js 16, TypeScript, PostgreSQL, Drizzle ORM, NextAuth v4, Plaid, Dwolla, shadcn/ui, Tailwind CSS, Bun
**Status:** Active

---

## Similar Projects

| Project | URL | Why Relevant |
|---------|-----|--------------|
| comicwise | `projects/comicwise` | shared Next.js + auth + payment flows |
| rhixe_scans | `projects/rhixe_scans` | shared Next.js + auth + media payments |
| rhixecompany-comics | `projects/rhixecompany-comics` | shared PostgreSQL + Drizzle + Next.js |
| university-libary-jsm | `projects/university-libary-jsm` | shared Next.js + Drizzle + Neon + auth |

---

## Key Findings

### Next.js 16 Production Best Practices (2026)
- Use Server Components by default; `"use client"` only for interactivity
- Route Handlers over legacy API routes; Caching with `fetch(..., {cache: 'force-cache'})`
- Server Actions for mutations; Middleware for auth checks
- `revalidate = 60` for ISR; `revalidateTag` for dynamic invalidation
- Next.js 16 with Turbopack ~400% faster dev vs webpack

### Drizzle vs Prisma 7 (2026)
- Drizzle: ~12KB bundle, zero deps, no generate step, code-first TypeScript schema
- Prisma 7: Rust engine removed, ~1.6MB bundle, 3x faster queries, `prisma.config.ts`
- T3 Stack (2026): Next.js + tRPC v11 + Drizzle + Neon — full type safety from DB to UI
- Choice depends on team SQL comfort and deployment environment

### Plaid: Sandbox vs Production
- Sandbox uses mock data — not a preview of Production behavior
- Trial plan available (2026) for testing with real data pre-Production
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
| Drizzle vs Prisma | https://makerkit.dev/blog/tutorials/drizzle-vs-prisma | Guide |

---

## Best Practices

1. **Server Components by default** — `"use client"` only for interactivity
2. **Idempotency-first transfers** — key-per-intent with DB unique constraint
3. **Schema by bounded context** — `accounts/`, `transfers/`, `audit/` folders
4. **Validate all payloads with Zod** — before Drizzle writes; use drizzle-zod
5. **Credentials never shared** — separate keys per environment; rotate quarterly

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Assuming Sandbox = Production | OAuth failures in prod | Test in Production Trial plan |
| Missing idempotency keys | Duplicate ACH transfers | `transfer_attempts` table with unique constraint |
| Provider secrets in client code | Credential leakage | Server-only import pattern |
| Connection pool exhaustion | Latency spikes, 500s | Singleton Drizzle client; pooled connection string |

---

## Performance

1. **Server Components for dashboard** — server-side render with `revalidate` caching
2. **Drizzle `.with()` for relations** — avoid N+1 on joins
3. **Background jobs for webhooks** — queue via job system, not inline
4. **Edge Middleware for auth** — low-latency session check, no cold start
5. **Partial Prerendering** — static layout shell; stream live data on request

---

## Security

1. **Validate external payloads with Zod** — reject malformed Plaid/Dwolla data
2. **Verify webhook signatures** — Plaid `Plaid-Verification` header; Dwolla token
3. **Append-only audit logging** — immutable table for all financial events
4. **Rate-limit sensitive endpoints** — Middleware or Upstash Redis
5. **Rotate credentials quarterly** — environment-specific .env files

---

## Related Projects (in workspace)

- **comicwise** — shared Next.js + Stripe payment flows
- **rhixe_scans** — shared Next.js + auth; dual payment provider architecture
- **rhixecompany-comics** — PostgreSQL + Drizzle + Next.js conventions
- **university-libary-jsm** — Next.js + Drizzle + Neon reference

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
