---
name: plan-protocol
description: Guidelines for creating and managing implementation plans with citations
lastReviewed: 2026-04-29
applyTo: "**/*"
platforms:
  - opencode
  - cursor
  - copilot
---

# Plan Protocol

> **Load this skill** when creating or updating implementation plans.

## TL;DR Checklist

When creating or updating a plan, ensure:

- [ ] YAML frontmatter with `status`, `phase`, `updated`
- [ ] **Title** (clear name) and **Description** (1-3 sentences)
- [ ] **Personas** section with responsible roles
- [ ] `## Goal` section (one sentence - alternative to Title)
- [ ] `## Context & Decisions` table with citations (`ref:TASK-ID` or source)
- [ ] Phases with status markers: `[COMPLETE]`, `[IN PROGRESS]`, `[PENDING]`
- [ ] Tasks with hierarchical numbering (1.1, 1.2, 2.1)
- [ ] Only ONE task marked `← CURRENT`
- [ ] **Verification checklist** for completion validation
- [ ] Citations for all research-based decisions

---

## When to Use

1. Starting a multi-step implementation
2. After receiving a complex user request
3. When tracking progress across phases
4. After research that informs architectural decisions

## When NOT to Use

1. Simple one-off tasks → use built-in todos instead
2. Pure research/exploration → use delegations only
3. Quick fixes that don't need tracking
4. Single-file changes with no dependencies

---

## Plan Format

Use `createPlan` tool with this exact markdown format:

```markdown
---
status: STATUS
phase: PHASE_NUMBER
updated: YYYY-MM-DD
---

# Implementation Plan

## Title

CLEAR_PLAN_NAME

## Description

1-3 sentences describing what this plan covers.

## Personas

| Persona     | Role                                |
| ----------- | ----------------------------------- |
| IMPLEMENTER | Performs code changes and tests     |
| REVIEWER    | Reviews changes for correctness     |
| QA_ENGINEER | Runs E2E and exploratory tests      |
| MAINTAINER  | Approves merges and destructive ops |

## Goal

ONE_SENTENCE_DESCRIBING_OUTCOME

## Context & Decisions

| Decision | Rationale | Source              |
| -------- | --------- | ------------------- |
| CHOICE   | WHY       | `ref:DELEGATION_ID` |

## Phase 1: NAME [STATUS_MARKER]

- [x] 1.1 Completed task
- [x] 1.2 Another completed task → `ref:DELEGATION_ID`

## Phase 2: NAME [IN PROGRESS]

- [x] 2.1 Completed task
- [ ] **2.2 Current task** ← CURRENT
- [ ] 2.3 Pending task

## Phase 3: NAME [PENDING]

- [ ] 3.1 Future task
- [ ] 3.2 Another future task

## Verification

- [ ] Run `bun run build` - must pass
- [ ] Run `bun run lint:strict` - zero warnings
- [ ] Run `bun run test` - all tests pass

## Notes

- YYYY-MM-DD: Observation or decision `ref:DELEGATION_ID`
```

### Available Plan Tools

| Tool           | Purpose                        |
| -------------- | ------------------------------ |
| `createPlan`   | Create new implementation plan |
| `createSpec`   | Create reusable specification  |
| `readPlan`     | Read existing plan             |
| `appendSpec`   | Link spec to plan              |
| `markPlanDone` | Mark plan complete             |
| `submit_plan`  | Submit plan for user review    |

### Frontmatter Fields

| Field | Values | Description |
| --- | --- | --- |
| `status` | `not-started`, `in-progress`, `complete`, `blocked` | Overall plan status |
| `phase` | Number (1, 2, 3...) | Current phase number |
| `updated` | `YYYY-MM-DD` | Last update date |

### Phase Status Markers

| Marker          | Meaning                   |
| --------------- | ------------------------- |
| `[PENDING]`     | Not yet started           |
| `[IN PROGRESS]` | Currently being worked on |
| `[COMPLETE]`    | Finished successfully     |
| `[BLOCKED]`     | Waiting on dependencies   |

---

## State Machine

### Plan Lifecycle

```
not-started → in-progress → complete
                         ↘ blocked
```

### Phase Lifecycle

```
[PENDING] → [IN PROGRESS] → [COMPLETE]
                         ↘ [BLOCKED]
```

### Task Lifecycle

```
[ ] unchecked → [x] checked
```

### Critical Rules

1. **Only ONE phase** may be `[IN PROGRESS]` at any time
2. **Only ONE task** may have `← CURRENT` marker at any time
3. **Move `← CURRENT`** immediately when starting a new task
4. **Mark tasks `[x]`** immediately after completing them

