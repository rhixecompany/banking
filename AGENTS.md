# Agent Coding Standards - Banking App

## Project Overview

This is a Next.js 16.2.1 banking application using TypeScript, Tailwind CSS v4, Drizzle ORM, NextAuth, and npm.

## Personas

Use these personas when running tasks to get specialized behavior:

### Architect Persona

Focus on: system design decisions, data flow optimization (Server → DAL → Client), database schema design with proper indexes, scalability patterns.

### Implementer Persona

Focus on: Server Components by default ("use client" only for interactivity), DAL pattern for ALL reads (BaseDal<T>, .with() for eager loading), Server Actions for all mutations (auth → validate → DAL → revalidate), React Compiler is ON (never use useMemo/useCallback/memo()).

### Reviewer Persona

Focus on: Type safety (no `any`, use unknown + type guards), N+1 queries (must use .with() or single JOIN), auth in Server Actions (auth() must be first call), Tailwind v4 syntax, zero TypeScript errors.

### Debugger Persona

Focus on: Reproduce with minimal test case, check console for runtime errors, verify auth state (auth() in Server Components), check DAL queries (npm run db:studio), verify env variables (Zod validation in lib/env.ts).

---

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run validate         # Run format, type-check, lint, and test

# Database (Drizzle)
npm run db:studio        # Open Drizzle Studio
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:generate      # Generate migrations

# Linting & Formatting
npm run lint             # Run ESLint
npm run lint:fix         # Fix auto-fixable lint issues
npm run lint:strict      # Lint with zero warnings allowed
npm run format           # Format with Prettier
npm run format:check     # Check formatting without modifying

# Type Checking
npm run type-check       # Run TypeScript compiler
npm run type-gen         # Generate Next.js types

# Testing
npm run test             # Run all tests (browser + E2E)
npm run test:browser     # Unit/integration tests (Vitest)
npm run test:ui          # E2E tests (Playwright)

# Single test files
npm exec vitest run path/to/test.test.ts
npm exec playwright test path/to/spec.spec.ts
```

---

## Code Style Guidelines

### General Conventions

- Use **TypeScript strict mode** (enabled in tsconfig.json)
- **Never use `any`**; prefer explicit types or `unknown`
- **Never use raw `process.env`**; use typed env utility from `@/lib/env`
- Use **npm** for all dependency management
- Enforce **lint, type-check, and test gates** before merging

### Naming Conventions

| Type          | Convention       | Example                      |
| ------------- | ---------------- | ---------------------------- |
| Components    | PascalCase       | `BankCard.tsx`, `AuthForm`   |
| Hooks/Utils   | camelCase        | `useAuth()`, `formatAmount`  |
| Constants     | UPPER_SNAKE_CASE | `TEST_USER_ID`, `MAX_RETRY`  |
| Files/folders | kebab-case       | `my-banks/`, `total-balance` |
| CSS classes   | kebab-case       | `text-16`, `bank-card`       |

### File Structure

```
app/                    # Next.js App Router pages
  (auth)/              # Auth route group (sign-in, sign-up)
  (root)/              # Main app route group (dashboard, settings)
  api/                 # API routes (prefer Server Actions)
  layout.tsx           # Root layout
  globals.css          # Tailwind CSS

components/           # Reusable UI components
  ui/                  # shadcn/ui primitives
  *.tsx               # Custom components

lib/                   # Shared logic
  actions/             # Server actions
  dal/                 # Data Access Layer
  utils.ts             # cn(), format functions
  auth.ts              # NextAuth helper

database/              # Drizzle ORM
  schema.ts           # Database schema

types/                 # TypeScript type definitions
constants/             # App constants
tests/
  unit/               # Vitest tests (co-located)
  e2e/                # Playwright E2E tests
```

### Imports

- Use absolute imports with `@/` alias
- Order: 1) React, 2) external libs, 3) internal modules
- Use `import type` for type-only imports

```typescript
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Metadata } from "next";
```

### Formatting (Prettier)

- printWidth: 80, tabWidth: 2, semi: true, singleQuote: false, trailingComma: "all"

### Component Patterns

- Use **Server Components** by default; add `'use client'` only for interactivity
- Prefer **Server Actions** for mutations over API routes
- Use **shadcn/ui** components for consistency
- Use `React.forwardRef` for reusable components with refs

### CSS & Tailwind

- Use Tailwind CSS v4 for all styling
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Tailwind v4 syntax: `bg-linear-to-br`, `aspect-2/3`

### Error Handling

- Use **Sentry** for error monitoring
- Validate all inputs with **Zod** schemas
- Return proper error responses from Server Actions
- Use `try/catch` with descriptive error messages

### State Management

- Use **React Hook Form** with **Zod** for forms
- Server Components for data fetching
- Server Actions for mutations (never API routes)

### Testing Standards

- **Co-locate tests** with the code they test
- Use descriptive test names: `test("renders name", async () => {...})`
- Mock external dependencies (database, auth, Drizzle ORM)
- 100% pass rate required before merging

---

## Anti-Rate-Limiting Strategy

When using agentic coding tools:

1. **Never paste full documentation files** — reference by path
2. **Work in focused phases** — one feature/section at a time
3. **Batch related changes** — edit multiple files in one turn
4. **Start fresh sessions** for each major phase
5. **Use `npm run type-check` after each batch** to catch issues early
6. **Keep prompts under 500 words** — reference docs instead of quoting
