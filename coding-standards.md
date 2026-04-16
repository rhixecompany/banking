# Coding Style & Formatting Standards

Purpose

- Provide concrete, enforceable rules and commands so contributions are consistent across the repository.

Formatting (Prettier)

- Use the project's Prettier configuration: `.prettierrc.ts`
- Format before committing:
  - `npm run format`
- CI check/PR requirement:
  - `npm run format:check`
- Prettier rules highlights:
  - `printWidth: 80`
  - `trailingComma: all`
  - `semi: true`
  - `tabWidth: 2`
  - `arrowParens: always`

Linting & Static Analysis (ESLint)

- Use ESLint config in `eslint.config.mts` (project canonical rules).
- Run locally:
  - `npm run lint`
  - Fix automatically when possible: `npm run lint:fix`
- CI gate: `npm run lint:strict`
- Do NOT modify `eslint.config.mts` as a shortcut to silence issues — fix code instead.

TypeScript

- `tsconfig.json` has `strict: true`. Always run:
  - `npm run type-check`
- Prefer typed interfaces and avoid `any`; if necessary, document why `any` is used.
- Use Zod for runtime validation and schema inference where input crosses boundary (client -> server).

Naming Conventions

- Files:
  - Use kebab-case or camelCase as appropriate (eslint unicorn/filename-case covers allowed forms)
  - Server wrappers: `<feature>-server-wrapper.tsx`
  - Client wrappers: `<feature>-client-wrapper.tsx`
  - DAL files: `<entity>.dal.ts`
  - Actions: `<feature>.actions.ts`
- Exports:
  - Prefer named exports. Use default only when module is a single React component file and consistent with surrounding files.

Server / Client Rules

- `"use server"` for server actions and server components.
- `"use client"` for client components.
- DO NOT import server-only modules (actions, dal) into client components. Instead:
  - Create a server wrapper that passes the server action as a prop to the client wrapper (see exemplars.md for pattern).
- Server Actions must:
  - Be `"use server"`
  - Validate input with Zod
  - Return `{ ok: boolean; error?: string }`
  - Revalidate paths after successful mutations.

Error Handling & Logging

- Prefer structured error returns for server actions. Example:
  - `return { ok: false, error: "User not found" }`
- Use `console.error` in server actions as allowed by lint configs; include contextual information.
- Sanitize logs and never print secrets.

Testing

- Unit tests: Vitest (`tests/unit/`)
  - Mock `auth()` and DAL where DB persistence is not needed
- E2E tests: Playwright (`tests/e2e/`)
  - Use `tests/e2e/helpers` for shared logic (`plaid.mock.ts`, dwolla helpers)
  - Seed DB in global-setup with `PLAYWRIGHT_PREPARE_DB=true`
  - Stub Plaid client with `page.addInitScript` BEFORE `page.goto`
- Test fixtures and helpers should live in `tests/fixtures/` and `tests/e2e/helpers/`.

Security & Secrets

- Never commit `.env` or credentials. Use `app-config.ts` / `lib/env.ts` to read env vars.
- Required in production: `ENCRYPTION_KEY`, `NEXTAUTH_SECRET`
- For database and seeding operations, follow the seed runner flags to prevent accidental destructive runs:
  - `scripts/seed/run.ts` requires `RUN_DESTRUCTIVE` plus explicit flags for resets.

Pull Requests & Validation

- Before opening a PR:
  1. `npm run format`
  2. `npm run type-check`
  3. `npm run lint:strict`
  4. `npm run test` (or run relevant test subsets)
- If the change touches >3 files, create a plan file at `.opencode/commands/<short-kebab-task>.plan.md` (follow `AGENTS.md` rules).
- Branch name suggestion for docs: `docs/architecture-and-standards`

Anti-patterns (things to avoid)

- Direct DB access from components or client code.
- Importing actions/dal directly in client components.
- Committing secrets to the repo.
- Silencing lint rules by changing config instead of fixing code.
