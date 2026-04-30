# AGENTS

## Start Here

- This repo uses Bun as the package manager. Use `bun install` and `bun run <script>` by default. The lockfile is `bun.lock` and `package.json` declares `packageManager: bun@1.3.13`.
- `opencode.json` auto-loads this file plus `architecture.md`, `tech-stack.md`, `coding-standards.md`, `folder-structure.md`, `exemplars.md`, `.github/copilot-instructions.md`, and `.cursorrules`. Keep this file short and avoid duplicating those docs.
- **Full instruction index**: See `.opencode/instructions/index.md` for all available instruction files with priority levels.

## Commands That Matter

- Dev server: `bun run dev`
- Build: `bun run build`
- Typecheck: `bun run type-check`
- Lint: `bun run lint:strict`
- Format: `bun run format`
- Rules check: `bun run verify:rules`
- Unit tests: `bun run test:browser`
- E2E tests: `bun run test:ui`
- Full validation: `bun run validate`
- Single Vitest file: `bun exec vitest run tests/path/to/file.test.ts --config=vitest.config.ts`
- Single Playwright spec: `bunx playwright test tests/e2e/path/to/spec.ts --project=chromium`

## Scripts Pattern

Shell scripts in `scripts/` are **orchestrators** — they MUST only call TypeScript or CLI tools. All logic lives in `scripts/ts/`.

Pattern:

- Shell script: `bunx tsx scripts/ts/<path>.ts`
- No embedded logic in shell scripts
- package.json scripts reference TS directly: `bunx tsx scripts/ts/...`

Cross-platform: Keep both `.sh` and `.ps1` for scripts that need both Unix/Windows.

## Non-Obvious Workflow Rules

- If a change touches more than 7 files, add a plan under `.opencode/commands/` before implementation. `scripts/verify-rules.ts` and CI both enforce this with exit code 2 on violations.
- Do not read `process.env` directly in app code. Use `app-config.ts` first, `lib/env.ts` only for compatibility. **Verified exception:** `proxy.ts` reads Upstash env vars directly.
- Keep `app/page.tsx` public and static. `scripts/verify-rules.ts` treats auth calls, direct env reads, and DB/DAL access on the home page as critical violations.
- All writes belong in Server Actions, not API routes. Pattern in `actions/register.ts`: `"use server"`, early auth(), Zod validation, return `{ ok, error? }`, call DAL helpers.
- UI and route components must NOT import DB clients directly. Use `dal/**` helpers exclusively.
- When loading related DB data, avoid N+1 queries. Reference: `dal/transaction.dal.ts` — fetch base rows, batch related IDs with IN clauses, map results back.

## Canonical Reference Files

These files are the authoritative implementations. Always reference them when implementing similar patterns:

| File | Pattern It Implements |
| --- | --- |
| `actions/register.ts` | Server Action with Zod validation, auth, { ok, error? } return |
| `dal/transaction.dal.ts` | N+1 prevention with batch fetching |
| `dal/user.dal.ts` | User CRUD with profile relations |
| `lib/auth-options.ts` | NextAuth v4 JWT configuration |
| `lib/auth.ts` | Server-side session helper |
| `database/schema.ts` | Drizzle ORM schema definitions |

## Testing Patterns

- **Mock tokens:** Use tokens starting with `seed-`, `mock-`, or `mock_` to skip Plaid API calls. See `lib/plaid.ts` (`isMockAccessToken()`).
- **E2E seed user:** `seed-user@example.com` / `password123`
- **Port guard:** Always free port 3000 before running tests:

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

## Architecture Snapshot

- Main app: Next.js 16 App Router with Server Components by default.
- Important runtime flags in `next.config.ts`: `cacheComponents: true`, `typedRoutes: true`, `reactCompiler: true`, `output: "standalone"`.
- Main boundaries:
  - `app/`: routes and server wrappers
  - `actions/`: mutations
  - `dal/`: database reads/writes
  - `database/`: Drizzle schema and DB client
  - `components/`: presentational/UI code

## Test Infrastructure

- `vitest.config.ts` only includes `tests/unit/**/*.test.{ts,tsx,js,jsx}`.
- Playwright is stateful: `workers: 1`, `fullyParallel: false`, starts app via `bun run dev` from `playwright.config.ts`.
- `bun run test:ui` sets `PLAYWRIGHT_PREPARE_DB=true`. `tests/e2e/global-setup.ts` runs `bun run db:push` and `bun run db:seed -- --reset` if DB not prepared.
- E2E requires reachable Postgres `DATABASE_URL`, plus `ENCRYPTION_KEY` and `NEXTAUTH_SECRET`.

## Verification Order

- Preferred local check sequence for app changes: `bun run format && bun run type-check && bun run lint:strict && bun run verify:rules`
- Use `bun run build` and `bun run test` when the change affects runtime behavior, routing, auth, or persistence.

## Pre-Commit Hooks

The repo uses Husky (configured in `.husky/`). On `git commit`, hooks run automatically. Key hooks:

- `verify-rules.ts` — AST-based policy enforcement (same as CI)
- `lint-staged` — Format and lint only staged files
- Do not bypass hooks with `--no-verify` unless explicitly instructed by the user.

## Learned User Preferences

- When the user provides an attached implementation plan with existing todos, execute the plan as written, do not edit the plan file, and progress existing todos in order while working.

## Learned Workspace Facts

- The repo already enforces clearing listeners on port `3000` before Playwright/Vitest runs through the always-applied test runner guard rule.

## Repository Map

A full codemap is available at `codemap.md` in the project root.

Before working on any task, read `codemap.md` to understand:

- Project architecture and entry points
- Directory responsibilities and design patterns
- Data flow and integration points between modules

For deep work on a specific folder, also read that folder's `codemap.md`.

## Plugin & Skills Discovery

**Plugins** are auto-discovered from `opencode.json`. List available with `opencode_sync` or view in `.opencode/plugins/`.

**Skills** provide specialized instructions. Use `get_available_skills` tool to list all available skills for this project.

The Superpowers plugin provides the primary agent workflow with skills for brainstorming, planning, debugging, and code review. Skills trigger automatically based on context.

## Plans

Implementation plans tracked in `.opencode/commands/`. Read with `readPlan` tool.

Key active plans:

- `cleanup-dead-code` — Cleanup dead code and duplicate tests
- `fix-lint-strict` — Automated and manual lint fixes
- `opencode-tools-debug` — Stabilize agent tooling stack
- `playwright-e2e-fix` — UI suite reliability work

## Instruction Hierarchy

Instruction files are organized by priority:

| Priority   | Meaning                             |
| ---------- | ----------------------------------- |
| **high**   | Must read before any implementation |
| **medium** | Reference during implementation     |
| **low**    | Optional, for optimization tasks    |

All instruction files include YAML frontmatter with `description`, `applyTo`, `priority`, `canonicalSource`, and `lastReviewed`.

## Key Resources

- Full skills list: `get_available_skills` tool
- Plugin READMEs: `.opencode/plugins/*/README.md`
- Instruction index: `.opencode/instructions/index.md`
- Context7 docs: Use `context7_resolve_library_id` tool
