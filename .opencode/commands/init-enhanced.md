# /init-enhanced — Initialize Banking Project Documentation

## Purpose

Comprehensive documentation sync for all agentic coding tools (OpenCode, Cursor, GitHub Copilot) operating in this Banking repository. This command ensures all agentic documentation files are accurate, consistent, and up-to-date with the current source code.

## When to Use

- Starting a new session after codebase changes
- Before major refactoring or feature work
- When documentation may have drifted from source truth
- After adding new integrations, commands, or dependencies

## Usage

```
/init-enhanced
```

## Workflow

This command executes in 5 phases, automatically managing all 53 agentic documentation files.

---

## Phase 1: Discovery & Verification

### Step 1.1: Read Existing Documentation

Read these files to understand current state:

| File | Lines | Purpose |
| --- | --- | --- |
| `AGENTS.md` | ~935 | Primary canonical reference |
| `package.json` | — | Command scripts, dependencies |
| `lib/env.ts` | — | Environment variable definitions |
| `database/schema.ts` | — | Database schema (10 tables + enum) |
| `types/next-auth.d.ts` | — | Session type definitions |

### Step 1.2: Read Agentic Rules

Read all agent tool-specific documentation:

```
# Cursor Rules (12 files)
.cursor/rules/banking-coding-standards.mdc
.cursor/rules/typescript-no-any.mdc
.cursor/rules/env-access-via-lib-env.mdc
.cursor/rules/mutations-via-server-actions.mdc
.cursor/rules/no-n-plus-one-queries.mdc
.cursor/rules/workflow-and-steps.mdc
.cursor/rules/plan-file-standards.mdc
.cursor/rules/kill-port-3000-before-tests.mdc
.cursor/rules/project-coding-standards.mdc
.cursor/rules/project-workflow-process.mdc
.cursor/rules/project-testing-validation.mdc
.cursor/rules/project-documentation-style.mdc

# GitHub Copilot Instructions (key files)
.github/instructions/agents.instructions.md
.github/instructions/nextjs.instructions.md
.github/instructions/prompt.instructions.md

# OpenCode Instructions (7 files)
.opencode/instructions/00-task-sync-note.md
.opencode/instructions/01-core-standards.md
.opencode/instructions/02-nextjs-patterns.md
.opencode/instructions/03-dal-patterns.md
.opencode/instructions/04-auth-testing.md
.opencode/instructions/05-ui-validation.md
.opencode/instructions/06-commands-ref.md

# OpenCode Skills (10 files)
.opencode/skills/auth-skill/SKILL.md
.opencode/skills/db-skill/SKILL.md
.opencode/skills/plaid-skill/SKILL.md
.opencode/skills/dwolla-skill/SKILL.md
.opencode/skills/security-skill/SKILL.md
.opencode/skills/server-action-skill/SKILL.md
.opencode/skills/testing-skill/SKILL.md
.opencode/skills/ui-skill/SKILL.md
.opencode/skills/validation-skill/SKILL.md
.opencode/skills/deployment-skill/SKILL.md
```

### Step 1.3: Read Source Files for Verification

Verify accuracy against these source files:

```bash
# Read package.json for commands
cat package.json | grep -A2 '"scripts"'

# Read env.ts for env vars
cat lib/env.ts

# Read schema for DB tables
cat database/schema.ts

# Read auth types
cat types/next-auth.d.ts

# Read key actions for inventory
ls lib/actions/*.ts
```

---

## Phase 2: Analysis & Gap Detection

### Step 2.1: Verify AGENTS.md Accuracy

Cross-reference AGENTS.md sections with source files:

| AGENTS.md Section | Source to Verify |
| --- | --- |
| Section 1: Tech Stack | `package.json` dependencies |
| Section 2: Commands | `package.json` scripts (all 65) |
| Section 3: Env Vars | `lib/env.ts` (24 vars) |
| Section 6: ESLint | `eslint.config.mts` |
| Section 7: Prettier | `.prettierrc.ts` |
| Section 11: Server Actions | `lib/actions/*.ts` signatures |
| Section 12: DAL | `lib/dal/base.dal.ts` generics |
| Section 13: Auth | `lib/auth-options.ts`, `types/next-auth.d.ts` |
| Section 14: DB Schema | `database/schema.ts` (10 tables) |
| Section 15: Validation | Zod schemas in actions |
| Section 17: Testing | `tests/unit/*.test.ts`, `tests/e2e/*.spec.ts` |
| Section 19: Tech Debt | Git diff since last update |

### Step 2.2: Detect Inconsistencies

Flag any gaps between:

- AGENTS.md vs Cursor rules
- AGENTS.md vs OpenCode instructions
- AGENTS.md vs Copilot instructions
- Documentation vs actual source code

### Step 2.3: Identify Stale Sections

Check for sections that need updates:

- Commands added/removed since last commit
- New environment variables
- New server actions
- New database tables
- Debt items resolved or added
- ESLint/Prettier config changes

---

## Phase 3: Documentation Updates

**CRITICAL:** Create git checkpoint before making changes:

```bash
git add -A
git commit -m "docs: checkpoint before init-enhanced update"
```

### Priority 1: Update AGENTS.md

The canonical reference. Re-write these sections with verified content:

#### Section 1: Tech Stack

- Next.js 16.2.2, React 19, TypeScript 6.0.2
- React Compiler enabled, Cache Components enabled
- All dependencies from `package.json`

#### Section 2: Commands

- All 65 scripts from `package.json`
- Corrections: `predev`/`prebuild` run `clean + type-check`
- `db:reset` = `db:drop + db:generate + db:push` (NOT seed)

