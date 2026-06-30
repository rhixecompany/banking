# Project 1: Banking (Next.js 16 + Drizzle ORM + Plaid/Dwolla)

## Similar Open-Source Projects

| Project | URL | Stack |
|---------|-----|-------|
| **lasindu2001/next-banking-app** | https://github.com/lasindu2001/next-banking-app | Next.js, Tailwind, shadcn, Appwrite, Plaid, Dwolla, Sentry |
| **Hayden-git/Banking_App** | https://github.com/Hayden-git/Banking_App | Next.js, Plaid, Dwolla |
| **Gourab1312/Vault** | https://github.com/Gourab1312/Vault | Next.js 14, TypeScript, TailwindCSS, Plaid, Dwolla, Sentry |
| **saulkurosaki/HORIZON-BANKING-APP-PROJECT** | https://github.com/saulkurosaki/HORIZON-BANKING-APP-PROJECT | Next.js, Plaid, Dwolla |
| **Tanmay-312/bank-of-horizon** | https://github.com/Tanmay-312/bank-of-horizon | Next.js 14, React 18, Plaid, Dwolla, Sandbox |
| **CodewithRajDeep/finance-flow** | https://github.com/CodewithRajDeep/finance-flow | Finance Flow (full-stack banking) |
| **Plaid/account-funding-tutorial** | https://github.com/plaid/account-funding-tutorial | Plaid Auth + Balance + Identity + Dwolla |
| **Dwolla/webhook-receiver** | https://github.com/Dwolla/webhook-receiver | AWS Lambda + SQS webhook handler |

## Key Findings

### Plaid + Dwolla Partnership (2025)
- **Unified API (March 2025):** Dwolla and Plaid now offer a single vendor/single API for IAV + Balance Check + ACH/RTP/FedNow pay-by-bank.
  - Source: https://www.dwolla.com/updates/dwolla-plaid-expand-integration
  - Source: https://developers.dwolla.com/docs/secure-exchange/plaid
- **Secure Token Exchange:** Plaid `access_token` + `accountId` → Dwolla `processor_token` → Dwolla exchange resource → funding source. Sensitive banking data never touches your servers.
  - Source: https://plaid.com/docs/auth/partnerships/dwolla
- **Dwolla App Approval:** Requires submitting applications 2+ weeks before go-live; strong authentication (MFA) required if end users access sensitive info.
  - Source: https://www.dwolla.com/resources/app-approval-guide

### Next.js 16 + Drizzle ORM
- **Next.js 16 (Oct 2025)**: Turbopack is default (2–5× faster builds), Cache Components with `"use cache"` directive, React 19 bundled, improved caching APIs (`revalidateTag` now requires a `cacheLife` profile).
  - Source: https://nextjs.org/blog/next-16
- **Next.js 16.2 (March 2026):** Stable Build Adapters API for non-Vercel platforms (`proxy.ts` support). 13 security advisories patched.
  - Source: https://makerkit.dev/blog/tutorials/nextjs-16
- **Drizzle ORM:** ~7.4 KB gzipped, zero runtime dependencies, fully type-safe, plain TypeScript schemas (no `.prisma` DSL). Generates numbered SQL migrations with `drizzle-kit`.
  - Source: https://listiak.dev/blog/drizzle-orm-the-typescript-orm-that-thinks-in-sql
  - Source: https://makerkit.dev/blog/tutorials/drizzle-vs-prisma

### Performance Characteristics
- Drizzle excels in serverless/edge: smaller bundle, no query engine binary. Prisma's Rust engine (~8 MB) causes cold-start issues on edge functions.
- MySQL on Edge Runtime: requires careful handling — `stream` module unsupported. Use `postgres-js` or `@neondatabase/serverless` for Vercel Edge.
  - Source: https://github.com/drizzle-team/drizzle-orm/issues/4142

## Cheatsheet

