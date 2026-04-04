# Banking Project - GitHub Copilot Agent Rules

<!-- markdownlint-disable MD013 -->

> **Project:** Next.js 16, TypeScript (strict), Drizzle ORM, PostgreSQL, NextAuth, shadcn/UI, Tailwind CSS v4
>
> **Last Updated:** 2026-04-03

<!-- markdownlint-enable MD013 -->

---

## Source of Truth

This file is a quick reference for GitHub Copilot. For detailed patterns, see:

- **[AGENTS.md](../AGENTS.md)** — Stack, PR-blocking rules, commands, core patterns (Reference + How-to)
- **[README.md](./README.md)** — Project overview, setup, deployment

### Sync Checklist

When updating this file, verify alignment with:

- `AGENTS.md` — commands, rules, project structure
- `.cursorrules` — overlapping content should match
- package.json — scripts must match actual commands

---

## Technology Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Framework  | Next.js 16 (App Router)     |
| Language   | TypeScript (strict mode)    |
| ORM        | Drizzle ORM                 |
| Database   | PostgreSQL                  |
| Auth       | NextAuth v4                 |
| UI         | shadcn/UI + Tailwind CSS v4 |
| Validation | Zod                         |
| Testing    | Vitest + Playwright         |
| Encryption | AES-256-GCM                 |

### Key Characteristics

- **Server Components by default** — Use `'use client'` only when needed
- **DAL Pattern** — All database access through `lib/dal/`
- **Server Actions** — All mutations via Server Actions
- **React Compiler enabled** — `reactCompiler: true` in next.config.ts

---

## Critical Rules (PR Blocking)

| Rule | Requirement |
| --- | --- |
| No `any` types | Use `unknown` + type guards for external data |
| No N+1 queries | Eager load / JOIN — no per-row queries in loops |
| No raw `process.env` | Use `lib/env.ts` with Zod validation |
| All mutations via Server Actions | Never API routes for mutations |
| Zero TypeScript errors | Must pass `npm run type-check` |
| Zero lint warnings | Must pass `npm run lint:strict` |
| All tests pass | Must pass `npm run test` |

### Pre-Commit Checklist

```bash
npm run validate
```

---

## Available Commands

### Development

```bash
npm run dev              # Dev server (localhost:3000)
npm run build           # Production build
npm run start           # Start production server
```

### Validation (required before commit)

```bash
npm run validate        # Run all checks (format, type-check, lint, test)
npm run format          # Format code with Prettier
npm run format:check    # WARNING: destructive — runs format (writes files) first, then checks
npm run lint:strict     # Strict ESLint (blocks PR)
npm run type-check      # TypeScript type checking
```

### Database

```bash
npm run db:studio      # Drizzle Studio
npm run db:push        # Push schema changes to DB
npm run db:migrate     # Run migrations
npm run db:generate    # Generate migrations
npm run db:check       # Drizzle migration/schema check
```

### Testing

```bash
npm run test           # All tests (Vitest + Playwright)
npm run test:browser   # Vitest unit/integration tests
npm run test:ui        # Playwright E2E tests

# Single test execution
npm exec vitest run tests/unit/register.test.ts --config=vitest.config.ts
npm exec playwright test tests/e2e/sign-in.spec.ts
```

---

## Server Action Pattern (Extended Example)

```typescript
"use server";

import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const DisconnectBankSchema = z.object({
  bankId: z.string().min(1)
});

export async function disconnectBank(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  const parsed = DisconnectBankSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }

  try {
    await bankDal.delete(parsed.data.bankId);
    revalidatePath("/dashboard");
    return { ok: true };
  } catch {
    console.error("Disconnect bank error");
    return { ok: false, error: "Failed to disconnect bank" };
  }
}
```

---

## Project Structure

```text
Banking/
├── app/
│   ├── (auth)/           # sign-in, sign-up
│   ├── (root)/           # dashboard, protected routes
│   └── api/              # API routes (minimal)
├── components/ui/        # shadcn components
├── lib/
│   ├── actions/          # Server Actions (*.actions.ts)
│   ├── dal/              # Data Access Layer (*.dal.ts)
│   ├── auth.ts           # auth() helper
│   ├── env.ts            # Zod env validation
│   └── encryption.ts     # AES-256-GCM
├── database/
│   ├── db.ts             # DB connection
│   └── schema.ts         # Drizzle schema
└── tests/
    ├── unit/             # Vitest tests
    └── e2e/              # Playwright tests
```

---

## External Documentation

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [NextAuth v4 Documentation](https://next-auth.js.org/)
- [Plaid Documentation](https://plaid.com/docs/)
- [Dwolla Documentation](https://developers.dwolla.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

---

**End of copilot-instructions.md** — See [AGENTS.md](./AGENTS.md) for full documentation.
