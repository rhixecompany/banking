# Tech Context

## Technologies

| Category | Technology | Version |
| --- | --- | --- |
| Framework | Next.js | 16.2.4 |
| UI | React | 19.2.5 |
| Language | TypeScript | 6.0.3 |
| Database | PostgreSQL | via Neon |
| ORM | Drizzle | 0.45.2 |
| Auth | NextAuth.js | 4.24.14 |
| Bank API | Plaid | 42.2.0 |
| Transfers | Dwolla | 3.4.0 |
| Package Manager | Bun | 1.3.14 |

## Development Setup

```bash
# First-time setup
bun install
cp .env.example .env.local
# ⚠️ Add ENCRYPTION_KEY to .env.local (NOT in .env.example)
docker-compose up -d postgres redis
bun run db:push
bun run db:seed
bun run dev
```

### Key Commands

```bash
bun run dev          # Dev server (port 3000)
bun run build        # Production build
bun run type-check   # TypeScript strict
bun run lint:strict  # ESLint (CI gate)
bun run format       # Prettier
bun run verify:rules # AST policy enforcement
bun run test:browser # Vitest unit tests
bun run test:ui      # Playwright E2E
bun run db:push      # Drizzle schema to Postgres
bun run db:seed      # Load test data
```

### Pre-PR Checklist
```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```

## Dependencies

- **UI**: shadcn/ui, Tailwind CSS v4, Radix primitives
- **Forms**: React Hook Form, Zod v4
- **State**: Zustand
- **Testing**: Vitest, Playwright

## Tool Usage Patterns

- **Env access**: `app-config.ts` (never `process.env` directly)
- **DB access**: DAL helpers in `@/dal`
- **Testing**: Mock tokens (`seed-*`, `mock-*`) for Plaid/Dwolla
- **Validation**: Zod schemas in `lib/validations/`

## Technical Constraints

1. No `any` — TypeScript strict
2. Home page static — no auth/db/env in `app/page.tsx`
3. Cent-based integers for currency (never floating point)
4. Idempotency keys required for all Dwolla transfers