### Drizzle ORM Quick Reference
```typescript
// Setup
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// Select
const users = await db.select().from(usersTable);
const result = await db.select({ id: users.id, name: users.name }).from(users);

// Insert
await db.insert(usersTable).values({ name: 'Alice', email: 'alice@example.com' });

// Update
await db.update(usersTable).set({ name: 'Bob' }).where(eq(usersTable.id, 1));

// Delete
await db.delete(usersTable).where(eq(usersTable.id, 1));

// Relations (with drizzle-orm v0.30+)
const usersWithPosts = await db.query.users.findMany({
  with: { posts: true }
});

// Raw SQL
import { sql } from 'drizzle-orm';
await db.select().from(users).where(sql`${users.id} < 42`);

// Migrations
// drizzle-kit generate → drizzle-kit migrate
```

### Plaid Link Flow
```
1. Backend: Create link_token  →  Frontend: Plaid Link (user authenticates)
2. Frontend: public_token returned → Backend: exchange for access_token
3. Backend: exchange(access_token, accountId) → Dwolla processor_token
4. Backend: Create Dwolla exchange resource with processor_token
5. Backend: Create funding source from exchange
```

### Next.js 16 Key Migration Points
```typescript
// next.config.ts — enable Cache Components
export const cacheComponents = true;

// Caching API (now requires cacheLife profile)
import { revalidateTag } from 'next/cache';
revalidateTag('posts', 'hours');  // second arg now required

// use cache directive (PPR replacement)
async function Component() {
  'use cache';
  return <div>Cached shell</div>;
}

// Middleware is now proxy.ts (breaking rename in Nx16)
```

## Best Practices

1. **Token Exchange Pattern:** Use Plaid's processor_token for Dwolla — never store `access_token` or bank credentials.
2. **Webhook Idempotency:** Dwolla webhooks must be idempotent. Store processed event IDs. Use at-least-once delivery model.
3. **Separate Environments:** Dev/staging/prod Plaid environments are separate. Use `plaid.environment = 'sandbox' | 'development' | 'production'`.
4. **Next.js 16 Caching:** Use `cacheLife()` profiles for proper stale-while-revalidate. Don't mix SSR default caching assumptions from v14.
5. **Drizzle Connection Management:** Use a singleton DB connection in Next.js (not per-request). With Neon: `@neondatabase/serverless` + `drizzle-orm/neon-http`.
6. **Type-Safe Schema Splitting:** Split Drizzle schemas into multiple files using glob patterns in `drizzle.config.ts`.
   Source: https://www.thisdot.co/blog/configure-your-project-with-drizzle-for-local-and-deployed-databases
7. **Staged Rollout:** When upgrading Next.js: upgrade to 15 first, fix deprecations, then 16.
   Source: https://dev.to/abhilashlr/migrating-to-nextjs-16-react-19-a-platform-upgrade-that-paid-off-4j6f
8. **Zod Validation:** Validate all incoming request bodies (including Plaid/Dwolla webhooks) with Zod.
   Source: https://www.turbostarter.dev/blog/complete-nextjs-security-guide-2025

## Common Pitfalls

1. **Webhook raw body parsing:** Next.js body parsing interferes with Stripe/Dwolla signature verification. Use `req.text()` instead of `await req.json()` for webhook handlers.
   Source: https://dev.to/whoffagents/webhook-security-in-nextjs-signatures-idempotency-and-avoiding-common-mistakes-4g6
2. **Plaid item stale/expired tokens:** Items go stale — users must re-link. Handle `ITEM_LOGIN_REQUIRED` errors.
   Source: https://medium.com/@FintegrationFS/how-can-a-specialist-developer-prevent-common-plaid-integration-failures-in-the-us
3. **Duplicate transaction events:** Plaid sends duplicate `TRANSACTIONS_REFRESH_UPDATE` webhooks. Deduplicate by `transaction_id`.
4. **Dwolla webhook queue overflow:** Dwolla can retry aggressively. Implement dead-letter queues and max-retry handling.
5. **Drizzle edge runtime:** MySQL driver uses `stream` module which crashes Next.js Middleware (Edge). Use `postgres-js` or externalize DB queries to Server Actions/Routes.
   Source: https://github.com/drizzle-team/drizzle-orm/issues/4142
