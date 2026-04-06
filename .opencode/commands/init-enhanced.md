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

This command executes in 6 phases, automatically managing all agentic documentation files.

---

## Phase 1: Discovery & Verification

### Step 1.1: Read Existing Documentation

Read these files to understand current state:

| File                   | Lines | Purpose                          |
| ---------------------- | ----- | -------------------------------- |
| `AGENTS.md`            | ~602  | Primary canonical reference      |
| `package.json`         | —     | Command scripts, dependencies    |
| `app-config.ts`        | —     | Environment variable definitions |
| `database/schema.ts`   | —     | Database schema                  |
| `types/next-auth.d.ts` | —     | Session type definitions         |

### Step 1.2: Read Agentic Rules

Read all agent tool-specific documentation:

```
# Cursor Rules
.cursor/rules/*.mdc

# GitHub Copilot Instructions
.github/instructions/*.instructions.md

# OpenCode Instructions
.opencode/instructions/*.md

# OpenCode Skills
.opencode/skills/**/SKILL.md
```

### Step 1.3: Read Source Files for Verification

Verify accuracy against these source files:

```bash
# Read package.json for commands
cat package.json | grep -A2 '"scripts"'

# Read env.ts for env vars
cat app-config.ts

# Read schema for DB tables
cat database/schema.ts

# Read auth types
cat types/next-auth.d.ts

# Read key actions for inventory
ls actions/*.ts

# Read key dal for inventory
ls dal/*.ts
```

---

## Phase 2: Run Validation Commands & Capture Output

**Execute validation commands and capture output to text files for analysis.**

### Commands to Execute

| # | Command | Output File | Purpose |
| --- | --- | --- | --- |
| 1 | `npm run format:check 2>&1 > format-check.txt` | format-check.txt | Prettier violations |
| 2 | `npm run type-check 2>&1 > type-check.txt` | type-check.txt | TypeScript errors |
| 3 | `npm run lint:strict 2>&1 > lint-strict.txt` | lint-strict.txt | ESLint warnings/errors |
| 4 | `npm run test:ui 2>&1 > test-ui.txt` | test-ui.txt | Playwright E2E results |
| 5 | `npm run test:browser 2>&1 > test-browser.txt` | test-browser.txt | Vitest unit test results |

### Execution Notes

- Run commands sequentially (not in parallel) to avoid port conflicts
- Each command may take 1-5 minutes to complete
- Output files will be created in project root
- Free port 3000 before running tests:
  ```powershell
  $p = Get-NetTCPConnection -LocalPort 3000 -State Listen -EA SilentlyContinue | Select -ExpandProperty OwningProcess -Unique
  if ($p) { $p | % { Stop-Process -Id $_ -Force } }
  ```

---

## Phase 3: Analyze Outputs & Identify Issues

### Step 3.1: Read Output Files

Read each generated text file and document findings:

```
.read format-check.txt
.read type-check.txt
.read lint-strict.txt
.read test-ui.txt
.read test-browser.txt
```

### Step 3.2: Create Issue Catalog

Categorize all issues found:

| Category | Source File | Count | Examples |
| --- | --- | --- | --- |
| Format violations | format-check.txt | # | Files needing Prettier fixes |
| TypeScript errors | type-check.txt | # | Type errors by file |
| ESLint warnings | lint-strict.txt | # | Warning types |
| ESLint errors | lint-strict.txt | # | Error types |
| Test failures (E2E) | test-ui.txt | # | Failed specs |
| Test failures (Unit) | test-browser.txt | # | Failed test files |

### Step 3.3: Cross-Reference with Stale Sections

Check if issues relate to stale documentation:

- [ ] Commands added/removed since last commit
- [ ] New environment variables
- [ ] New server actions
- [ ] New database tables
- [ ] Debt items resolved or added
- [ ] ESLint/Prettier config changes

---

## Phase 4: Documentation Updates

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

- All scripts from `package.json`
- Corrections: `predev`/`prebuild` run `clean + type-check`
- `db:reset` = `db:drop + db:generate + db:push` (NOT seed)
- Document all 84 npm scripts

#### Section 3: Environment Variables

- vars from `app-config.ts`
- Only `ENCRYPTION_KEY` and `NEXTAUTH_SECRET` required
- SMTP var is `SMTP_PASS` (NOT `SMTP_PASSWORD`)

#### Section 6: ESLint Configuration

- **CRITICAL WARNING — `noInlineConfig: true`:**
  > Inline `// eslint-disable` comments have NO EFFECT. Do NOT add disable comments.
- All error rules (zod, unicorn, security, etc.)
- File-specific overrides documented

#### Section 11: Server Actions

