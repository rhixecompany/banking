# Skill Evaluation Report: worktrunk

## Summary

- **Total Score**: 96/120 (80%)
- **Grade**: B
- **Pattern**: Tool (CLI reference with decision trees and examples)
- **Knowledge Ratio**: E:A:R = 90:8:2
- **Verdict**: Excellent domain knowledge and usability for common workflows; critical gaps in anti-patterns and error handling prevent Grade A.

---

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 18 | 20 | Expert-grade coverage of wt CLI commands, non-obvious patterns (hash_port filters, hook lifecycle). Minor deduction: installation section slightly redundant. |
| D2: Mindset vs Mechanics | 13 | 15 | Good: explains "make git worktree as easy as git branch" mindset + domain workflows. Gap: missing decision tree for hook selection (post-create blocking vs post-start non-blocking). |
| D3: Anti-Pattern Quality | 2 | 15 | **CRITICAL**: No NEVER list. Missing warnings: forgetting shell integration, port conflicts, state corruption on failed merges, orphaned worktrees. |
| D4: Specification Compliance | 15 | 15 | Perfect: frontmatter valid, description comprehensive with WHAT/WHEN/KEYWORDS, specific trigger scenarios. |
| D5: Progressive Disclosure | 14 | 15 | Excellent self-contained structure with Quick Reference → Core Workflows → Advanced. Minor: could benefit from explicit "Start Here" section. |
| D6: Freedom Calibration | 13 | 15 | Appropriate medium-low freedom for CLI operations. Hook configuration flexibility balanced with required syntax. Gap: limited guidance on what NOT to do in hooks. |
| D7: Pattern Recognition | 9 | 10 | Masterful Tool pattern application: decision tables, runnable examples, reference tables. Minor: missing decision tree for "which hook for which scenario." |
| D8: Practical Usability | 12 | 15 | **Gaps**: No error handling (what if wt switch fails? what if hook times out?). No edge cases covered (Windows compatibility nuances, monorepo scenarios). Happy-path excellent; error paths missing. |

---

## Critical Issues

