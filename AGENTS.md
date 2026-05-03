# AGENTS

## Start Here

- **Package manager: Bun.** `bun install`, `bun run <script>`. Lockfile: `bun.lock`. package.json declares `packageManager: bun@1.3.13`.
- These docs auto-load: `architecture.md`, `tech-stack.md`, `coding-standards.md`, `folder-structure.md`, `exemplars.md`, `.github/copilot-instructions.md`, and `.cursorrules`.
- **Full instruction index**: `.opencode/instructions/index.md` with priority levels (high/medium/low).

## Commands That Matter

| Task | Command |
| --- | --- |
| Dev server | `bun run dev` (port 3000) |
| Build | `bun run build` |
| Typecheck | `bun run type-check` |
| Lint | `bun run lint:strict` |
| Format | `bun run format` |
| Rules check | `bun run verify:rules` |
| Unit tests | `bun run test:browser` |
| E2E tests | `bun run test:ui` |
| Full validation | `bun run validate` |
| Single Vitest file | `bun exec vitest run tests/path/to/file.test.ts --config=vitest.config.ts` |
| Single Playwright spec | `bunx playwright test tests/e2e/path/to/spec.ts --project=chromium` |
| DB push | `bun run db:push` |
| DB seed | `bun run db:seed` |

**Local check sequence:** `bun run format && bun run type-check && bun run lint:strict && bun run verify:rules`

Use `bun run build` and `bun run test` when change affects runtime, routing, auth, or persistence.

## Scripts Pattern

Shell scripts in `scripts/` are **orchestrators** — they MUST only call TypeScript or CLI tools. All logic lives in `scripts/ts/`.

- Shell script: `bunx tsx scripts/ts/<path>.ts`
- No embedded logic in shell scripts
- package.json scripts reference TS directly: `bunx tsx scripts/...`
- Cross-platform: Keep both `.sh` and `.ps1` for scripts needing Unix/Windows.

## Non-Obvious Workflow Rules

- **Do not read `process.env` directly in app code.** Use `app-config.ts` first, `lib/env.ts` only for compatibility. **Verified exception:** `proxy.ts` reads Upstash env vars directly.
- **Keep `app/page.tsx` public and static.** `scripts/verify-rules.ts` treats auth calls, direct env reads, and DB/DAL access on the home page as critical violations.
- **All writes belong in Server Actions, not API routes.** Pattern in `actions/register.ts`: `"use server"`, early `auth()`, Zod validation, return `{ ok, error? }`, call DAL helpers.
- **UI and route components must NOT import DB clients directly.** Use `dal/**` helpers exclusively.
- **Avoid N+1 queries.** Reference `dal/transaction.dal.ts` — fetch base rows, batch related IDs with IN clauses, map results back.
- **If a change touches >7 files, add a plan under `.opencode/commands/` before implementation.** `scripts/verify-rules.ts` and CI both enforce this (exit code 2).

## Canonical Reference Files

| File | Pattern |
| --- | --- |
| `actions/register.ts` | Server Action: `"use server"`, auth(), Zod validation, `{ ok, error? }` return |
| `dal/transaction.dal.ts` | N+1 prevention with batch fetching |
| `dal/user.dal.ts` | User CRUD with profile relations |
| `lib/auth-options.ts` | NextAuth v4 JWT configuration |
| `lib/auth.ts` | Server-side session helper |
| `database/schema.ts` | Drizzle ORM schema definitions |

## Architecture Snapshot

- **Framework:** Next.js 16 App Router, React 19, Server Components by default
- **Next.js flags** (`next.config.ts`): `cacheComponents: true`, `typedRoutes: true`, `reactCompiler: true`, `output: "standalone"`
- **Key directories:**
  - `app/` — routes and server wrappers
  - `actions/` — Server Actions (mutations)
  - `dal/` — Data Access Layer (DB reads/writes)
  - `database/` — Drizzle schema and DB client
  - `components/` — UI components (`layouts/` = presentational, `ui/` = primitives)

## Testing

**Mock tokens:** Use tokens starting with `seed-`, `mock-`, or `mock_` to skip Plaid API calls. See `lib/plaid.ts` (`isMockAccessToken()`).

**E2E seed user:** `seed-user@example.com` / `password123`

**Port guard:** Free port 3000 before running tests:
```powershell
$pids = Get-NetTCPConnection -LocalPort 3k -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

**Test infrastructure:**
- Vitest: `vitest.config.ts` only includes `tests/unit/**/*.test.{ts,tsx,js,jsx}`.
- Playwright: stateful (`workers: 1`, `fullyParallel: false`). Starts app via `bun run dev` from `playwright.config.ts`.
- `bun run test:ui` sets `PLAYWRIGHT_PREPARE_DB=true`. `tests/e2e/global-setup.ts` runs `bun run db:push` and `bun run db:seed -- --reset` if DB not prepared.
- E2E requires: reachable Postgres (`DATABASE_URL`), `ENCRYPTION_KEY`, `NEXTAUTH_SECRET`.

## Pre-Commit Hooks

Repo uses Husky (`.husky/`). On `git commit`, hooks run automatically.

- `verify-rules.ts` — AST-based policy enforcement (same as CI)
- `lint-staged` — Format and lint only staged files
- **Do not bypass hooks with `--no-verify`** unless explicitly instructed by the user.

## Learned User Preferences

- When user provides an attached implementation plan with existing todos, execute the plan as written. Do not edit the plan file. Progress existing todos in order while working.
- Repo already enforces clearing listeners on port 3000 before Playwright/Vitest runs via the always-applied test runner guard rule.

## Repository Map

Read `codemap.md` before working on any task to understand:

- Project architecture and entry points
- Directory responsibilities and design patterns
- Data flow and integration points between modules

For deep work on a specific folder, also read that folder's `codemap.md`.

## Plugin & Skills Discovery

**Plugins** auto-discovered from `opencode.json`. List available with `opencode__sync` or view in `.opencode/plugins/`.

**Skills** provide specialized instructions. Use `get_available_skills` tool to list all available skills.

## Key Resources

- Full skills list: `get_available_skills` tool
- Plugin READMEs: `.opencode/plugins/*/README.md`
- Instruction index: `.opencode/instructions/index.md`
- Context7 docs: Use `context7_resolve_library_id` tool