#### Section 3: Environment Variables

- 24 vars from `lib/env.ts`
- Only `ENCRYPTION_KEY` and `NEXTAUTH_SECRET` required
- SMTP var is `SMTP_PASS` (NOT `SMTP_PASSWORD`)

#### Section 6: ESLint Configuration

- **CRITICAL WARNING — `noInlineConfig: true`:**

  > Inline `// eslint-disable` comments have NO EFFECT. Do NOT add disable comments.

- All error rules (zod, unicorn, security, etc.)
- File-specific overrides documented

#### Section 11: Server Actions

- Complete inventory: `getLoggedInUser`, `logoutAccount`, `registerUser`, `updateProfile`, `toggleAdmin`, `setActive`, `getUserBanks`, `disconnectBank`, `createLinkToken`, `exchangePublicToken`, `createTransfer`, `getRecentTransactions`, `getTransactionHistory`
- Return types verified from source

#### Section 13: Authentication

- Session shape: `isAdmin: boolean`, `isActive: boolean` (NOT `role`)
- Two conflicting configs: JWT (`auth-options.ts`) vs database (`auth-config.ts`)

#### Section 14: Database Schema

- 10 tables + 1 enum from `database/schema.ts`
- Key fields verified: `users.isAdmin`, `banks.sharableId`, `transactions.numeric(12,2)`

#### Section 19: Known Technical Debt

| # | Issue | Status |
| --- | --- | --- |
| 1 | `base.dal.ts` internal `as any` casts | Substantially resolved |
| 2 | `admin.actions.ts` auth guard | RESOLVED |
| 3 | `updateProfile.ts` userId from session | RESOLVED |
| 4 | `getAllBalances()` N+1 | Open |
| 5 | `proxy.ts` / middleware deleted | Partially resolved |
| 6 | Two auth configs | Open |
| 7 | Health check stubs | Open |
| 8 | Legacy numeric IDs | Open |
| 9 | Unsafe cast in layout | Open |

#### Sync Checklist

```
- [ ] database/schema.ts → Section 14
- [ ] lib/env.ts → Section 3
- [ ] lib/actions/*.ts → Section 11
- [ ] types/next-auth.d.ts → Section 13
- [ ] lib/dal/*.ts → Section 12
- [ ] package.json scripts → Section 2
- [ ] eslint.config.mts → Section 6
- [ ] .prettierrc.ts → Section 7
- [ ] Technical debt resolved → Section 19
```

### Priority 2: Update Cursor Rules (12 .mdc files)

Cross-reference with AGENTS.md:

- Ensure all PR-blocking rules documented
- Add `noInlineConfig: true` warning to `banking-coding-standards.mdc`
- Verify workflow matches AGENTS.md Section 21 (9-step process)

### Priority 3: Update GitHub Copilot Instructions (23 files)

- Update `agents.instructions.md` to reference AGENTS.md v5.2
- Update `nextjs.instructions.md` for Next.js 16 patterns
- Add Plaid/Dwolla integration notes

### Priority 4: Update OpenCode Instructions (7 files)

- Verify commands in `06-commands-ref.md` match `package.json`
- Fix `04-auth-testing.md` session shape (`isAdmin`, not `role`)
- Update `00-task-sync-note.md` for current TaskSync compatibility

### Priority 5: Update OpenCode Skills (10 files)

- Verify skill coverage matches AGENTS.md sections
- Add any new patterns from recent source changes

---

## Phase 4: Validation Checklist

Run these commands to verify changes:

```bash
# Format check (Prettier)
npm run format:check

# Type check
npm run type-check

# Lint strict
npm run lint:strict

# Tests pass
npm run test

# Line count verification
# AGENTS.md should be ~900-2000 lines
wc -l AGENTS.md
```

### Validation Checks

- [ ] All .md/.mdc files pass Prettier format
- [ ] AGENTS.md line count ~900-2000
- [ ] Cross-reference: Cursor rules ↔ AGENTS.md ↔ OpenCode instructions
- [ ] No `any` types in documented code patterns
- [ ] All 9 debt items have current status
- [ ] All 65 npm scripts documented
- [ ] All 24 env vars documented
- [ ] All Server Actions have correct signatures

---

## Phase 5: Report & Rollback

### Summary Report

After completion, output:

```
## init-enhanced Complete

### Files Updated
- AGENTS.md (935→~950 lines)
- .cursor/rules/ (12 files)
- .github/instructions/ (3 key files)
- .opencode/instructions/ (7 files)
- .opencode/skills/ (10 files)

### Verification
- [x] npm run format:check
- [x] npm run type-check
- [x] npm run lint:strict
- [x] npm run test

### New in This Update
- (List any new content added)

### Rollback
git checkout <commit> -- AGENTS.md .cursor/rules/ .github/instructions/ .opencode/
```

### Rollback Instructions

If issues occur:

```bash
# Find the checkpoint commit
git log --oneline -3

# Rollback all agentic documentation
git checkout <checkpoint-commit> -- AGENTS.md .cursor/rules/ .github/instructions/ .opencode/
```

---

## Notes

- This command always updates files (no staleness check) to ensure source truth
- AGENTS.md is the anchor; all other files reference it
- Version bump protocol: Increment version, update date, add changelog entry
- `noInlineConfig: true` means NO inline ESLint disables work anywhere

## Related Commands

- `/validate` — Run all validation checks
- `/test` — Run all tests
- `/build` — Build the project

---

**End of /init-enhanced**
