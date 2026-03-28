---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---

<!-- Based on/Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/nextjs.instructions.md -->

# Copilot Coding & Project Instructions for Next.js Banking App

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
- Zero TypeScript errors (npm run type-check)
Reference: docs/dev.content.md sections 14, 17, 18, 25
```

### Debugger Persona

```
You are debugging a Banking issue. Process:
1. Reproduce with minimal test case
2. Check console + Next.js MCP for runtime errors
3. Verify auth state (auth() in Server Components)
4. Check DAL queries (Drizzle Studio: npm run db:studio)
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
- **Use `npm run type-check` after each batch** to catch issues early
- **Keep prompts under 500 words** — reference docs instead of quoting

---

## Build, Test, and Lint Commands

- **Install dependencies:** `npm install`
- **Start dev server:** `npm run dev`
- **Production build:** `npm run build`
- **Start production server:** `npm run start`
- **Lint:** `npm run lint` / `npm run lint:fix` / `npm run lint:strict`
- **Format:** `npm run format` / `npm run format:check`
- **Type check:** `npm run type-check`
- **Run all tests:** `npm run test`
- **Unit/integration tests:** `npm run test:browser`
- **E2E tests:** `npm run test:ui`
- **Single test file:**
  - Vitest: `npm exec vitest run path/to/test.test.ts --config=vitest.browser.config.ts`
  - Playwright: `npm exec playwright test path/to/spec.spec.ts`

## High-Level Architecture

- **Framework:** Next.js 16 (App Router, TypeScript strict mode)
- **Core folders:**
  - `app/`: Routing, layouts, route groups (e.g., (auth), (root)), API routes (prefer Server Actions)
  - `components/`: Reusable UI (shadcn/ui, Tailwind CSS)
  - `lib/`: Shared logic, utilities, server actions, integrations (Plaid, Dwolla)
  - `types/`, `constants/`: TypeScript types and app constants
  - `tests/`: Co-located unit (Vitest) and E2E (Playwright) tests
- **Key flows:**
  - Auth via Drizzle ORM + NextAuth, bank linking via Plaid, transfers via Dwolla
  - All mutations use Server Actions, not API routes
  - Real-time updates and eager loading of relations

## Key Conventions

- Use absolute imports with `@/` alias (see `tsconfig.json`)
- Never use `any` or raw `process.env`; use explicit types and a typed env utility
- Use Sentry for error monitoring, Zod for validation, React Hook Form for forms
- Always co-locate tests with the code they test
- Use Tailwind CSS and shadcn/ui for all UI
- Naming: PascalCase for components, camelCase for hooks/utils, UPPER_SNAKE_CASE for constants, kebab-case for files/folders
- **All PRs must pass lint, type-check, and test gates before merging**
- All tests must pass with 100% success before merging
- All mutations use Server Actions, not API routes

## Agent Standards

- See `AGENTS.md` for agent-specific coding, review, and automation standards

See `.github/instructions/`, `README.md`, and `AGENTS.md` for more details and topic-specific standards.
