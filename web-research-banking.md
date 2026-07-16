# Web Research — Banking Project

> **Project:** Banking (fintech app)  
> **Tech Stack:** PostgreSQL, Dwolla, Bun, Node, Vite, React, Next.js, Plaid, Redis, TypeScript, Docker, Drizzle ORM, Tailwind CSS  
> **Generated:** 2026-07-16  
> **Sources:** Web search + extracted content from official docs, GitHub repos, articles, and community discussions

---

## Table of Contents

1. [Plaid + Dwolla Integration](#1-plaid--dwolla-integration)
2. [Drizzle ORM + PostgreSQL Best Practices](#2-drizzle-orm--postgresql-best-practices)
3. [Bun Runtime — Production Lessons](#3-bun-runtime--production-lessons)
4. [Docker + Next.js Deployment](#4-docker--nextjs-deployment)
5. [Redis Caching & Rate Limiting for Fintech](#5-redis-caching--rate-limiting-for-fintech)
6. [TypeScript Patterns for Financial Apps](#6-typescript-patterns-for-financial-apps)
7. [Tailwind CSS Banking Dashboard UI](#7-tailwind-css-banking-dashboard-ui)
8. [Security Considerations](#8-security-considerations)
9. [Common Pitfalls & Gotchas](#9-common-pitfalls--gotchas)
10. [Reference Projects (Open Source)](#10-reference-projects-open-source)

---

## 1. Plaid + Dwolla Integration

### Official Plaid-Dwolla Partnership

Plaid and Dwolla have a formal partnership for businesses to connect to the US banking system. The flow:

1. **Plaid Link** (client-side) — user authenticates with their financial institution
2. After linking, you receive:
   - **Plaid `access_token`** — for real-time balance checks and transaction data
   - **Dwolla `processor_token`** — to securely verify a bank funding source via Dwolla's API **without storing any sensitive banking information**
3. Use the processor token to create a Dwolla funding source, then initiate ACH/RTP transfers

### Environment Variables

```
# Plaid
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox                # sandbox | development | production
PLAID_PRODUCTS=auth,transactions  # comma-separated
PLAID_COUNTRY_CODES=US

# Dwolla
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```

### Plaid Client Setup (Node/TypeScript)

```typescript
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
```

### Key Integration Steps

1. **Create a `link_token`** server-side (`/link/token/create`) — short-lived, one-time use
2. **Open Plaid Link** in the browser — user selects their bank and authenticates
3. **Exchange `public_token`** for an `access_token` + `processor_token`
4. **Create Dwolla customer** (if not exists) using Dwolla API
5. **Create Dwolla funding source** using the processor token
6. **Initiate transfers** via Dwolla API with idempotency keys

### Dwolla Transfer API

```typescript
var requestBody = {
  _links: {
    source: { href: "https://api-sandbox.dwolla.com/funding-sources/{sourceId}" },
    destination: { href: "https://api-sandbox.dwolla.com/funding-sources/{destId}" },
  },
  amount: { currency: "USD", value: "100.00" },
  clearing: { source: "standard", destination: "next-available" },
  metadata: { key: "value" },
  correlationId: "uuid-v4-here",  // for traceability
};

// Idempotency-Key header prevents duplicate transfers
const transfer = await appToken.post("transfers", requestBody, {
  headers: { "Idempotency-Key": "unique-key" },
});
```

### Dwolla Webhooks — Critical

Dwolla webhooks notify your app of transfer status changes. **Must implement**:

1. **Webhook subscription** — POST to `/webhook-subscriptions` with your URL + secret
2. **HMAC validation** — verify `X-Request-Signature-SHA-256` header
3. **Idempotent processing** — check for duplicate events (return 409 Conflict for dupes)
4. **Queue for async processing** — use SQS or similar to avoid blocking
5. **Automatic pausing** — subscription auto-pauses after 400 consecutive failures

```typescript
// HMAC verification
const crypto = require("crypto");
const isSignatureValid = (body: string, signature: string) =>
  signature === crypto
    .createHmac("sha256", process.env.DWOLLA_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");
```

Key webhook topics: `customer:created`, `customer.funding-source:removed`, `transfer:created`, `transfer:failed`, `transfer:succeeded`.

**Sources:**
- https://plaid.com/docs/auth/partnerships/dwolla
- https://developers.dwolla.com/docs/connect/working-with-webhooks
- https://developers.dwolla.com/docs/connect/api-reference/transfers/initiate-a-transfer
- https://medium.com/@injose.joshi/integrating-plaid-and-dwolla-with-a-next-js-app-329022a2cd75

---

## 2. Drizzle ORM + PostgreSQL Best Practices

### Schema Design (PostgreSQL with Drizzle)

**Recommended file organization:**
- Single `src/db/schema.ts` for smaller apps, or `src/db/schema/*.ts` for larger ones
- Export all models so Drizzle-Kit can read them for migrations

**Column type selection for banking:**
- Use `decimal(precision, scale)` for money values (not `float` — precision loss!)
- `uuid` as primary keys (use `gen_random_uuid()` or `uuidv7` for time-ordered)
- `timestamp with time zone` for all timestamps
- `jsonb` for flexible metadata/storage
- `text` for long strings; `varchar(n)` for fixed-length codes (e.g. routing numbers)

```typescript
import { pgTable, uuid, text, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  plaidAccountId: text("plaid_account_id").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // checking, savings, credit
  subtype: text("subtype"),
  mask: text("mask"),           // last 4 digits
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default("0.00"),
  currency: text("currency").notNull().default("USD"),
  userId: uuid("user_id").notNull().references(() => users.id),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

**Indexes for banking queries:**
- `btree` on `userId`, `createdAt`, account type columns
- `btree` on foreign keys (Drizzle creates these automatically with `references()`)
- Composite index on `(userId, createdAt)` for transaction history queries
- Consider partial indexes for soft-delete patterns

**Migrations workflow:**
```bash
bunx drizzle-kit generate    # Generate SQL migration
bunx drizzle-kit push        # Push to dev DB (fast iteration)
bunx drizzle-kit migrate     # Run migrations in production
bunx drizzle-kit studio      # GUI for DB inspection
```

**Drizzle config:**
```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",      // "postgresql" | "mysql" | "sqlite"
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Query Patterns

- **Prepared statements** for repeated queries — Drizzle does this automatically
- **Batch operations** for bulk inserts (much faster than individual inserts)
- **Relations v2 API** (`defineRelations`) for type-safe joins
- Use `$inferSelect` / `$inferInsert` for type inference from schema
- Combine with Zod for runtime validation: `drizzle-orm/zod` module

**Error handling:** Always wrap DB calls in try/catch. Handle constraint violations, deadlocks, and connection errors specifically.

### PostgreSQL-Specific Features

- **Enums** via `pgEnum()` in Drizzle
- **Full-text search** with `tsvector`/`tsquery`
- **GIN indexes** for JSONB and array columns
- **Partial indexes** for filtered queries (e.g., `WHERE deleted_at IS NULL`)
- **Materialized views** for expensive aggregation queries
- **UUID v7** for time-ordered UUIDs (better index performance than random UUIDs)

**Production connection pool:** Use `pgBouncer` or `@neondatabase/serverless` for connection pooling. Drizzle works with both.

**Sources:**
- https://github.com/honra-io/drizzle-best-practices
- https://orm.drizzle.team/docs/sql-schema-declaration
- https://stackoverflow.com/questions/79666349/drizzle-orm-postgres-how-to-specify-postgres-database-schema-defaults-to-pub

---

## 3. Bun Runtime — Production Lessons

### Performance (Real Benchmarks)

| Metric | Bun 1.x | Node.js 22+ | Improvement |
|--------|---------|-------------|-------------|
| HTTP throughput (JSON) | ~52,000 req/s | ~13,000 req/s | ~4× |
| Package install (cold) | 2-5s | 20-60s | 10-25× |
| Package install (warm CI) | 0.5-1s | 5-15s | 10×+ |
| Startup time | ~50ms | ~180ms | ~3× |

### What Works with Bun ✅

- Express, Fastify, Hono, Koa
- **Drizzle ORM**, Prisma, Mongoose
- React/Vue/Svelte (compiled)
- All Node.js built-in modules (`fs`, `path`, `crypto`, `http`, `stream`)
- TypeScript natively (no build step required)
- CommonJS `require()` and ESM `import`
- Jest-compatible test runner built-in (`bun test`)
- WebSocket server (built-in, fast)

### What Doesn't Work ❌

- Native addons (`.node` files compiled with `node-gyp`):
  - `bcrypt` → use `bcryptjs` or Bun's built-in Argon2
  - `sharp` → use `jimp` (pure JS, slower) or serverless image CDN
  - `canvas` → no drop-in replacement
  - Some database drivers → use pure-JS alternatives
- `child_process.fork()` — works but inter-process is Node.js only
- `cluster` module — partial support
- Some `crypto` edge cases differ from Node.js

### Docker with Bun

```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Option A: Run with bun
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]

# Option B: Compile to single binary (smaller image ~50MB)
# RUN bun build ./src/index.ts --compile --outfile server
# CMD ["./server"]
```

### Image Size Comparison

- `node:22-alpine` + app: ~180MB
- `oven/bun:1-alpine` + app: ~120MB
- Bun compiled binary (--compile): ~50MB standalone

### Production Gotchas

1. **Bun as package manager is universally recommended** — even for Node.js projects. Install speed benefit requires no runtime compatibility work.
2. **Bun as runtime: recommended for new projects.** For existing Node.js apps, run on staging for 2+ weeks before production cutover.
3. **Node.js compatibility ~95%** — that 5% gap breaks real packages. Test thoroughly.
4. **Memory leak history** — early Bun versions had some memory leak issues in long-running processes (mostly resolved by Bun 1.2+).
5. **Vercel supports Bun natively** since 2024 — set `"installCommand": "bun install"` in vercel.json.
6. **Cloudflare Workers do NOT use Bun** — they use V8, not JavaScriptCore.

**Sources:**
- https://www.pkgpulse.com/guides/bun-in-production-performance-gotchas
- https://strapi.io/blog/bun-vs-nodejs-performance-comparison-guide
- https://www.youtube.com/watch?v=DpDHPoStZZ8

---

## 4. Docker + Next.js Deployment

### Multi-Stage Dockerfile (Best Practice)

Three-stage approach (de facto standard):

```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

**Key points:**
- Use `output: "standalone"` in `next.config.ts` for minimal production images
- Separate deps/build/runner stages for layer caching
- Run as non-root user (`nextjs`)
- Alpine-based images are significantly smaller

### Docker Compose for Development

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/banking
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: banking
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

### Deployment Options

- **Vercel** (recommended for Next.js) — supports Bun native, zero-config for most setups
- **Railway** — good Docker support, easy Postgres/Redis add-ons
- **Fly.io** — global deployment, supports oven/bun Docker images
- **AWS ECS/Lambda** — use custom runtime with oven/bun base image

**Sources:**
- https://medium.com/front-end-world/dockerizing-a-next-js-application-in-2025-bacdca4810fe
- https://forums.docker.com/t/docker-for-front-end-developers-next-js-production-dockerfile/146652
- https://www.reddit.com/r/nextjs/comments/1i4rfna/hosting_your_nextjs_app_with_docker_a_multistage

---

## 5. Redis Caching & Rate Limiting for Fintech

### Core Principle in Fintech

> **"Redis is treated as a performance accelerator, not a source of truth. PostgreSQL acts as the durable fallback."**

### Use Cases for Banking App

| Use Case | Redis Pattern | TTL Strategy |
|----------|--------------|--------------|
| User sessions | Server-side session store | Session duration + sliding expiry |
| Plaid access tokens | Cache-aside (populate on miss) | Until token refresh |
| Transaction data (recent) | Cache-aside | 5-15 minutes |
| API rate limiting | Sliding window counter | Per-window expiry |
| Dwolla webhook idempotency | SET NX with TTL | 24 hours (event ID → processed) |
| OTP/verification codes | Direct set with TTL | 5-10 minutes |
| Account balances | Write-through cache | 30-60 seconds |

### Upstash Redis (Serverless-Friendly)

Upstash is the preferred Redis for Next.js serverless/edge because:
- HTTP-based access (no TCP connections needed — works with edge functions)
- Global replication (deploy to multiple regions)
- No cold starts
- Pay-per-request pricing

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache-aside pattern
async function getCachedBalances(userId: string) {
  const cacheKey = `balances:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const balances = await db.query.balances.findMany({ where: eq(balances.userId, userId) });
  await redis.set(cacheKey, JSON.stringify(balances), { ex: 60 }); // 60s TTL
  return balances;
}
```

### Rate Limiting with Redis

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),  // 10 requests per 10 seconds
  analytics: true,
});

// In API route or middleware:
const { success, limit, remaining, reset } = await ratelimit.limit(userId);
if (!success) {
  return new Response("Too Many Requests", { status: 429 });
}
```

### Resilience Pattern (Fintech)

Since Redis is not durable:
- All reads/writes fall back to PostgreSQL if Redis is down
- Token bucket rate limiter throttles fallback DB queries during Redis outage
- Cache invalidation must be explicit for financial data (don't rely solely on TTL)

### Important: Redis as Session Store for Banking

Server-side sessions with Redis (vs stateless JWTs):
- Immediate session invalidation (kill switch for compromised accounts)
- No sensitive data in tokens
- Works well with regulatory requirements (audit trails, session timeouts)
- Use secure, HttpOnly cookies for session IDs

**Sources:**
- https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production
- https://redis.io/solutions/session-management
- https://redis.io/glossary/rate-limiting
- https://www.reddit.com/r/softwarearchitecture/comments/1qkw6og/designing_a_redisresilient_cache_for_fintech
- https://www.techmarcos.com/redis-caching-strategies-production

---

## 6. TypeScript Patterns for Financial Apps

### Money/Decimal Types

Never use `number` for monetary values. Patterns:

```typescript
// Option 1: String-based (safe across API boundaries)
type Money = string; // "100.00"

// Option 2: Cents-based integers (most precise)
type Cents = number; // 10000 = $100.00

// Option 3: Branded type (TypeScript nominal typing)
type USD = number & { readonly __brand: "USD" };
function toUSD(cents: number): USD {
  if (!Number.isInteger(cents)) throw new Error("Cents must be integer");
  return cents as USD;
}
```

### Discriminated Unions for Transaction Status

```typescript
type TransactionStatus =
  | { status: "pending"; initiatedAt: Date }
  | { status: "processing"; initiatedAt: Date; processorRef: string }
  | { status: "completed"; initiatedAt: Date; processorRef: string; settledAt: Date }
  | { status: "failed"; initiatedAt: Date; errorCode: string; errorMessage: string }
  | { status: "returned"; initiatedAt: Date; processorRef: string; returnCode: string };
```

### Strict Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
  }
}
```

### Zen of Financial TypeScript

- Use `zod` for runtime validation of Plaid/Dwolla API responses
- Branded types for IDs (`UserId`, `AccountId`, `TransactionId`) — prevents mixing them up
- `satisfies` operator over `as` casting
- Prefer `unknown` over `any` for API response types
- Never use `!` non-null assertion on optional financial fields

**Sources:**
- https://dev.to/sunny7899/typescript-type-guards-for-discriminated-unions-best-practices-for-scalable-code-4g07
- https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html

---

## 7. Tailwind CSS Banking Dashboard UI

### Recommended Templates & Patterns

- **Flowbite Bank Dashboard** — pre-built banking UI with charts, cards, transaction lists
- **TailAdmin** — free/paid Next.js admin dashboard templates
- **Untitled UI Fintech Dashboard** — React/Tailwind fintech template with TypeScript
- **shadcn/ui** component library pairs well with Tailwind for banking UI

### Banking Dashboard Components

```
dashboard/
├── layout.tsx               # Sidebar + header + main area
├── page.tsx                 # Overview with balance cards + charts
├── my-banks/                # Connected bank accounts
│   ├── page.tsx
│   └── [id]/page.tsx        # Single account details
├── payment-transfer/        # ACH transfer form
│   └── page.tsx
├── transaction-history/     # Paginated transaction log
│   └── page.tsx
└── settings/                # User settings
    └── page.tsx
```

### Key UI Patterns

- **Responsive sidebar** — collapsible on mobile, persistent on desktop
- **Doughnut/bar charts** — for spending breakdowns (use chart.js or recharts)
- **Skeleton loading states** — for financial data (accounts, transactions, balances)
- **Dark mode support** — Tailwind makes this trivial with `class` strategy
- **Accessibility** — proper focus management, ARIA labels on all interactive elements
- **Numeric formatting** — `Intl.NumberFormat` for currency, `Intl.DateTimeFormat` for dates

**Sources:**
- https://flowbite.com/application-ui/demo/homepages/bank
- https://tailadmin.com/blog/finance-dashboard-templates
- https://www.aniq-ui.com/en/blog/nextjs-admin-dashboard-templates-2025

---

## 8. Security Considerations

### For Banking/Fintech Applications

**Plaid/Dwolla specific:**
- Never store raw banking credentials — Plaid Link handles authentication
- Plaid processor token is the security boundary; Dwolla never sees raw account numbers
- Use Plaid sandbox for development, separate credentials for production
- Dwolla webhooks should validate HMAC signatures before processing

**Authentication & Session:**
- Server-side sessions via Redis (immediate revocation) > stateless JWTs for fintech
- Secure, HttpOnly, SameSite cookies for session tokens
- Multi-factor authentication for sensitive operations (transfers, adding accounts)
- Session timeout after inactivity (15-30 minutes for banking apps)

**API Security:**
- Rate limit all endpoints (use Redis sliding window)
- CSRF protection (Next.js Server Actions handle this natively)
- Input validation on both client and server (Zod schemas)
- Never expose Plaid/Dwolla tokens to the client except processor tokens via Link

**PostgreSQL:**
- Use connection pooling (pgBouncer or similar)
- Row-level security (RLS) for multi-tenant isolation
- Encrypt data at rest and in transit
- Regular backup verification
- Least-privilege database users

**Common vulnerabilities (from real fintech apps):**
- WebView token leakage
- Hardcoded authentication tokens
- Insecure token storage
- OAuth callback interception
- Listening on local ports for callbacks

**Sources:**
- https://oversecured.com/blog/mobile-banking-security-account-takeover-vulnerabilities
- https://www.cockroachlabs.com/blog/limitations-of-postgres
- https://medium.com/@sarahnzeshi05/session-management-deep-dive-2-server-side-sessions-with-redis-when-control-beats-pure-abd162f32c96

---

## 9. Common Pitfalls & Gotchas

### Plaid + Dwolla
- **Plaid Link token expires** — generate fresh tokens for each Link session
- **Dwolla webhook subscription auto-pauses** after 400 consecutive failures — monitor this
- **ACH settlement takes 2-3 business days** by default; use `clearing.next-available` for same-day
- **Dwolla requires a "facilitator fee" funds flow** for marketplace/platform models
- **Rate limit on concurrent transfers** — Dwolla returns `TooManyRequests` for concurrent transfers from the same funding source
- **Test with real sandbox credentials** — Plaid sandbox has specific test accounts

### Drizzle ORM + PostgreSQL
- **Schema name confusion** — Drizzle connects to the `public` schema by default; set `search_path` in connection string for custom schemas
- **Migration order matters** — always `generate` before `push`/`migrate`
- **No automatic type coercion** between DB and TypeScript — use `$type()` for custom types
- **`decimal` columns return strings** from some drivers — use Drizzle's type mapping
- **Connection pool exhaustion** with serverless — use edge-compatible drivers

### Bun Runtime
- **Bun's `crypto` module differs from Node.js** in some edge cases — test your encryption
- **No native `bcrypt`** — use `bcryptjs` or Bun's built-in `Bun.password` (Argon2)
- **Memory usage** — Bun can use more memory than Node for long-running processes; monitor in production
- **Bun.lockb is binary** — can't be diffed in PRs as easily as package-lock.json
- **Not all CI/CD platforms** support Bun natively (yet) — most major ones do

### Next.js + Server Actions
- **Server Actions with Plaid** — tokens generated during Server Actions need careful error handling
- **Next.js 16 App Router** — ensure Plaid Link client component uses `"use client"` directive
- **`output: "standalone"`** — required for minimal Docker images but copies more files
- **Webhook routes** must be API Route Handlers, not Server Actions (raw body access needed)

### Redis
- **Don't cache financial transactions** without eventual consistency guarantees
- **Redis persistence** (RDB/AOF) has trade-offs — evaluate if cache reconstruction is acceptable
- **Memory limits** — set `maxmemory` and eviction policy (prefer `allkeys-lru` for cache)
- **Network latency** — co-locate Redis with your app in the same region

---

## 10. Reference Projects (Open Source)

### Next.js + Plaid + Dwolla Banking Apps

| Repository | Stars | Stack Notes |
|-----------|-------|-------------|
| [Konstantilieris/banking](https://github.com/Konstantilieris/banking) | ~50 | Next.js 14, Plaid, Dwolla, Appwrite, Sentry |
| [ayushagarwal138/MoneyMap](https://github.com/ayushagarwal138/MoneyMap) | ~15 | Next.js 14, Appwrite, Plaid, Dwolla |
| [abdelmawla2350/NuBank](https://github.com/abdelmawla2350/NuBank) | ~30 | Next.js 15, TypeScript, Appwrite, Plaid, Dwolla |
| [Hayden-git/Banking_App](https://github.com/Hayden-git/Banking_App) | ~20 | Next.js, TypeScript, ShadCN, Plaid, Dwolla, Appwrite |

### Common Architecture Across Projects

```
app/
├── (auth)/              # Authentication routes (sign-in, sign-up)
├── (root)/              # Protected routes
│   ├── my-banks/        # Bank accounts management
│   ├── payment-transfer/# Fund transfer interface
│   ├── transaction-history/ # Transaction logs
│   └── page.tsx         # Dashboard home
├── api/                 # API routes for Plaid/Dwolla
├── layout.tsx
components/
├── shared/              # AuthForm, BankCard, PlaidLink, Sidebar
├── ui/                  # Base UI components
lib/
├── actions/             # Server actions
│   ├── bank.action.ts
│   ├── user.action.ts
│   ├── dwolla.action.ts
│   └── transaction.action.ts
├── plaid.ts             # Plaid client config
└── utils.ts
types/
└── index.d.ts           # TypeScript definitions
constants/
└── index.ts             # App constants
```

### Notable Patterns from Reference Projects

1. **Server Actions** for all banking operations (not REST endpoints)
2. **Appwrite** as BaaS (auth + database) — your project uses Drizzle + PostgreSQL instead
3. **Sentry integration** for error tracking on all financial transactions
4. **ShadCN/ui** for consistent component library
5. **Zod validation** on all Plaid/Dwolla API interactions
6. **Separate action files** per domain (bank, user, dwolla, transaction)

**Sources:**
- https://github.com/Konstantilieris/banking
- https://github.com/ayushagarwal138/MoneyMap
- https://github.com/abdelmawla2350/NuBank
- https://github.com/Hayden-git/Banking_App
- https://github.com/topics/dwolla-v2

---

## Quick Reference Card

| Concern | Tool/Approach | Key Takeaway |
|---------|--------------|--------------|
| **Bank integration** | Plaid Link → processor token | Never store raw credentials |
| **Payments** | Dwolla API + idempotency keys | Idempotency prevents duplicate charges |
| **Webhooks** | Dwolla + HMAC validation | Validate signatures, process idempotently |
| **Database** | Drizzle ORM + PostgreSQL | `decimal` for money, UUID PKs, proper indexes |
| **Runtime** | Bun 1.x | ~4× faster HTTP, use `bcryptjs` not `bcrypt` |
| **Container** | Docker multi-stage | Standalone output, non-root user, Alpine |
| **Cache** | Redis (Upstash for serverless) | Accelerator, not source of truth |
| **UI** | Tailwind + shadcn/ui | Dark mode, responsive, skeleton loading |
| **Types** | TypeScript strict + Zod | Discriminated unions for status, branded IDs |
| **Rate limiting** | Redis + Upstash ratelimit | Sliding window in edge middleware |

---

*End of research document — compiled from 15+ web sources including official Plaid/Dwolla docs, Drizzle ORM docs, Bun production guide, GitHub repositories, and community discussions.*
