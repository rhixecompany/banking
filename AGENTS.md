# AGENTS.md — Banking Project (Canonical Agent Guide)

Version: 11.3 | Updated: 2026-04-13

Purpose

- Short, high-signal rules for humans and automated agents working in this repo. Keep this file minimal — only include facts an agent would likely miss.

Must-know commands (exact — run with the repo package manager)

- npm run dev — Start dev server (predev runs clean)
- npm run build — Production build (prebuild runs clean + type-check)
- npm run start — Start production server
- npm run clean — Clean build artifacts
- npm run validate — build + lint:strict + test (CI gate; expensive)
- npm run lint:strict — ESLint (ZERO warnings required for PRs)
- npm run type-check — TypeScript check (tsc --noEmit)
- npm run test — Runs test:ui THEN test:browser (order matters)
- npm run test:ui — Playwright E2E (Chromium, single worker). Starts dev server; ensure port 3000 is free.
- npm run test:browser — Vitest unit tests (happy-dom)
- npm run db:push — Push Drizzle schema
- npm run db:studio — Open Drizzle Studio (local)
- npm run registry:build — Regenerate .opencode registry files

Pre/post hooks and ordering

- predev / prebuild: run clean + type-check automatically. Type-check is assumed before build.
- pretest: runs clean. Tests assume a clean workspace.

Env / config gotchas

- Do NOT read process.env in app code. Use app-config.ts (preferred) or lib/env.ts. Exception: proxy.ts (Edge middleware) may read process.env.
- Production required: ENCRYPTION_KEY, NEXTAUTH_SECRET.
- Drizzle migrations: .env.local is loaded before .env (see drizzle.config.ts).

PR-blocking rules (enforced)

- No use of `any`. Use `unknown` + type guards. Type errors are blocking.
- Zero TypeScript errors and ZERO ESLint warnings (run npm run lint:strict).
- All DB access must go through dal/ — never query the DB from components or Server Actions directly.
- Avoid N+1 queries; eager-load relations (JOINs) — never perform DB calls inside loops.
- All stateful mutations must be Server Actions in actions/ (no write logic in API routes).
- Do NOT commit secrets (.env, tokens). eslint-plugin-no-secrets is enabled (warn-level).

Server Actions / validation

- Server Actions must use "use server" and return Promise<{ ok: boolean; error?: string }>.
- Validate inputs with Zod before any DB or external API call. Zod rules require .describe(...) and validator messages.
- After mutations revalidate cache with revalidatePath / revalidateTag / updateTag as appropriate.

Database / Drizzle

- Use db.transaction(...) for multi-step operations.
- database/ and dal/ files have stricter lint rules (e.g., update/delete must include WHERE).
- lib/encryption.ts expects ENCRYPTION_KEY and uses format iv:authTag:ciphertext (hex, colon-separated).

Auth / sessions

- Use lib/auth() to get the server session. Session.user shape: { id: string; name?: string | null; email?: string | null; isAdmin: boolean; isActive: boolean }.
- There is NO role field — check session.user.isAdmin for admin-only checks.

Testing notes (important)

- npm run test runs E2E first (test:ui) then unit tests (test:browser). E2E starts the dev server — ensure port 3000 is free.
- Playwright runs with a single worker and Chromium only; tests assume shared state (do not parallelize locally).
- On Windows, free port 3000 before Playwright (PowerShell): $p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select -ExpandProperty OwningProcess -Unique; if ($p) { Stop-Process -Id $p -Force }

Formatting / lint / pre-PR checklist

- Before opening a PR run: npm run format, npm run type-check, npm run lint:strict. Run tests for behavior changes.
- Avoid broad ESLint disables; check eslint.config.mts for file-specific overrides first.

Common Next.js / App Router patterns (must follow)

- Always use the App Router (app/) for new routes and pages.
- Server Components by default. Mark Client Components explicitly with "use client".
- In Next.js 16+: params and searchParams are async types — always await them in page/layout functions and generateMetadata. (e.g., const { id } = await params;)
- Use "use cache" directive for components that benefit from Partial Pre-Rendering (PPR).
- Implement loading states via loading.tsx and Suspense boundaries.
- Implement error boundaries using error.tsx for route segments; use not-found.tsx for 404s.
- Use next/font/google or next/font/local at layout level for font optimization.
- Use next/image for images with width, height, alt. Follow v16 image defaults in docs.
- Turbopack is the default bundler for Next.js 16 — typically no manual config needed.

