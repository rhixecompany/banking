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

- **Server Components by default** — `use client` only for interactivity; Server Components run on server with no client JS bundle impact
- **Cache Components** — New `"use cache"` directive for explicit caching of pages, components, and functions; `cacheComponents: true` in `next.config.ts` enables this
- **Turbopack (stable)** — Default bundler for all apps; 2–5× faster production builds, up to 10× faster Fast Refresh
- **Turbopack File System Caching (beta)** — Compiler artifacts cached on disk between runs for faster startup
- **React Compiler Support (stable)** — Built-in integration for automatic memoization
- **Build Adapters API (alpha)** — Custom adapters to modify build process
- **Enhanced Routing** — Optimized navigations with layout deduplication and incremental prefetching
- **Improved Caching APIs** — `updateTag()` and refined `revalidateTag()`; `revalidateTag()` now requires a `cacheLife` profile (e.g., `'max'`, `'hours'`, `'days'`) for SWR behavior
- **`proxy.ts` replaces `middleware.ts`** — Explicit network boundary on Node.js runtime; rename file and export `proxy` function
- **Partial Prerendering (PPR)** — Static layout shell with streamed dynamic content via Suspense boundaries
- **Production Checklist**: Server Components by default, Route Handlers over legacy API routes, Server Actions for mutations, Middleware for auth checks, `revalidate = 60` for ISR, `revalidateTag` for dynamic invalidation

### Drizzle ORM vs Prisma 7 (2026)

| Feature | Drizzle | Prisma 7 |
|---------|---------|----------|
| Schema definition | TypeScript (code-first) | `.prisma` DSL (schema-first) |
| Generation step | None — instant types | `prisma generate` required |
| Bundle size (min+gzip) | ~12.2 KB | ~1.6 MB |
| Cold start | Near-instant | Competitive (Rust removed in v7) |
| Query API style | SQL-like (`select`, `from`, `where`) | Object-based (`findMany`, `include`) |
| Edge runtime support | First-class | Supported (since v7) |
| Migrations | `drizzle-kit generate` + numbered SQL | `prisma migrate dev` + timestamped folders |
| Studio/data browser | Drizzle Studio | Prisma Studio (more polished) |
| TypeScript inference | Instant on save | After `generate` |
| Database support | Postgres, MySQL, SQLite, Turso, D1, Neon, PlanetScale | Postgres, MySQL, SQLite, SQL Server, MongoDB, CockroachDB |
| Maturity | Newer, fast-moving | Mature, larger ecosystem |

**Decision guidance:**
- **Choose Drizzle** if: SQL-comfortable team, serverless/edge deployments, bundle size critical, instant type feedback
- **Choose Prisma** if: Abstraction preferred, broader DB support needed, comprehensive docs/community, migration tooling maturity

**T3 Stack (2026) reference:** Next.js + tRPC v11 + Drizzle + Neon — full type safety from DB to UI

### Plaid: Sandbox vs Production

- **Sandbox** — Free, fully-featured dev environment at `sandbox.plaid.com`; mock data, unlimited test Items; test credentials `user_good` / `pass_good`
- **Sandbox limitations**: Does not reflect institution-specific behaviors/quirks; single generic OAuth flow; no emails/SMS; no OCR/image processing; inconsistent data across products; Transfer product webhooks don't fire
- **Sandbox-only endpoints**: `/sandbox/public_token/create`, `/sandbox/item/reset_login`, `/sandbox/item/fire_webhook`, `/sandbox/transfer/fire_webhook`, `/sandbox/income/fire_webhook`
- **Trial plan (2026)** — Free access to Production with real data for new teams (US/CA only); persists access tokens; counts against Item limits
- **Production** — Requires OAuth redirect URI registration in Dashboard; `https` required for redirect URIs; major institutions (Chase, BoA, Wells Fargo) require Production access for OAuth
- **Migration path**: Sandbox → Trial plan → Production; test with real data before launch
- **Pattern**: Use `/sandbox/public_token/create` to bypass Link in automated tests

### Dwolla: Idempotency & ACH Transfer Patterns

- **Idempotency-Key header** — Unique key per transfer intent prevents duplicate ACH transfers; format: UUID v4 recommended
- **Behavior**: Same key + same body → returns same response (201 Created with same transfer ID); same key + different body → 409 Conflict
- **Concurrency**: If first request in-flight, subsequent requests with same key wait or return 202 Accepted with status polling endpoint
- **Correlation IDs** — Enable multi-leg tracing across 3-step transfer flow (source → Dwolla → destination)
- **DB-level idempotency**: Create `transfer_attempts` table with unique constraint on `(idempotency_key, user_id, amount)`; insert before API call, handle unique constraint violation
- **Webhook handling**: Verify `X-Request-Signature-SHA-256` header; process asynchronously via job queue; idempotent webhook processing with processed event ID tracking

### NextAuth v4 with Drizzle Adapter Patterns

