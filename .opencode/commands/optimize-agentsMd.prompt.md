## Plan: Comprehensive AGENTS.md for Agentic Coding in Banking Repo

**TL;DR:** I will analyze the codebase and existing documentation to produce a detailed, agent-focused `AGENTS.md` file. This file will serve as the canonical reference for all agentic contributors, covering build/lint/test commands (including single test execution), code style guidelines (imports, formatting, types, naming, error handling), and all Copilot/agent rules , and all Opencode/agent rules , and all Cursor/agent rules. I will ensure it is thorough (~2000 lines), up-to-date, and integrates all relevant rules from `.github/copilot-instructions.md`,`.cursor/rules/` and any other agentic standards found.

---

---

Please analyze this codebase and create an AGENTS.md file containing:

1. Build/lint/test commands - especially for running a single test
2. Code style guidelines including imports, formatting, types, naming conventions, error handling, etc. The file you create will be given to agentic coding agents (such as yourself) that operate in this repository. Make it about 2000 lines long. If there are Cursor rules (in .cursor/rules/ or .cursorrules) or Copilot rules (in .github/copilot-instructions.md), make sure to include them. If there's already an AGENTS.md, improve it if it's located in C:\Users\Alexa\Desktop\SandBox\Banking

---

**Steps**

### Phase 1: Discovery & Research

0. Read the session and chat history.
1. Review the current `AGENTS.md` in the workspace for structure, coverage, and gaps.
2. Analyze `.github/copilot-instructions.md` for Copilot/agent rules and patterns.
3. Analyze `.opencode/agent-instructions.md` for Opencode/agent rules and patterns.
4. Search for any Cursor rules in `.cursor/rules/` or `.cursorrules` (if present).
5. Gather all build, lint, test, and single-test commands from `package.json` and related scripts.
6. Collect code style guidelines: imports, formatting, types, naming, error handling, etc., from all relevant docs and config files.
7. Identify any additional agentic or automation standards in the repo (e.g., in `README.md`, `CONTRIBUTING.md`, or other meta files).

### Phase 2: Alignment & Clarification

7. If ambiguities or missing info are found (e.g., Cursor rules not present), clarify with the user or note as "not present".
8. Validate that all agentic rules are up-to-date and not in conflict.

### Phase 3: Drafting the AGENTS.md

9. Structure the file for agentic consumption:
   - Introduction and purpose
   - Build/lint/test commands (with single test execution)
   - Code style guidelines (imports, formatting, types, naming, error handling)
   - Copilot/agent rules (from `.github/copilot-instructions.md`)
   - Cursor rules (if any)
   - Reference patterns and file locations
   - Contribution and PR requirements
   - Testing and verification requirements
   - Security and environment variable handling
   - Any additional agentic best practices
10. Integrate and improve upon the existing `AGENTS.md` content, ensuring clarity, completeness, and actionable detail.
11. Ensure the file is approximately 2000 lines, with comprehensive examples and explanations.

### Phase 4: Verification & Finalization

12. Cross-check the new `AGENTS.md` against all source files for accuracy.
13. Validate that all commands and patterns are correct and up-to-date.
14. Save the plan and present the structure and key sections to the user for review.

---

**Relevant files**

- `AGENTS.md` — Main agentic standards file (to be improved/rewritten)
- `.github/copilot-instructions.md` — Copilot/agent rules and patterns
- `.cursor/rules/`, `.cursorrules` — Cursor rules (if present)
- `package.json` — Scripts for build/lint/test commands
- `README.md`, `CONTRIBUTING.md` — Additional standards and patterns
- `tsconfig.json`, `eslint.config.mts`, `prettier` config — Formatting and type rules

---

**Verification**

1. Ensure all build/lint/test commands (including single test execution) are documented and correct.
2. Confirm code style guidelines are comprehensive and match project standards.
3. Validate that all Copilot/agent rules are included and up-to-date.
4. Check for the presence of Cursor rules and include if found.
5. Review the file for clarity, completeness, and actionable detail for agentic contributors.
6. Ensure the file is approximately 2000 lines and well-structured.

