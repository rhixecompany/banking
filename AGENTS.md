# AGENTS

## Start Here

- This repo uses Bun as the package manager. Use `bun install` and `bun run <script>` by default. The lockfile is `bun.lock` and `package.json` declares `packageManager: bun@1.3.13`.
- `opencode.json` auto-loads this file plus `architecture.md`, `tech-stack.md`, `coding-standards.md`, `folder-structure.md`, `exemplars.md`, `.github/copilot-instructions.md`, and `.cursorrules`. Keep this file short and avoid duplicating those docs.

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
- Single Vitest file: `npm exec vitest run tests/path/to/file.test.ts --config=vitest.config.ts`
- Single Playwright spec: `npx playwright test tests/e2e/path/to/spec.ts --project=chromium`

## Non-Obvious Workflow Rules

- If a change touches more than 7 files, add a plan under `.opencode/commands/` before implementation. `scripts/verify-rules.ts` and CI both enforce this.
- Do not read `process.env` directly in app code. Use `app-config.ts` first, `lib/env.ts` only for compatibility. Verified exception: `proxy.ts` reads Upstash env vars directly.
- Keep `app/page.tsx` public and static. `scripts/verify-rules.ts` treats auth calls, direct env reads, and DB/DAL access on the home page as critical violations.
- All writes belong in Server Actions, not API routes. In `actions/**`, follow the enforced pattern: `"use server"`, authenticate early when protected, validate with Zod, return `{ ok, error? }`, and call DAL helpers.
- UI and route components should not import DB clients directly. DB access is expected through `dal/**` helpers.
- When loading related DB data, avoid N+1 queries. `dal/transaction.dal.ts` is the reference pattern: fetch base rows, batch related IDs, map results back.

## Architecture Snapshot

- Main app: Next.js 16 App Router with Server Components by default.
- Important runtime flags in `next.config.ts`: `cacheComponents: true`, `typedRoutes: true`, `reactCompiler: true`, `output: "standalone"`.
- Main boundaries:
  - `app/`: routes and server wrappers
  - `actions/`: mutations
  - `dal/`: database reads/writes
  - `database/`: Drizzle schema and DB client
  - `components/`: presentational/UI code

## Testing Gotchas

- Free port 3000 before running Playwright or Vitest. Use:

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

- `vitest.config.ts` only includes `tests/unit/**/*.test.{ts,tsx,js,jsx}`.
- Playwright is stateful here: `workers: 1`, `fullyParallel: false`, and it starts the app through `npm run dev` from `playwright.config.ts`. Do not casually rewrite those script invocations to Bun without checking test behavior.
- `bun run test:ui` sets `PLAYWRIGHT_PREPARE_DB=true`. `tests/e2e/global-setup.ts` will then run `npm run db:push` and `npm run db:seed -- --reset` if the DB is not prepared.
- E2E requires a reachable Postgres `DATABASE_URL`, plus `ENCRYPTION_KEY` and `NEXTAUTH_SECRET`. Seeded auth uses `seed-user@example.com` / `password123`.

## Verification Order

- Preferred local check sequence for app changes: `bun run format && bun run type-check && bun run lint:strict && bun run verify:rules`
- Use `bun run build` and `bun run test` when the change affects runtime behavior, routing, auth, or persistence.

## Learned User Preferences

- When the user provides an attached implementation plan with existing todos, execute the plan as written, do not edit the plan file, and progress existing todos in order while working.

## Learned Workspace Facts

- The repo already enforces clearing listeners on port `3000` before Playwright/Vitest runs through the always-applied test runner guard rule.