Cache Components & Caching APIs (Next.js 16+)

- Use "use cache" for cache components and cacheLife() where applicable.
- For server-side cache control and invalidation use: revalidatePath, revalidateTag, updateTag, refresh from next/cache.
- When using fetch in Server Components, pass next: { revalidate: <seconds> } or tags for revalidation.

Routing & Layouts

- Use nested layouts, templates, and route groups (group syntax) for URL-agnostic layout boundaries.
- Implement parallel routes (@folder) for independent UI regions (e.g. dashboard sidebars).
- Use intercepting routes for overlays and modals.

Server & Client components guidance

- Use Server Components for data fetching and non-interactive UI.
- Use Client Components ("use client") for interactivity, browser APIs, hooks, or local component state.
- Prefer small client wrappers when converting interactive third-party components for RSC usage.

Data fetching & streaming

- Server Components for fetching; use fetch with next caching options for revalidation.
- Use Suspense boundaries and streaming to improve perceived performance.

Zod validation & forms

- Zod schemas must include .describe(...) metadata for fields.
- All validators must include error messages for user-facing feedback.
- Use react-hook-form + zodResolver in client forms and follow UI composition rules (FieldGroup / Field).

shadcn/ui & UI Component Patterns

- Use existing shadcn components from components/ui first — do not recreate UI if a component is available.
- Components requiring interactivity must be used in client components ("use client"), otherwise prefer server components.
- Follow the project's component composition rules (FieldGroup/Field, CardHeader/CardContent, etc.) and Tailwind v4 conventions (gap-_ not space-y-_, size-\* for equal dims, semantic tokens).
- When adding/updating shadcn components:
  - Use the CLI (npx shadcn@latest) with the project's package manager runner.
  - Always preview with --dry-run and --diff before applying updates.
  - Fix icon imports to use the project's iconLibrary (lucide-react).

DAL patterns / N+1 prevention

- All DB queries must use dal/ helpers. Avoid writing DB queries directly in components or Server Actions.
- Use single queries with JOINs to fetch related data. Never loop and query per item.

Playwright deterministic auth pattern (adopted)

- Tests should prefer a deterministic auth fixture (signed NextAuth cookie/JWT + guarded test-only endpoint) instead of performing UI sign-in.
- Test-only endpoints must be gated with environment guards (NODE_ENV !== "production" and/or ENABLE_TEST_ENDPOINTS).

Server Actions & return shape

- Server Actions should always return: Promise<{ ok: boolean; error?: string }>.
- Validate with Zod first, then call DAL, update cache, and revalidate/reload paths as required.

Error handling & logging

- Follow the repo's error handling conventions: surface actionable error messages and avoid leaking secrets.
- Use logger utilities (if present) and match logging patterns across the codebase.

Apply_patch / patch verification guidance (for automated edits)

- When apply_patch verification fails: read file with exact context, match CRLF/LF differences, and craft minimal single-line replacements.
- Prefer small, targeted patches rather than large multi-line context changes.

Plans & change management

- If a change touches > 3 files, create a plan in .opencode/plans/<short-kebab>\_<8charid>.plan.md before implementation. The plan must include Goals, Scope, Target Files, Risks, Planned Changes, Validation, Rollback.
- Run markdown lint on plans.

What to trust when docs conflict

- Prefer executable sources of truth in order:
  1. package.json scripts
  2. eslint.config.mts
  3. app-config.ts / lib/env.ts
  4. database/schema.ts
  5. tests/
- If you find a contradiction between docs and code: update the documentation and record the change in .opencode/plans/ with a short rationale.

Quick references (high-value files)

- package.json, eslint.config.mts, app-config.ts, lib/env.ts, database/schema.ts, dal/, actions/, .opencode/, tests/ (tests/setup.ts, e2e/).

If you are automating work (agent rules)

- NEVER push commits, create PRs, or start external services (Docker, cloud) without explicit permission.
- When asked to run commands, show the exact command and wait for user confirmation.
- If blocked by missing secrets or services, report exact errors and recommended next steps rather than attempting to bypass blockers.

PR-blocking rules (enforced)

- No `any` types
- Zero TypeScript errors
- All DB access via dal/
- Server Actions for mutations
- Zero lint warnings

End.
