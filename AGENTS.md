# Agent Coding Standards - Banking App

## Project Overview

This is a Next.js 16.2.1 banking application using TypeScript, Tailwind CSS, and pnpm.

## Personas

Use these personas when running tasks in Copilot CLI to get specialized behavior:

### Architect Persona

```
You are a senior software architect for Banking. Focus on:
- System design decisions and tradeoffs
- Data flow optimization (Server → DAL → Client)
- Database schema design with proper indexes and composite keys
- Scalability patterns (batch processing, caching, lazy loading)
Reference: docs/dev.content.md sections 3, 6, 22, 24
```

### Implementer Persona

```
You are a senior full-stack developer implementing Banking features. Follow:
- Server Components by default, "use client" only for interactivity
- DAL pattern for ALL reads (BaseDal<T>, .with() for eager loading)
- Server Actions for ALL mutations (auth → validate → DAL → revalidate)
- React Compiler is ON — never use useMemo/useCallback/memo()
- searchParams and params are Promise types — always await
Reference: docs/dev.content.md sections 7-9, 14, 23
```

### Reviewer Persona

```
You are a code reviewer for Banking PRs. Check:
- Type safety (no `any`, use unknown + type guards for external data)
- N+1 queries (must use .with() or single JOIN, never loop+query)
- Auth in Server Actions (auth() must be first call)
- Tailwind v4 syntax (bg-linear-to-br, aspect-2/3)
- Zero TypeScript errors (pnpm type-check)
Reference: docs/dev.content.md sections 14, 17, 18, 25
```

### Debugger Persona

```
You are debugging a Banking issue. Process:
1. Reproduce with minimal test case
2. Check console + Next.js MCP for runtime errors
3. Verify auth state (auth() in Server Components)
4. Check DAL queries (Drizzle Studio: pnpm db:studio)
5. Verify env variables (Zod validation in src/lib/env.ts)
Reference: docs/dev.content.md sections 5, 20, 25
```

---

## 10. 🔄 Anti-Rate-Limiting Strategy

When using this prompt with Copilot CLI, follow these practices to avoid token exhaustion:

### Chunked Execution

1. **Never paste full documentation files into a prompt** — reference by path
2. **Work in focused phases** — one feature/section at a time
3. **Use section numbers** — "Implement pattern from Section 23.2" instead of quoting code
4. **Batch related changes** — edit multiple files in one turn, not sequential turns

### Efficient Prompting

```bash
# ✅ Good: Reference by section
"Add reading progress tracking using the idempotent upsert pattern from docs/dev.content.md Section 23.2"

# ❌ Bad: Paste entire code blocks into prompt
"Here's the full schema... [500 lines] ... now implement this"

# ✅ Good: Focused task with persona
"As Implementer, add a DAL method for comic search following docs/dev.content.md Section 22.4"

# ❌ Bad: Open-ended request
"Implement all features for the entire application"
```

### Session Management

- **Start fresh sessions** for each phase (Foundation → Features → QA → Deploy)
- **Commit between phases** to save state and reduce context window
- **Use `pnpm type-check` after each batch** to catch issues early
- **Keep prompts under 500 words** — reference docs instead of quoting

---

## Build/Lint/Test Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server

# Linting & Formatting
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix auto-fixable lint issues
pnpm lint:fix:all     # Fix all issues (directive, problem, suggestion, layout)
pnpm lint:strict      # Lint with zero warnings allowed
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting without modifying

# Type Checking
pnpm type-check       # Run TypeScript compiler
pnpm type-check:watch  # Watch mode for type checking
pnpm type-gen         # Generate Next.js types

# Testing
pnpm test             # Run all tests (browser + E2E)
pnpm test:browser     # Unit/integration tests (Vitest + Playwright)
pnpm test:ui          # E2E tests (Playwright)