- Complete inventory from `actions/*.ts`:
  - register.ts
  - user.actions.ts
  - admin.actions.ts
  - admin-stats.actions.ts
  - wallet.actions.ts
  - dwolla.actions.ts
  - transaction.actions.ts
  - plaid.actions.ts
  - recipient.actions.ts
  - updateProfile.ts
- Return types verified from source

#### Section 13: Authentication

- Session shape: `isAdmin: boolean`, `isActive: boolean` (NOT `role`)
- JWT strategy in `lib/auth-options.ts`

#### Section 14: Database Schema

- 10 tables + 4 enums from `database/schema.ts`
- Key fields: `users.isAdmin`, `wallets.sharableId`, `transactions.numeric(12,2)`

#### Section 19: Known Technical Debt

| # | Issue | Status |
| --- | --- | --- |
| 1 | `base.dal.ts` internal `as any` casts | Substantially resolved |
| 2 | `admin.actions.ts` auth guard | RESOLVED |
| 3 | `updateProfile.ts` userId from session | RESOLVED |
| 4 | `getAllBalances()` N+1 | Open |
| 5 | `proxy.ts` / middleware rate limiting | Partially resolved |
| 6 | Two auth configs | Open |
| 7 | Health check stubs | Open |
| 8 | Legacy numeric IDs | Open |
| 9 | Unsafe cast in layout | Open |

#### Sync Checklist

```
- [ ] database/schema.ts → Section 14
- [ ] lib/env.ts → Section 3
- [ ] actions/*.ts → Section 11
- [ ] types/next-auth.d.ts → Section 13
- [ ] dal/*.ts → Section 12
- [ ] package.json scripts → Section 2
- [ ] eslint.config.mts → Section 6
- [ ] .prettierrc.ts → Section 7
- [ ] Technical debt resolved → Section 19
```

### Priority 2: Update Cursor Rules (12 .mdc files)

Cross-reference with AGENTS.md:

- Ensure all PR-blocking rules documented
- Add `noInlineConfig: true` warning to `banking-coding-standards.mdc`
- Verify workflow matches AGENTS.md validation process

### Priority 3: Update GitHub Copilot Instructions (23 files)

- Update `agents.instructions.md` to reference AGENTS.md v10.0
- Update `nextjs.instructions.md` for Next.js 16 patterns
- Add Plaid/Dwolla integration notes

### Priority 4: Update OpenCode Instructions (9 files)

- Verify commands in `06-commands-ref.md` match `package.json`
- Fix `04-auth-testing.md` session shape (`isAdmin`, not `role`)
- Update `00-task-sync-note.md` for current TaskSync compatibility

### Priority 5: Update OpenCode Skills (10 files)

- Verify skill coverage matches AGENTS.md sections
- Add any new patterns from recent source changes
- Skills: Auth, DBSkill, DeploymentSkill, DwollaSkill, PlaidSkill, SecuritySkill, ServerActionSkill, TestingSkill, UISkill, ValidationSkill

---

## Phase 5: Post-Update Validation

### Re-run Validation Commands

Run these commands to verify documentation updates didn't break anything:

```bash
# Format check (Prettier)
npm run format:check

# Type check
npm run type-check

# Lint strict
npm run lint:strict

# Tests pass
npm run test
```

### Validation Checks

- [ ] All .md/.mdc files pass Prettier format
- [ ] AGENTS.md line count ~900-2000
- [ ] Cross-reference: Cursor rules ↔ AGENTS.md ↔ OpenCode instructions
- [ ] No `any` types in documented code patterns
- [ ] All 9 debt items have current status
- [ ] All npm scripts documented
- [ ] All env vars documented
- [ ] All Server Actions have correct signatures

---

## Phase 6: Report & Rollback

### Summary Report

After completion, output:

```
## init-enhanced Complete

### Validation Results (Before Fixes)
- format-check.txt: X violations
- type-check.txt: Y errors
- lint-strict.txt: Z warnings
- test-ui.txt: A E2E failures
- test-browser.txt: B unit test failures

### Issue Categories Identified
- (List issues by category)

### Files Updated
- AGENTS.md (602→~950 lines)
- .cursor/rules/ (12 files)
- .github/instructions/ (3 key files)
- .opencode/instructions/ (9 files)
- .opencode/skills/ (10 files)

### Verification (After Updates)
- [x] npm run format:check
- [x] npm run type-check
- [x] npm run lint:strict
- [x] npm run test

### New in This Update
- (List any new content added)

### Rollback Command
git checkout <checkpoint> -- AGENTS.md .cursor/rules/ .github/instructions/ .opencode/
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
- Phase 2 creates 5 output files for issue analysis before Phase 4 updates

## Related Commands

- `/validate` — Run all validation checks
- `/test` — Run all tests
- `/build` — Build the project

---

**End of /init-enhanced**