---

## Citations & Delegations

### Where Citations Come From

Citations reference delegation research. The flow is:

1. You delegate research: `delegate` to `researcher` or `explore`
2. Delegation completes with a readable ID (e.g., `swift-amber-falcon`)
3. You cite that research in the plan: `ref:swift-amber-falcon`

### When to Cite

| Situation | Action |
| --- | --- |
| Architectural decision based on research | Add to Context & Decisions table |
| Task informed by research | Append `→ ref:id` to task line |
| Implementation detail from research | Inline citation in Notes |

### How to Find Delegation IDs

- Use `task` tool to delegate research - you'll receive a task_id in the response
- Reference that task_id in your plan using `ref:task-id` format
- Use `readPlan` to read referenced plan files before citing

### ❌ NEVER

- Make up task IDs
- Cite without actual research or source
- Skip citations for research-based decisions

---

## Examples

### ✅ CORRECT: Well-formed plan

```markdown
---
status: in-progress
phase: 2
updated: 2026-01-02
---

# Implementation Plan

## Title

JWT Authentication with Refresh Tokens

## Description

Add JWT authentication with refresh token support for mobile-friendly stateless auth.

## Personas

| Persona     | Role                                |
| ----------- | ----------------------------------- |
| IMPLEMENTER | Creates auth utilities and tests    |
| REVIEWER    | Reviews security and implementation |
| QA_ENGINEER | Runs E2E auth tests                 |

## Goal

Add JWT authentication with refresh token support

## Context & Decisions

| Decision | Rationale | Source |
| --- | --- | --- |
| Use bcrypt (12 rounds) | Industry standard, balance of security/speed | `ref:swift-amber-falcon` |
| JWT with refresh tokens | Stateless auth, mobile-friendly | `ref:calm-jade-owl` |

## Phase 1: Research [COMPLETE]

- [x] 1.1 Research auth patterns → `ref:swift-amber-falcon`
- [x] 1.2 Evaluate token strategies → `ref:calm-jade-owl`

## Phase 2: Implementation [IN PROGRESS]

- [x] 2.1 Set up project structure
- [ ] **2.2 Add password hashing** ← CURRENT
- [ ] 2.3 Implement JWT generation

## Phase 3: Testing [PENDING]

- [ ] 3.1 Write unit tests
- [ ] 3.2 Integration tests

## Verification

- [ ] Run `bun run build` - must pass
- [ ] Run `bun run lint:strict` - zero warnings
- [ ] Run `bun run test` - all tests pass

## Notes

- 2026-01-02: Chose bcrypt over argon2 for broader library support `ref:swift-amber-falcon`
```

### ❌ WRONG: Missing frontmatter

```markdown
# Implementation Plan

## Goal

Add authentication
```

**Error:** Plan must have YAML frontmatter with status, phase, updated.

### ❌ WRONG: Multiple CURRENT markers

```markdown
## Phase 2: Implementation [IN PROGRESS]

- [ ] **2.1 Task one** ← CURRENT
- [ ] **2.2 Task two** ← CURRENT
```

**Error:** Only one task may be marked CURRENT.

### ❌ WRONG: Decision without citation

```markdown
## Context & Decisions

| Decision  | Rationale | Source |
| --------- | --------- | ------ |
| Use Redis | It's fast | -      |
```

**Error:** Decisions must cite research with `ref:task-id` or include a source reference.

### ❌ WRONG: Invalid phase status

```markdown
## Phase 1: Research [DONE]
```

**Error:** Use `[COMPLETE]`, not `[DONE]`. Valid markers: `[PENDING]`, `[IN PROGRESS]`, `[COMPLETE]`, `[BLOCKED]`.

---

## Troubleshooting

| Error Message | Fix |
| --- | --- |
| "Missing frontmatter" | Add `---\nstatus: in-progress\nphase: 1\nupdated: 2026-01-02\n---` at top |
| "Multiple CURRENT markers" | Remove `← CURRENT` from all but the active task |
| "Invalid citation format" | Use `ref:task-id` format (e.g., `ref:abc-123`) |
| "Missing title" | Add `## Title` section with clear plan name |
| "Missing description" | Add `## Description` with 1-3 sentence summary |
| "Missing personas" | Add `## Personas` section with roles |
| "Missing goal" | Add `## Goal` section with one-sentence description |
| "Missing verification" | Add `## Verification` checklist |
| "Empty phase" | Add at least one task to each phase |
| "Invalid phase status" | Use `[PENDING]`, `[IN PROGRESS]`, `[COMPLETE]`, or `[BLOCKED]` |
| "Unsupported platform win32-x64" | Use `bun run` instead of `npm run` or direct CLI paths - Bun abstracts platform differences |