- **Package**: `@auth/drizzle-adapter` (official, part of Better Auth)
- **Installation**: `bun add drizzle-orm @auth/drizzle-adapter` + `bun add -d drizzle-kit`
- **Adapter usage**:
  ```typescript
  import { DrizzleAdapter } from "@auth/drizzle-adapter"
  import { db } from "@/db"
  import { users, accounts, sessions, verificationTokens } from "@/db/schema"
  
  export const authOptions = {
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    // ...
  }
  ```
- **Schema**: Use `pgTable` with proper indexes; include all required columns per adapter spec
- **Custom tables**: Pass `schema` object to `DrizzleAdapter(db, schema)` with custom table references
- **Session strategy**: Database sessions recommended for fintech (revocable, auditable) vs JWT
- **Type safety**: Extend `DefaultSession` in `types/next-auth.d.ts` for custom user fields

### Fintech Security: OWASP Financial Applications Best Practices

**Core principles from OWASP Transaction Authorization, Authentication, and API Security cheat sheets:**

1. **Transaction Authorization**
   - Server-side enforcement of authorization; never trust client
   - Unique authorization credentials per transaction (prevent replay)
   - User must identify/acknowledge significant transaction data
   - Distinguish authentication from transaction authorization flows
   - Prevent brute-force on authorization credentials

2. **Authentication & Session Management**
   - MFA required for all financial operations
   - Short session timeouts (15 min idle, 1 hour absolute)
   - Secure password storage (Argon2id, scrypt, or bcrypt)
   - Rotate credentials quarterly; environment-specific secrets
   - Re-authenticate for sensitive actions (transfers, settings changes)

3. **API Security**
   - Validate all external payloads (Plaid, Dwolla webhooks) with Zod schemas
   - Verify webhook signatures (Plaid `Plaid-Verification`, Dwolla HMAC)
   - Rate-limit sensitive endpoints (Middleware or Upstash Redis)
   - BOLA prevention: validate resource ownership on every request
   - TLS 1.2+ everywhere; HSTS, CSP headers

4. **Audit Logging & Data Integrity**
   - Append-only audit table for all financial events (immutable)
   - Log: user_id, action, amount, source/dest accounts, timestamp, IP, user-agent
   - Never log PII, credentials, or full account numbers
   - Cryptographic integrity (hash chains or signed logs)

5. **Input Validation & Injection Prevention**
   - Zod validation before any Drizzle write; use `drizzle-zod` for schema generation
   - Parameterized queries only (Drizzle default); no raw SQL interpolation
   - Reject unexpected fields; allowlist approach

6. **Secrets Management**
   - Separate `.env` per environment; never commit
   - Rotate Plaid/Dwolla/NextAuth secrets quarterly
   - Server-only imports for sensitive keys (no `NEXT_PUBLIC_` prefix)

### Bun Package Manager vs npm/pnpm Performance (2026)

| Metric | npm | pnpm | Yarn Berry | Bun |
|--------|-----|------|------------|-----|
| Fresh install speed | Baseline | ~2× faster | Similar to npm | **20–30× faster** |
| Disk usage | High | Minimal (hard links) | Low (PnP) | Standard |
| Lockfile | `package-lock.json` | `pnpm-lock.yaml` | `yarn.lock` + `.pnp.cjs` | `bun.lockb` (binary) |
| Monorepo support | Workspaces | First-class workspaces | Advanced workspaces | Basic workspaces |
| Node.js compatibility | Native | High | PnP issues | High (npm-compatible) |
| Runtime | Node.js | Node.js | Node.js | **Bun runtime (Zig)** |
| Cache | Disk | Content-addressable | Zip-based | Binary high-perf |
| Offline support | Good | Strong | Excellent (zero-installs) | Good |
| Maturity | Highest | High | High | **Production-ready 2026** |

**Key tradeoffs:**
- **Bun**: Raw speed, all-in-one runtime, drop-in npm replacement; binary lockfile not human-readable
- **pnpm**: Best balance of speed, correctness, monorepo tooling; strict node_modules prevents phantom deps
- **Yarn Berry**: Reproducibility via PnP, zero-installs; IDE/plugin compatibility friction
- **npm**: Universal compatibility, largest ecosystem; slower, disk-heavy