6. **Test vs production database confusion:** Drizzle has no built-in env switching. Use env vars and separate `drizzle.config.ts` per environment.
   Source: https://stackoverflow.com/questions/77093723/how-to-have-both-production-and-test-databases-in-drizzle-orm
7. **Next.js Nx16 `middleware.ts` renamed to `proxy.ts`:** If not using Vercel, non-Vercel adapters (OpenNext, etc.) must be updated to v2 Build Adapters API (Stable as of 16.2).
   Source: https://makerkit.dev/blog/tutorials/nextjs-16

## Performance Tips

1. **Server Components by Default:** Next.js 16 reduces client JS by up to 70% with proper RSC usage. Minimize `'use client'` to genuinely interactive components.
   Source: https://www.digitalapplied.com/blog/nextjs-16-performance-server-components-guide
2. **Turbopack:** Default in Next.js 16. Use `next build --turbo` for 2–5× faster builds in production CI.
3. **Drizzle Select Optimization:** Use `select()` with only needed columns instead of `select().from(table)` for Partial Select to reduce data transfer.
4. **Plaid Link Caching:** Cache Plaid `link_token` server-side for its short TTL (~4 hours). Don't generate on every page load.
5. **Connection Pooling:** Use `pgBouncer` or Neon's connection pooler for high-concurrency environments.
6. **Suspense Boundaries:** Wrap dynamic components (e.g., Dwolla transaction history) in `<Suspense>` for streaming.
7. **Drizzle Prepared Statements:** Use `db.select().from(table).where(eq(...)).prepare()` for repeated queries.
   Source: https://orm.drizzle.team/docs/select
8. **Bundle Analysis:** Use `@next/bundle-analyzer` to track Drizzle and Plaid SDK bundle sizes.

## Security Considerations

1. **PCI DSS Compliance:** Using Plaid + Dwolla keeps banking credentials out of your scope, but you still must ensure your app meets applicable financial regulations. Consult legal/security experts.
2. **Webhook Signature Verification:** Always verify Dwolla and Plaid webhook signatures server-side before processing.
   Source: https://developers.dwolla.com/docs/webhooks
3. **Never expose secret keys:** `PLAID_SECRET`, `DWOLLA_SECRET`, `PLAID_CLIENT_ID` must be server-only. Use Next.js `NEXT_PUBLIC_*` prefix only for truly public values.
4. **Plaid Access Token Storage:** Store Plaid `access_token` encrypted at rest. Use separate encryption keys per environment.
5. **Zod Input Validation:** Validate all API input (Plaid link token requests, Dwolla transfer amounts, user IDs) with Zod schemas.
   Source: https://www.turbostarter.dev/blog/complete-nextjs-security-guide-2025-authentication-api-protection-and-best-practices
6. **Rate Limiting:** Implement rate limiting on bank account linking and transfer endpoints. Dwolla enforces its own limits, but you must enforce client-side too.
7. **Content Security Policy (CSP):** Configure strict CSP headers. Stripe/Plaid SDKs require specific `script-src` allows.
   Source: https://www.authgear.com/post/nextjs-security-best-practices
8. **Next.js 16 Security Patches (recommended):** Patch to ≥16.2.6. Notable CVEs fixed: DoS in Server Components, proxy/middleware bypass, SSRF in WebSocket upgrades, RSC cache poisoning, XSS, Image Optimization API DoS.
   Source: https://makerkit.dev/blog/tutorials/nextjs-16
9. **CSRF Protection:** Use CSRF tokens for all state-changing routes (Dwolla transfers, Plaid link creation).
10. **Audit Trail:** Log all financial operations (transfer ids, amounts, timestamps, user ids) for compliance.