### Cross-Platform Command Execution

#### All Platforms (macOS, Linux, Windows, WSL)

Use Bun for all commands - it handles platform abstraction automatically:

```bash
# Run verification commands
bun run build
bun run lint:strict
bun run test

# Run format
bun run format

# TypeScript check
bun run type-check
```

#### Platform-Specific Notes

| Platform     | Shell/Environment           | Notes                                    |
| ----------- | --------------------------- | ---------------------------------------- |
| macOS       | Terminal                   | Use Bun directly                         |
| Linux       | Terminal                   | Use Bun directly                         |
| WSL         | Bash in WSL                 | Use Bun directly                         |
| Windows     | PowerShell / Git Bash       | Use Bun - abstracts platform differences |

#### Avoiding Platform Errors

**Common Error: "Unsupported platform win32-x64"**

This error occurs when tools try to detect the platform directly. To avoid:

1. **Always use Bun** (`bun run`) instead of platform-specific commands
2. **Use npx** for NPX tools (handles platform abstraction)
3. **Avoid** direct Node.js binary access (`node` vs `node.exe`)
4. **Use npm scripts** defined in package.json (verified working)

**Example - Preferred:**
```bash
bun run build          # Bun handles all platform details
bun exec vitest run   # Use bun exec for direct CLI tools
```

**Example - Avoid:**
```bash
npm run build        # Works but Bun is preferred for consistency
./node_modules/.bin/X  # Direct path can fail on Windows
```

#### Path Handling

| Platform     | Path Separator | Example                          |
| ------------ | ------------- | -------------------------------- |
| All          | `/` (forward) | `tests/unit/foo.test.ts`         |
| Windows      | `\` also works| `tests\unit\foo.test.ts`        |

Both separators work in most contexts. Use forward slashes for readability.

### npm Scripts Reference

These npm scripts are verified to exist in the Banking project:

| Script        | Command                   | Purpose          |
| ------------- | ------------------------- | ---------------- |
| `build`       | `bun run build`           | Production build |
| `lint:strict` | `bun run lint:strict`     | Strict linting   |
| `test`        | `bun run test`            | Run all tests    |
| `format`      | `bun run format`          | Format code      |
| `type-check`  | `bun run type-check`      | Type check       |

> **Note:** Always use `bun run` (not `npm run`) - Bun handles platform abstraction and avoids "win32-x64" errors.

---

## Before Saving Checklist

Before calling `createPlan`, verify:

- [ ] **Frontmatter:** Has status, phase, and updated date?
- [ ] **Title:** Is there a clear plan name?
- [ ] **Description:** Is there a 1-3 sentence summary?
- [ ] **Personas:** Are roles defined for each step?
- [ ] **Goal:** Is there a clear, one-sentence goal?
- [ ] **Citations:** Are all research-based decisions cited with `ref:task-id`?
- [ ] **Single CURRENT:** Is exactly one task marked `← CURRENT`?
- [ ] **Valid markers:** Do all phases use valid status markers?
- [ ] **Hierarchical IDs:** Are tasks numbered correctly (1.1, 1.2, 2.1)?
- [ ] **Verification:** Is there a completion checklist?

---
## Platform Compatibility

### Supported Platforms
This skill works on all platforms where Bun is available:
- macOS (x64 and arm64)
- Linux (x64 and arm64)
- Windows (x64) via PowerShell, Git Bash, or WSL
- WSL (Linux environment on Windows)

### Platform Detection
The skill uses the following approach for platform compatibility:
1. **Primary:** Use `bun run` for all scripts (handles platform abstraction)
2. **Secondary:** Use `bun exec` for direct CLI tool invocations
3. **Avoid:** Direct Node.js binary paths, platform-specific shell commands

### Windows-Specific Notes
On Windows (win32), the following patterns help avoid "Unsupported platform win32-x64":

| Pattern | Use | Avoid |
| --- | --- | --- |
| Script runner | `bun run` | `npm run`, `yarn`, `pnpm` |
| CLI tools | `bun exec vitest run` | `./node_modules/.bin/vitest` |
| Path commands | `bun x tsx` | `node -e` (complex scripts) |
| File paths | Forward `/` slashes | Direct `\` without escaping |