---

**Decisions**

- Will use `.github/copilot-instructions.md` as the primary source for agent rules.
- If Cursor rules are not present, will note their absence.
- Will prioritize actionable, example-driven documentation for agentic use.

---

**Further Considerations**

1. If the user has specific preferences for section order or additional topics, clarify before finalizing.
2. Recommend periodic review and update of `AGENTS.md` as project standards evolve.
3. Suggest linking to external docs (Next.js, Drizzle, etc.) for deeper dives where appropriate.

---

# Plan: AGENTS.md v4.0 — Full Accuracy Rewrite

**Purpose:** Full replacement of `AGENTS.md` with a corrected, ~2000-line canonical reference for all agentic coding agents (Copilot, Cursor, OpenCode) operating in this repository. Fixes all known inaccuracies from v3.0 and incorporates changes made since the last commit.

---

## Goals

- Produce a single authoritative `AGENTS.md` that agents can rely on without cross-checking source
- Correct every inaccuracy identified during the v3.0 discovery audit
- Document all changes made since the last commit (middleware deletion, debt resolutions, base.dal.ts rewrite)
- Add prominent `noInlineConfig: true` ESLint warning (inline disables have NO effect)
- Target ~2000 lines with comprehensive examples

---

## Scope

Full replacement of `C:\Users\Alexa\Desktop\SandBox\Banking\AGENTS.md`. No other files modified.

---

## Target Files

- `AGENTS.md` — rewrite (only file changed)

---

## Risks

- Drifting from source truth if re-verification is skipped
- Missing new files added since last commit (new test files, new component directories)
- Overstating debt resolution if not re-checking diffs

---

## Planned Changes (28 Sections)

### Section 1 — Tech Stack Overview

- Next.js 16.2.2, React 19, TypeScript 6.0.2 strict
- React Compiler enabled, Cache Components enabled, Typed Routes enabled
- All third-party integrations table (Plaid, Dwolla, Redis, SMTP, GitHub/Google OAuth)

### Section 2 — Commands Reference

Source of truth: `package.json` (modified since last commit — re-read before writing)

Key corrections vs v3.0:

- `predev` and `prebuild` both run `clean + type-check` first
- `db:reset` = `db:drop + db:generate + db:push` (does NOT seed — v3.0 was wrong)
- `npm run test` = `test:browser + test:ui` in sequence
- `test:ui` sets `PLAYWRIGHT_PREPARE_DB=true --retries=0 --workers=1`

### Section 3 — Single Test Execution

```bash
# Vitest — single file
npm exec vitest run tests/unit/register.test.ts --config=vitest.config.ts

# Playwright — single file
npm exec playwright test tests/e2e/auth.spec.ts
```

### Section 4 — Environment Variables (27 total)

Corrections vs v3.0:

- `DATABASE_URL` is **optional** in `lib/env.ts` (not required)
- Only `ENCRYPTION_KEY` and `NEXTAUTH_SECRET` are truly required
- SMTP var is `SMTP_PASS` not `SMTP_PASSWORD`

### Section 5 — PR-Blocking Rules (7 rules)

Same as v3.0 — no changes needed.

### Section 6 — TypeScript & Type Safety

Same as v3.0 plus:

- Note that `InferSelectModel` / `InferInsertModel` are the correct patterns (no manual type duplication)
- `UserWithProfile = User & { profile?: UserProfile }` — flat intersection, NOT nested

### Section 7 — ESLint Configuration

**CRITICAL WARNING — `noInlineConfig: true`:**

> `// eslint-disable-next-line` and `// eslint-disable` comments have **NO EFFECT** anywhere in this codebase. The ESLint config sets `noInlineConfig: true`. Do NOT add inline disable comments — they will not suppress any rules.

Rules by severity:

