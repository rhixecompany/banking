# Banking — Fintech App

**Naming**: `dot.camelCase` for Server Actions; `PascalCase` for components; `camelCase` for utils/hooks; `dot.camelCase` for DAL; `snake_case` for database tables; `kebab-case` for directories.

**Patterns**: Next.js Server Actions with `"use server"`; Zod validation at all entry points (API routes, Server Actions, forms); constructor-based DAL classes with `{ ok, error? }` return types; `cn()` for className merging; soft-delete pattern (never hard-delete); idempotent financial transactions; Plaid/Dwolla webhook handling.

**Structure**: `src/app/` (App Router route groups); `src/components/` (React components); `src/actions/` (Server Actions); `src/dal/` (Data Access Layer); `src/database/schema.ts` (Drizzle schema); `src/types/` (TypeScript types); `src/db/` (DB config).

**TypeScript**: Strict mode; Next.js 16 App Router; Drizzle ORM with PostgreSQL; `bun` for package management (`bun.lock`); ES Modules.

**Database**: PostgreSQL via Drizzle ORM; schema in `src/database/schema.ts`; generate migrations with `npm run db:generate`; push with `npm run db:push`; Drizzle Studio for browsing.

**Auth**: NextAuth.js for authentication; Plaid Link for bank connectivity; Dwolla for transfers; JWT session strategy.

**Security**: No `.env.local` or secrets in VCS; Zod validation at all boundaries; encrypt sensitive financial data; soft-delete for all entities; idempotency keys for transactions; rate limiting via Upstash.

**Env**: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Plaid (`PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_SANDBOX_REDIRECT_URI`), Dwolla credentials.

**Commands**: `npm run dev` (development); `npm run build` (production build); `npm run lint` (ESLint); `npm run db:generate` (migrations); `npm run db:push` (apply); `npm run db:studio` (DB browser).

**Pre-commit**: `bun run format && bun run type-check && bun run lint:strict`.