1. **No Anti-Pattern List (D3 = 2/15)** — The skill provides zero guidance on what NOT to do. Real experts know:
   - NEVER forget `wt config shell install` (directory won't change)
   - NEVER use blocking `post-start` hooks (deadlocks with -x flag)
   - NEVER merge without running `pre-merge` tests
   - NEVER leave failed merges unresolved (orphaned worktrees)

   **Impact**: Agents using this skill can stumble into common failure modes without knowing why or how to recover.

2. **No Error Handling (D8 = 12/15)** — Skill provides happy-path only:
   - What happens if `wt merge` fails mid-operation?
   - What if a hook timeout exceeds timeout limits?
   - What if `wt list` shows dirty state after failed removal?
   - What's the recovery procedure?

   **Impact**: Agent gets stuck when reality doesn't match examples.

3. **Missing Decision Tree for Hook Lifecycle (D2 = 13/15)** — Hook types table lists WHAT and WHEN, but not WHY or HOW to choose:
   - When should post-create be used vs post-start?
   - What happens if both fire for same event?
   - How do blocking hooks interact with `--execute`?

   **Impact**: Agent might design inefficient or broken hook chains.

---

## Top 3 Improvements

### 1. Add Explicit Anti-Pattern List (Fix D3: +10 points potential)

**Add new section after "Zellij Integration":**

````markdown
## Common Mistakes to Avoid

### NEVER Forget Shell Integration

```bash
# ❌ WRONG: Installation incomplete
brew install worktrunk

# ✅ CORRECT: Must enable shell integration so wt switch changes your directory
brew install worktrunk
wt config shell install  # Required for Bash/Zsh/Fish
```
````

**Why**: Without shell integration, `wt switch` creates the worktree but your shell stays in the current directory. This breaks the entire workflow.

### NEVER Run Blocking Hooks with --execute

```bash
# ❌ WRONG: This will deadlock
wt switch -c feature-a --execute claude -x "Add auth"

# If .config/wt.toml has blocking post-create hooks, --execute waits forever
```

**Why**: `--execute` (the `-x` flag) spawns the command immediately. If `post-create` is blocking (waiting for setup), Claude starts before setup finishes.

### NEVER Use post-start for Dev Server

```toml
# ❌ WRONG: Runs every switch, even to main
[post-start]
server = "npm run dev"

# ✅ CORRECT: Only on creation
[post-create]
server = "npm run dev"
```

**Why**: `post-start` runs every switch. If you switch back to main and accidentally run dev on main's branch name port, you'll have port conflicts.

### NEVER Forget to Run pre-merge Hooks

```bash
# ❌ WRONG: Merging broken code
wt merge --skip-hooks main

# ✅ CORRECT: Let tests run
wt merge main  # Runs pre-merge [test] and [build] hooks
```

**Why**: If merge hook fails, the worktree is left in broken state. Always let hooks validate before merging.

### NEVER Mix Blocking and Non-Blocking Hooks for Same Event

```toml
# ⚠️ PROBLEMATIC: Ordering matters
[post-create]
setup = "npm install"      # Blocking
dev = "npm run dev &"      # Non-blocking

# Sequential: setup finishes → dev starts
# But if dev hook has syntax error, entire post-create fails
```

**Why**: Blocking hooks run in sequence, non-blocking in parallel. Mixed usage can cause hard-to-debug race conditions.

````

**Impact**: +10-12 points on D3, preventing agents from hitting landmines.

---

### 2. Add Error Handling & Recovery Guide (Fix D8: +3 points)

**Add new section before "Further Reference":**

```markdown
## Troubleshooting & Recovery

### wt merge Left Worktree in Broken State

```bash
# Symptom: wt list shows conflicted/dirty state
# Cause: pre-merge hook failed

# Recovery:
git status  # Check what's broken
# Fix conflicts manually, then:
git add .
git commit -m "fix: resolve merge conflicts"
wt merge main --continue  # Resume merge
````

### Port Already in Use (hash_port Collision)

```bash
# Symptom: Dev server fails to start, port X already bound
# Common cause: Previous worktree's dev server still running

# Recovery:
wt list  # Find which worktree owns the port
# Switch to that worktree, kill dev server
kill $(lsof -ti :<PORT>)

# Or use deterministic port:
# Recalculate: hash_port always produces same port for same branch
# So branch-a always → port 15000, branch-b → port 15001
```

### Infinite post-create Hook Hang

```bash
# Symptom: wt switch --create hangs forever

# Recovery (in another terminal):
ps aux | grep wt
kill -9 <PID>  # Kill blocking hook

# Root cause diagnosis:
# Check .config/wt.toml for [post-create]
# Does any hook run a server/long-running process?
# It should be non-blocking: append & or use [post-start]
```

````

**Impact**: +2-3 points on D8, enabling error recovery.

---

### 3. Add Hook Decision Tree (Fix D2: +2 points)

**Expand Hook Types section with decision guidance:**

```markdown
## Choosing the Right Hook

| Scenario | Hook | Blocking? | Why |
| --- | --- | --- | --- |
| **Copy deps/cache from main** | `post-start` | No | Runs after creation; non-blocking so agent can proceed immediately |
| **Run local CI (test/build)** | `pre-merge` | Yes | Must validate before merge; wait for results |
| **Start dev server** | `post-create` | No | Use non-blocking so `-x` command starts after setup |
| **Notify when done** | `post-merge` | No | Non-blocking notification after merge completes |
| **Clean up before removal** | `pre-remove` | Yes | Must cleanup before worktree removed; wait for cleanup |
| **DB migrations** | `post-create` | Yes | Blocking: migration must complete before work begins |

**Decision Tree:**

1. **Does this hook have side effects that must complete before work starts?**
   - YES → Use `post-create` with blocking, or `pre-merge` for merge validation
   - NO → Use `post-start` (non-blocking), `post-merge`, or `post-remove`

2. **Is this hook time-sensitive (dev server, database)?**
   - YES → Use `post-create` before `-x` command starts
   - NO → Use `post-start` or `post-remove`

3. **Is this a validation or cleanup operation?**
   - YES → Blocking hook, let it finish
   - NO → Non-blocking hook, let it run in background
````

**Impact**: +2 points on D2, clarifying hook strategy.

---

## Detailed Analysis

### D1: Knowledge Delta — 18/20 (90%)

**What's Excellent:**

- Comprehensive wt CLI command coverage
- Non-obvious knowledge: `hash_port` filter, Jinja2 template variables, hook lifecycle
- Real-world patterns: parallel agents, cold-start elimination

**What's Missing:**

- Installation section explains standard package manager commands (minor redundancy, but necessary for completeness)

**Verdict**: This is the skill's strongest dimension. Nearly every line adds knowledge Claude wouldn't have pre-trained.

---

### D2: Mindset + Mechanics — 13/15 (87%)

**What's Excellent:**

- Clear mental model: "make git worktree as easy as git branch"
- Workflows are domain-specific and non-obvious
- Hook lifecycle is explained procedurally

**What's Missing:**

- No decision framework for "when to use which hook"
- No guidance on "before designing hooks, ask yourself..."
- Hook interaction patterns (blocking vs non-blocking combinations) not explained

**Verdict**: Good balance of thinking + domain procedures. Could benefit from decision tree for hook strategy.

---

### D3: Anti-Pattern Quality — 2/15 (13%)

**This is the critical failure.** There is **zero anti-pattern content**.

**What Experts Know (Not Mentioned):**

- Shell integration is MANDATORY or nothing works
- Blocking hooks with `--execute` are deadlock-prone
- Port conflicts happen with careless hook design
- Failed merges leave orphaned branches if not recovered
- Mixing blocking/non-blocking hooks requires careful ordering

**Impact**: Agents using this skill will hit real failure modes and not understand why. This is unacceptable for a tool skill operating on your git state.

---

### D4: Specification Compliance — 15/15 (100%)

**Frontmatter is Perfect:**

- name: valid, concise
- description: comprehensive WHAT/WHEN/KEYWORDS
- Trigger scenarios explicitly stated
- All relevant terms included (wt, git worktree, parallel agents, hooks, wt.toml, etc.)

**No Improvements Needed.**

---

### D5: Progressive Disclosure — 14/15 (93%)

**Structure is Sound:**

- Quick Reference at top (immediately actionable)
- Core Workflows section (essential patterns)
- Advanced sections (hooks, integration)
- Self-contained (no orphan references)

**Minor Gap:**

- Could benefit from "Start Here" section directing first-time users
- No explicit "read order" guidance for learners

**Verdict**: Very good. Self-contained and well-organized. The gap is cosmetic.

---

### D6: Freedom Calibration — 13/15 (87%)

**Appropriate Level:**

- CLI tools need low-ish freedom (exact syntax matters)
- But hook configuration appropriately flexible (Jinja2 templates, custom commands)
- Examples are executable, not pseudocode

**Related to D3 Gap:**

- Freedom for hooks is high, but with no anti-patterns, agents might misuse that freedom
- e.g., "I can put anything in a hook" → leads to broken blocking chains

**Verdict**: Good calibration. Would be perfect with anti-pattern guardrails.

---

### D7: Pattern Recognition — 9/10 (90%)

**Pattern Match: Tool (Excellent)**

- Decision tables ✓
- Code examples ✓
- Reference syntax ✓
- Operational guidance ✓

**Minor Gap:**

- Could have one more decision tree: "which hook to use for which scenario"
- Currently has hook types table, but no "how to choose" guidance

**Verdict**: Masterful pattern application. The gap is small.

---

### D8: Practical Usability — 12/15 (80%)

**What Works:**

- Quick Reference is immediately usable
- Examples are clear and correct
- Hook types table guides selection

**What's Missing:**

- **No error handling**: What if wt merge fails? What if hook hangs?
- **No edge cases**: Windows PATH considerations, monorepo gotchas, large worktree directories
- **No recovery procedures**: How to recover from common failure modes

**Impact**: Agent gets stuck when reality diverges from examples.

**Verdict**: Excellent for happy path. Needs error handling for production use.

---

## Summary & Recommendations

**Grade B is Accurate:** The skill provides excellent domain knowledge (D1, D4, D5, D7) but has critical gaps in anti-patterns (D3) and error handling (D8) that prevent Grade A.

**Immediate Actions (Highest Impact):**

1. **Add anti-pattern list (D3)** — 10-12 point gain
   - NEVER forget shell integration
   - NEVER use blocking hooks with --execute
   - NEVER run post-start for dev server
   - NEVER skip pre-merge hooks
2. **Add error handling section (D8)** — 2-3 point gain
   - Recovery from failed merges
   - Port conflict diagnosis
   - Hook timeout recovery

3. **Add hook decision tree (D2)** — 1-2 point gain
   - Guidance on "when to use which hook"
   - Before/after decision framework

**Post-Improvement Grade: A (109-112/120 = 91-93%)**

---

**Report Generated**: 2026-05-04  
**Evaluator**: skill-judge (automated evaluation)  
**Evaluation Pattern**: Tool Pattern (CLI reference)