- `"error"` rules: `zod/require-error-message`, `zod/no-any-schema`, `zod/no-empty-custom-schema`, `zod/prefer-meta`, `better-tailwindcss/enforce-consistent-class-order`, `unicorn/prefer-includes`, `unicorn/prefer-string-slice`, `unicorn/throw-new-error`, `unicorn/filename-case`, `unicorn/no-abusive-eslint-disable`, `no-var`, `prefer-const`, `no-debugger`, `no-unreachable`, `no-unsafe-negation`, `no-unsafe-optional-chaining`, `curly`, all `security/detect-*` rules, all `jest/*` test rules, all `vitest/*` critical rules, `playwright/no-element-handle`, `playwright/no-force-option`, `playwright/no-wait-for-selector`, `drizzle/enforce-delete-with-where`, `drizzle/enforce-update-with-where`

File-specific overrides:

- `lib/actions/**` — `no-console: "off"`, `require-await: "off"`
- `lib/dal/base.dal.ts` — `@typescript-eslint/no-explicit-any: "off"`
- `components/plaid-link.tsx`, `lib/auth-config.ts`, `lib/auth-options.ts` — `unicorn/no-null: "off"`
- `scripts/**` — `no-console` allowed for `warn` and `error`
- `tests/e2e/global-setup.ts` — `no-console: "off"`, `n/no-process-env: "off"`
- Config files (`next.config.*`, `lib/env.ts`, etc.) — `n/no-process-env: "off"`

### Section 8 — Prettier Configuration

- Plugins: `prettier-plugin-tailwindcss`, `prettier-plugin-organize-imports`, `prettier-plugin-packagejson`, `prettier-plugin-sort-json`
- `organize-imports` auto-sorts on save — no manual import ordering needed
- Settings: `printWidth: 80`, `semi: true`, `singleQuote: false`, `tabWidth: 2`, `trailingComma: "all"`, `endOfLine: "lf"`

### Section 9 — Import Order

Prettier's `organize-imports` plugin handles this automatically. Document the canonical order for reference when Prettier is not available.

### Section 10 — Naming Conventions

Same as v3.0 extended table.

### Section 11 — Next.js 16 Patterns

Same as v3.0 (Server/Client, async APIs, Cache Components, Suspense, Route Groups).

### Section 12 — Server Actions (Complete Method Inventory)

**Corrections vs v3.0:**

- `admin.actions.ts` — `toggleAdmin` and `setActive` now accept `input: unknown` (NOT `userId, makeAdmin` positional args). Both now have `auth()` + `isAdmin` guard. **Debt #2 RESOLVED.**
- `updateProfile.ts` — `userId` removed from schema, now taken from session only. **Debt #3 RESOLVED.**
- `logoutAccount` returns `boolean` (not `{ ok: boolean }`)

### Section 13 — Data Access Layer

**Corrections vs v3.0:**

- `base.dal.ts` has been rewritten with proper generics (`T extends AnyPgTable`). Internal `table as any` casts are intentional and isolated; public signatures are fully typed. ESLint `no-explicit-any` is disabled for that file only. **Debt #1 substantially resolved.**

### Section 14 — Authentication

**Corrections vs v3.0:**

- Session shape uses `isAdmin: boolean` + `isActive: boolean`, NOT a `role` enum string
- Two auth configs exist (known debt):
  - `lib/auth-options.ts` — JWT strategy, used by `lib/auth.ts` → `getServerSession(authOptions)`
  - `lib/auth-config.ts` — database strategy, used by `app/api/auth/[...nextauth]`
- Auth mock for unit tests: `vi.mock("@/lib/auth", () => ({ auth: vi.fn().mockResolvedValue(undefined) }))` — use `undefined` NOT `null`

### Section 15 — Encryption

Same as v3.0. AES-256-GCM, `iv:authTag:ciphertext` format, transparent in BankDal.

### Section 16 — Database Schema (10 Tables + 1 Enum)

**Corrections vs v3.0:**

- `user_profiles` actual fields: `address`, `city`, `state`, `postalCode`, `phone`, `dateOfBirth` (NOT `bio`, `avatarUrl`, `preferences`)
- `users` has `isAdmin bool` + `isActive bool` columns (in addition to `role enum`)
- `banks` has `sharableId` (unique), `accountId`, `accountType`, `accountSubtype`, `dwollaCustomerUrl` (not `dwollaCustomerId`)
- `transactions` has `senderBankId FK`, `receiverBankId FK`, `status`, `email`, `name`, `category`, `date`, `type`, `plaidTransactionId` (unique); amount is `numeric(12,2)`

