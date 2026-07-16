# RESEARCH_REPORT.md

## Project: Banking
**Tech Stack:** Next.js 16, TS strict, PostgreSQL, Drizzle ORM, Plaid, Dwolla, Bun, Docker, Redis/Upstash, Tailwind CSS
**Status:** Active

## Similar Projects
| Project | URL | Stack |
|---------|-----|-------|
| Konstantilieris/banking | github.com/Konstantilieris/banking | Next.js 14 + Plaid + Dwolla, ~50★ |
| abdelmawla2350/NuBank | github.com/abdelmawla2350/NuBank | Next.js 15 + Plaid + Dwolla, ~30★ |
| Hayden-git/Banking_App | github.com/Hayden-git/Banking_App | Next.js + ShadCN + Plaid + Dwolla, ~20★ |

## Key Findings

### Plaid + Dwolla Integration
- Formal partnership: Plaid Link → processor token → Dwolla funding source → ACH/RTP
- Processor token is security boundary — Dwolla never sees raw account numbers
- Idempotency-Key header prevents duplicate transfers
- Webhooks: HMAC validation (SHA-256), idempotent processing, queue async
- Auto-pauses after 400 consecutive failures — monitor the threshold

### Next.js 16 App Router
- Turbopack is the default bundler in Next.js 16 — 2-5× faster production builds, up to 10× faster Fast Refresh (zero config)
- New caching APIs: `revalidateTag()`, `updateTag()`, `refresh()` replace brittle ISR; `cacheComponents` opts into PPR
- `taint()` API prevents accidentally passing server-only secrets into Client Components

### Drizzle ORM + PostgreSQL
- Use `decimal(12,2)` for money — never `float` (precision loss)
- UUID primary keys (gen_random_uuid or uuidv7 for time-ordered)
- Composite indexes on `(userId, createdAt)` for transaction queries
- Migration: generate → push (dev) → migrate (prod) via `bunx drizzle-kit`

### Bun Runtime
- ~4× HTTP vs Node 22+ (52K vs 13K req/s); installs 10-25× faster
- Compatible: Drizzle ORM, Express, Fastify, Hono
- Incompatible: native addons (bcrypt → bcryptjs, sharp → jimp)
- ~95% Node.js compat — test staging before production

### Redis for Fintech
- "Redis is accelerator, not source of truth" — Postgres is durable fallback
- Upstash Redis for serverless: HTTP-based, global replication, no cold starts
- Sliding window rate limiting; server-side sessions for instant revocation
- TTLs: balances 30-60s, transactions 5-15 min, OTP codes 5-10 min

### TypeScript Patterns
- Never `number` for money — string Money type or cents-based integers
- Branded types prevent ID confusion
- Discriminated unions for TransactionStatus states

## Cheatsheets & Quick Reference
| Topic | Resource |
|-------|----------|
| Plaid-Dwolla | plaid.com/docs/auth/partnerships/dwolla |
| Dwolla webhooks | developers.dwolla.com/docs/connect/working-with-webhooks |
| Drizzle ORM | orm.drizzle.team/docs/sql-schema-declaration |
| Bun production | pkgpulse.com/guides/bun-in-production-performance-gotchas |
| Redis rate limit | redis.io/glossary/rate-limiting |
| Next.js 16 | nextjs.org/blog/next-16 | Next 16 release & Turbopack |

## Best Practices
1. **Server Actions** — Banking ops via Next.js Server Actions, not REST
2. **Idempotency keys** — Prevent duplicate charges
3. **Processor token boundary** — Plaid handles auth; Dwolla never sees raw credentials
4. **Decimal for money** — `decimal(12,2)` in Postgres; never float or JS number
5. **Redis sessions** — Enable instant revocation for compromised accounts
6. **Docker multi-stage** — Deps/build/runner; standalone output; non-root user
7. **Zod validation** — Validate all Plaid/Dwolla responses at runtime
8. **Domain action files** — Separate files: bank, user, dwolla, transaction

## Common Pitfalls
| Pitfall | Impact | Fix |
|---------|--------|-----|
| Link token expires | Bank linking fails | Fresh token per session |
| Webhook auto-pause at 400 | Missed transfer updates | Monitor threshold |
| ACH 2-3 day settlement | Funds delayed | Use clearing.next-available |
| Native addons break with Bun | bcrypt/sharp crash | Pure-JS alternatives |
| Caching financial data | Stale balances | Explicit invalidation |
| Concurrent transfer limits | TooManyRequests | Throttle per source |

## Performance
- Bun: ~52K req/s (4× Node 22+); installs 2-5s vs 20-60s npm
- Docker: node:22-alpine ~180MB, oven/bun ~120MB, compiled ~50MB
- Use Next.js `output: "standalone"` for minimal Docker images
- Indexes: btree on userId/createdAt, GIN on JSONB, composite for queries
- Redis cache-aside: balances 30-60s, transactions 5-15 min; co-locate regionally

## Security
- Plaid Link handles all bank auth — never store raw credentials
- Processor token: Dwolla never sees account/routing numbers
- Validate Dwolla webhook HMAC (SHA-256) before processing
- Redis sessions for instant revocation; HttpOnly/SameSite cookies
- MFA for transfers; 15-30 min session timeout; rate-limit all endpoints
- CSRF via Server Actions; Postgres: pgBouncer, RLS
- Watch for: WebView token leakage, hardcoded tokens, OAuth interception

## Related Projects (in workspace)