**For Banking project (Bun + Next.js 16)**: Excellent fit — Bun's native TypeScript, fast installs, and Turbopack alignment reduce CI/CD times significantly

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| Next.js 16 | <https://nextjs.org/docs/app> | Docs |
| Next.js 16 Production | <https://nextjs.org/docs/app/guides/production-checklist> | Guide |
| Next.js 16 Release | <https://nextjs.org/blog/next-16> | Blog |
| Drizzle ORM | <https://orm.drizzle.dev> | Docs |
| Drizzle vs Prisma | <https://makerkit.dev/blog/tutorials/drizzle-vs-prisma> | Guide |
| Plaid Docs | <https://plaid.com/docs> | Docs |
| Plaid Sandbox | <https://plaid.com/docs/sandbox> | Guide |
| Dwolla API | <https://developers.dwolla.com/docs> | Docs |
| Dwolla Idempotency | <https://developers.dwolla.com/docs/api-reference/api-fundamentals/idempotency-key> | Guide |
| NextAuth v4 | <https://next-auth.js.org> | Docs |
| Auth.js Drizzle Adapter | <https://authjs.dev/reference/drizzle-adapter> | Docs |
| OWASP Transaction Auth | <https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html> | Cheat Sheet |
| OWASP Authentication | <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> | Cheat Sheet |
| OWASP API Security | <https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html> | Cheat Sheet |
| OWASP Business Logic | <https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html> | Cheat Sheet |
| Bun vs pnpm vs npm | <https://betterstack.com/community/guides/scaling-nodejs/pnpm-vs-bun-install-vs-yarn> | Guide |
| Bun Package Manager | <https://bun.sh/docs/cli/install> | Docs |

---

## Best Practices

1. **Server Components by default** — `use client` only for interactivity
2. **Idempotency-first transfers** — key-per-intent with DB unique constraint
3. **Schema by bounded context** — `accounts/`, `transfers/`, `audit/` folders
4. **Validate all payloads with Zod** — before Drizzle writes; use `drizzle-zod`
5. **Credentials never shared** — separate keys per environment; rotate quarterly
6. **Turbopack + Cache Components** — enable `cacheComponents: true` in `next.config.ts`
7. **Proxy.ts for auth** — Edge-compatible session validation in `proxy.ts`
8. **Background jobs for webhooks** — queue via job system, not inline
9. **Partial Prerendering** — static layout shell; stream live data on request
10. **Drizzle `.with()` for relations** — avoid N+1 on joins

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Assuming Sandbox = Production | OAuth failures in prod | Test in Production Trial plan |
| Missing idempotency keys | Duplicate ACH transfers | `transfer_attempts` table with unique constraint |
| Provider secrets in client code | Credential leakage | Server-only import pattern |
| Connection pool exhaustion | Latency spikes, 500s | Singleton Drizzle client; pooled connection string |
| No webhook signature verification | Fraudulent callbacks | Verify Plaid `Plaid-Verification` / Dwolla HMAC |
| JWT sessions for banking | Irrevocable tokens | Database sessions with revocation |
| Raw SQL interpolation | SQL injection | Drizzle parameterized queries only |
| Missing audit logging | Compliance failure | Append-only immutable audit table |

---

## Performance

1. **Server Components for dashboard** — server-side render with `revalidate` caching
2. **Drizzle `.with()` for relations** — avoid N+1 on joins
3. **Background jobs for webhooks** — queue via job system, not inline
4. **Edge Middleware for auth** — low-latency session check, no cold start
5. **Partial Prerendering** — static layout shell; stream live data on request
6. **Turbopack File System Caching** — faster dev/compile across restarts
7. **React Compiler** — automatic memoization reduces re-renders
8. **Bun install in CI** — 20–30× faster dependency installation

---

## Security

1. **Validate external payloads with Zod** — reject malformed Plaid/Dwolla data
2. **Verify webhook signatures** — Plaid `Plaid-Verification` header; Dwolla HMAC token
3. **Append-only audit logging** — immutable table for all financial events
4. **Rate-limit sensitive endpoints** — Middleware or Upstash Redis
5. **Rotate credentials quarterly** — environment-specific `.env` files
6. **MFA for all financial operations** — TOTP/WebAuthn via NextAuth
7. **Short session timeouts** — 15 min idle, 1 hour absolute
8. **BOLA prevention** — validate resource ownership on every request
9. **TLS 1.2+ everywhere** — HSTS, CSP, secure headers
10. **Secrets in server-only modules** — no `NEXT_PUBLIC_` for API keys

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
| Next.js Docs | <https://nextjs.org/docs> | Framework docs |
| Drizzle ORM | <https://orm.drizzle.dev> | TypeScript ORM docs |
| Plaid Docs | <https://plaid.com/docs> | Banking API docs |
| Dwolla API | <https://developers.dwolla.com/docs> | ACH transfer API docs |
| NextAuth v4 | <https://next-auth.js.org> | Auth framework |
| OWASP Transaction Auth | <https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html> | Fintech security |
| OWASP Auth | <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html> | Auth best practices |
| OWASP API Security | <https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html> | API security |
| OWASP Business Logic | <https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html> | Business logic flaws |
| Bun Package Manager | <https://bun.sh/docs/cli/install> | Fast package manager |
| MakerKit Drizzle vs Prisma | <https://makerkit.dev/blog/tutorials/drizzle-vs-prisma> | ORM comparison |

---

*Updated: 2026-07-10 | Research pipeline: web-research-pipeline v2.0*