### Section 17 — Validation (Zod v4)

**Additions vs v3.0:**

- `zod/require-error-message` is `"error"` — must use `error:` key (NOT `message:`) in `.refine()`
- `zod/prefer-string-schema-with-trim` is `"warn"` — `.string()` should chain `.trim()`
- `zod/prefer-meta` is `"error"` — schemas should have `.describe()` metadata
- `zod/no-any-schema` is `"error"` — `z.any()` is forbidden

### Section 18 — Forms & UI

Same as v3.0.

### Section 19 — Testing

Same as v3.0 plus:

- New test files added since last commit: `tests/unit/bank.actions.test.ts`, `tests/unit/recipient.actions.test.ts`, `tests/unit/transaction.actions.test.ts`, `tests/unit/user.actions.test.ts`
- `tests/helpers/auth.ts` deleted — replaced by `tests/e2e/helpers/auth.ts`

### Section 20 — Port Guard

Same as v3.0 (kill port 3000 before any test run).

### Section 21 — Middleware

**Updated vs v3.0:**

- `app/middleware.ts` has been **deleted**
- No `proxy.ts` exists at the project root
- Routes remain unprotected — auth enforcement is still missing
- **Debt #5 partially resolved** (wrong-location file removed) but not fully resolved (root `proxy.ts` still needs to be created)

### Section 22 — Security

Same as v3.0.

### Section 23 — Known Technical Debt (Updated)

| # | Location | Issue | Severity | Status |
| --- | --- | --- | --- | --- |
| 1 | `lib/dal/base.dal.ts` | Generic rewrite done; internal `as any` casts remain (intentional, ESLint disabled) | Low | Substantially resolved |
| 2 | `lib/actions/admin.actions.ts` | Auth + isAdmin guard added; signature changed to `input: unknown` | — | **RESOLVED** |
| 3 | `lib/actions/updateProfile.ts` | userId now from session only | — | **RESOLVED** |
| 4 | `lib/actions/plaid.actions.ts` | `getAllBalances()` N+1 — calls `getBalance()` per bank in loop | Medium | Open |
| 5 | `proxy.ts` | `app/middleware.ts` deleted; no root proxy yet — routes unprotected | Critical | Partially resolved |
| 6 | `lib/auth-options.ts` + `lib/auth-config.ts` | Two conflicting auth configs (JWT vs database) | Critical | Open |
| 7 | `/api/health` | DB/Redis checks always return `true` (stub) | Low | Open |
| 8 | `types/index.d.ts` | Legacy types with numeric `id` conflict with Drizzle string IDs | Medium | Open |
| 9 | `app/(root)/layout.tsx` | `user as unknown as User` unsafe cast | Low | Open |

### Section 24 — Integrations

Same as v3.0 (Plaid, Dwolla, Redis, SMTP).

### Section 25 — Cursor Rules (12 Files)

Same as v3.0.

### Section 26 — GitHub Copilot Instructions

Same as v3.0 (23 instruction files, 19 prompt files).

### Section 27 — OpenCode Skills & Instructions

Update skill count — confirm 13 skill entries in `.opencode/skills/`.

### Section 28 — External Documentation + Sync Checklist

Same as v3.0 with updated checklist items for new debt status.

---

## Validation

- [ ] Section count: `grep "^## [0-9]" AGENTS.md | wc -l` → expect 28
- [ ] Line count: ~2000 lines
- [ ] `npm run format:check` passes (Prettier)
- [ ] No `any` in documented patterns
- [ ] All debt items reflect current state from git diff

---

## Rollback or Mitigation

- Git history preserves v3.0 at commit `2edf0d7`
- To revert: `git checkout 2edf0d7 -- AGENTS.md`

**Next Step:** Proceed to research and gather all required information from the codebase and documentation to begin drafting the improved `AGENTS.md`.