# Single test files
pnpm exec vitest run path/to/test.test.ts --config=vitest.browser.config.ts
pnpm exec playwright test path/to/spec.spec.ts
```

## Code Style Guidelines

### General Conventions

- Use **TypeScript strict mode** (enabled in tsconfig.json)
- **Never use `any`;** prefer explicit types or `unknown`
- **Never use raw `process.env`;** use a typed env utility
- Use **pnpm** for all dependency management
- Enforce **lint, type-check, and test gates** before merging

### Naming Conventions

| Type          | Convention       | Example                           |
| ------------- | ---------------- | --------------------------------- |
| Components    | PascalCase       | `BankCard.tsx`, `AuthForm.tsx`    |
| Hooks/Utils   | camelCase        | `useAuth()`, `formatAmount()`     |
| Constants     | UPPER_SNAKE_CASE | `TEST_USER_ID`, `MAX_RETRY_COUNT` |
| Files/folders | kebab-case       | `my-banks/`, `total-balance.tsx`  |
| CSS classes   | kebab-case       | `text-16`, `bank-card_content`    |

### File Structure

```
app/                    # Next.js App Router pages
  (auth)/              # Auth route group
  (root)/              # Main app route group
  api/                 # API routes (prefer Server Actions)
  global-error.tsx
  layout.tsx
  globals.css

components/             # Reusable UI components
  ui/                   # shadcn/ui primitives
  BankCard.tsx

  lib/                    # Shared logic, utilities
    utils.ts              # cn(), format functions
    plaid.ts
    actions/              # Server actions

types/                  # TypeScript type definitions
constants/               # App constants
tests/
  unit/                 # Vitest browser tests (co-located with components)
  e2e/                   # Playwright E2E tests
```

### Imports

- Use absolute imports with `@/` alias (configured in tsconfig.json)
- Order imports: 1) React, 2) external libs, 3) internal modules
- Use `import type` for type-only imports when appropriate

```typescript
// Correct
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Type-only imports
import type { Metadata } from "next";
```

### Formatting (Prettier)

| Option        | Value    |
| ------------- | -------- |
| printWidth    | 80       |
| tabWidth      | 2        |
| useTabs       | false    |
| semi          | true     |
| singleQuote   | false    |
| trailingComma | "all"    |
| arrowParens   | "always" |
| endOfLine     | "lf"     |

### Component Patterns

- Use **Server Components** by default; add `'use client'` only when needed
- Prefer **Server Actions** for mutations over API routes
- Use **shadcn/ui** components for consistency
- Use `React.forwardRef` for reusable components that accept refs
- Set `displayName` for all exported components

```typescript
// Component pattern with forwardRef
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />;
  },
);
Button.displayName = "Button";
```

### CSS & Tailwind

- Use Tailwind CSS for all styling
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Custom Tailwind classes in `app/globals.css`
- Predefined utility classes for colors: `bg-blue-25`, `text-success-700`, etc.

### Error Handling

- Use **Sentry** for error monitoring
- Validate all inputs with **Zod** schemas
- Return proper error responses from Server Actions
- Use `try/catch` with descriptive error messages

### Testing Standards

- **Co-locate tests** with the code they test
- Use descriptive test names: `test("renders name", async () => {...})`
- Use `test.step()` in E2E tests for readability
- Mock external dependencies (database, auth, Drizzle ORM, NextAuth)
- 100% pass rate required before merging

```typescript
// Unit test pattern (Vitest + browser)
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

test("renders name", async () => {
  const { getByText } = await render(<HelloWorld name="Vitest" />);
  await expect.element(getByText("Hello Vitest!")).toBeInTheDocument();
});

// E2E test pattern (Playwright)
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://example.com/");
  await expect(page).toHaveTitle(/Example/);
});
```

### State Management

- Use **React Hook Form** with **Zod** validation for forms. Use **Server Components** for data fetching. Use **Server Actions** for mutations (never API routes).

### Accessibility

- Use semantic HTML elements
- Add ARIA attributes where needed
- Ensure keyboard navigation works
- Test with screen readers

### Performance

- Use built-in Next.js optimizations for images/fonts
- Prefer **Cache Components** for memoization
- Lazy load components with `next/dynamic` when appropriate
- Always eager load relations in DAL queries

## CI/CD Gates

Before any PR merge:

1. `pnpm lint:strict` passes with zero warnings
2. `pnpm type-check` passes
3. `pnpm test` passes with 100% success rate
