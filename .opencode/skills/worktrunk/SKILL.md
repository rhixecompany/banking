---
name: worktrunk
description: >
  Use this skill when the user asks about Worktrunk (wt), git worktree management, running parallel AI agents with worktrees, setting up wt hooks, configuring wt.toml, using `wt switch`, `wt list`, `wt merge`, `wt remove`, `wt step`, LLM commit messages, or integrating Worktrunk with your AI agent. Also trigger when the user wants to run multiple AI agent sessions in parallel across isolated git branches, or automate dev server / database / dependency setup per worktree. Always use this skill for any question involving the `wt` CLI, worktree lifecycle automation, or the worktrunk plugin.
---

# Worktrunk Skill

Worktrunk (`wt`) is a CLI for git worktree management designed to run AI agents (like Claude Code) in parallel across isolated branches. Think of it as making `git worktree` as easy as `git branch`.

## Quick Reference

| Task | Command |
| --- | --- |
| Create worktree + switch | `wt switch --create feat` |
| Create worktree + launch Claude | `wt switch --create feat -x claude` |
| List all worktrees | `wt list` |
| Merge & clean up | `wt merge main` |
| Remove current worktree | `wt remove` |
| Commit staged changes | `wt step commit` |

## Installation

```bash
# macOS/Linux (recommended)
brew install worktrunk && wt config shell install

# Cargo
cargo install worktrunk && wt config shell install

# Windows
winget install max-sixty.worktrunk
git-wt config shell install
```

Shell integration (`wt config shell install`) is required so that `wt switch` can actually change the shell's directory.

## Core Workflow

### 1. Create and Switch

```bash
wt switch --create feature-auth         # New branch + worktree
wt switch --create feature-auth -x claude  # + launch Claude in it
wt switch existing-branch               # Switch to existing worktree
wt switch -                             # Previous worktree
```

Worktrees are placed at `../repo.branch-name` by default (configurable).

### 2. Inspect Status

```bash
wt list                    # All worktrees with status, commits, CI
wt list --full --branches  # Include remote branches without worktrees
wt list --format=json      # Machine-readable output
```

Key indicators in `wt list`:

- `@` = current worktree
- `+` / `-` = staged / unstaged changes
- `↑` / `↓` = ahead / behind remote
- `⇡` / `⇣` = ahead / behind default branch
- `🤖` = Claude is working (Claude Code plugin)
- `💬` = Claude waiting for input

### 3. Parallel Agents Pattern

```bash
wt switch -x claude -c feature-a -- 'Add user authentication'
wt switch -x claude -c feature-b -- 'Fix the pagination bug'
wt switch -x claude -c feature-c -- 'Write tests for the API'
```

`-x` / `--execute` runs a command after switching; arguments after `--` are passed to it.

### 4. Merge or Clean Up

**PR workflow:**

```bash
wt step commit              # Commit staged changes with optional LLM message
gh pr create                # Open PR
wt remove                   # After PR merged
```

**Local merge (squash + rebase + fast-forward):**

```bash
wt merge main
# Commits, rebases onto main, fast-forward merges, removes worktree
```

## Hooks

Hooks automate worktree lifecycle events. Define in `.config/wt.toml` (project) or `~/.config/worktrunk/config.toml` (user/global).

See `references/hooks.md` for the full hook reference, template variables, and common patterns (dev servers, databases, cold-start elimination).

### Hook Types at a Glance

| Hook          | When                | Blocking               |
| ------------- | ------------------- | ---------------------- |
| `post-create` | After creation      | Yes (blocks --execute) |
| `post-start`  | After creation      | No (background)        |
| `post-switch` | Every switch        | No                     |
| `pre-commit`  | Before merge commit | Yes                    |
| `pre-merge`   | Before merge        | Yes                    |
| `post-merge`  | After merge         | Yes                    |
| `pre-remove`  | Before removal      | Yes                    |
| `post-remove` | After removal       | No                     |

### Essential Hook Patterns

**Eliminate cold starts** (copy deps/caches/env from main):

```toml
[post-start]
copy = "wt step copy-ignored"
```

**Dev server per worktree** (deterministic port from branch name):

```toml
[post-start]
server = "npm run dev -- --port {{ branch | hash_port }}"
[pre-remove]
server = "lsof -ti :{{ branch | hash_port }} -sTCP:LISTEN | xargs kill 2>/dev/null || true"
```

**Local CI gate** (run tests before merge):

```toml
[pre-merge]
test = "npm test"
build = "npm run build"
```

## Template Variables & Filters

In hook commands (Jinja2 syntax):

| Variable               | Value                            |
| ---------------------- | -------------------------------- |
| `{{ branch }}`         | Branch name                      |
| `{{ repo }}`           | Repository directory name        |
| `{{ worktree_path }}`  | Absolute path to this worktree   |
| `{{ default_branch }}` | Default branch name              |
| `{{ target }}`         | Target branch (merge hooks only) |

| Filter | Example | Output |
| --- | --- | --- |
| `sanitize` | `{{ branch \| sanitize }}` | `/` and `\` → `-` |
| `sanitize_db` | `{{ branch \| sanitize_db }}` | DB-safe identifier |
| `hash_port` | `{{ branch \| hash_port }}` | Stable port 10000-19999 |

## LLM Commit Messages

Generate commit messages from diffs:

```bash
wt step commit              # Commit staged changes, generate message
wt step commit --all        # Stage all + commit
```

Configure in `~/.config/worktrunk/config.toml`:

```toml
[commit.generation]
model = "claude-opus-4-5"   # or any supported model
provider = "anthropic"
```

## Claude Code Integration

Install the plugin for activity tracking (`🤖` / `💬` in `wt list`) and configuration skill:

```bash
claude plugin marketplace add max-sixty/worktrunk
claude plugin install worktrunk@worktrunk
```

Add to `~/.claude/settings.json` for statusline:

```json
{
  "statusLine": {
    "type": "command",
    "command": "wt list statusline --format=claude-code"
  }
}
```

## Zellij Integration

Spawn agent handoffs directly into Zellij panes (great with your existing Zellij setup):

```bash
zellij run -- wt switch --create fix-auth -x claude -- \
  'Fix the session timeout bug in auth module'
```

Or use hooks for a full multi-pane layout per worktree:

```toml
# .config/wt.toml
[post-create]
zellij = """
zellij action new-tab --name {{ branch | sanitize }}
zellij action new-pane -- claude
"""
```

## Choosing the Right Hook

Hook types are powerful, but choosing correctly prevents deadlocks and corruption. Use this decision framework:

| Scenario | Hook | Blocking? | Why |
| --- | --- | --- | --- |
| **Copy deps/cache from main** | `post-start` | No | Runs after creation; non-blocking so agent can proceed immediately |
| **Run local CI (test/build)** | `pre-merge` | Yes | Must validate before merge; wait for results |
| **Start dev server** | `post-create` | No | Use non-blocking so `-x` command starts after setup completes |
| **Notify when done** | `post-merge` | No | Non-blocking notification after merge completes |
| **Clean up before removal** | `pre-remove` | Yes | Must cleanup before worktree removed; wait for cleanup to finish |
| **DB migrations** | `post-create` | Yes | Blocking: migration must complete before work begins |

**Decision Tree (Use This Before Writing Hooks):**

1. **Does this hook have side effects that must complete before work starts?**
   - YES → Use `post-create` with blocking (`[post-create]`), or `pre-merge` for merge validation
   - NO → Use `post-start`, `post-merge`, or `post-remove`

2. **Is this hook time-sensitive (dev server, database)?**
   - YES → Use `post-create` and ensure it finishes before `-x` command starts
   - NO → Use `post-start` or `post-remove`

3. **Is this a validation or cleanup operation?**
   - YES → Blocking hook, let it finish completely
   - NO → Non-blocking hook, let it run in background

**Trade-offs Summary:**

- **Blocking hooks**: Safe, but slower startup; use for critical setup
- **Non-blocking hooks**: Fast, but can race; use for notifications and background work
- **Mixing blocking + non-blocking**: Sequential ordering; first blocking hooks run, then non-blocking in parallel

## Common Mistakes to Avoid

### NEVER Forget Shell Integration

```bash
# ❌ WRONG: Installation incomplete
brew install worktrunk
wt switch --create feat
# Your shell stays in the current directory! wt created the worktree but didn't change directory.

# ✅ CORRECT: Enable shell integration
brew install worktrunk
wt config shell install  # Required for Bash/Zsh/Fish/PowerShell
wt switch --create feat  # Now your shell actually changes directory
```

**Why This Matters**: Without shell integration, `wt switch` creates and manages the worktree, but your shell never changes to it. The worktree exists but you're still in the original directory. This breaks the entire workflow.

**How to Fix**: Run `wt config shell install` once. It adds shell hooks to your `.bashrc`, `.zshrc`, or equivalent. Then `wt switch` works as expected.

### NEVER Use Blocking Hooks with --execute

```bash
# ❌ WRONG: This deadlocks if .config/wt.toml has blocking [post-create]
wt switch -c feature-a -x claude -- 'Add auth module'

# When -x is used:
# 1. wt switch creates worktree
# 2. [post-create] blocking hooks run (database setup, npm install, etc.)
# 3. wt waits for all blocking hooks to finish
# 4. THEN -x command (claude) starts
#
# But if [post-create] has a long-running service or blocks forever,
# Claude never launches, and wt switch never returns.

# ✅ CORRECT: Use non-blocking post-start for setup
# .config/wt.toml
[post-start]
setup = "npm install"  # Non-blocking; agent can proceed

# Then:
wt switch -c feature-a -x claude -- 'Add auth module'  # Works!
```

**Why This Matters**: `--execute` (the `-x` flag) spawns your command (e.g., Claude) immediately after post-create hooks finish. If `post-create` is blocking and hangs, your agent never starts.

**How to Fix**: Use `[post-start]` for non-critical setup (deps, cache copies). Reserve `[post-create]` for essential, quick operations only.

### NEVER Run post-start for Dev Server

```toml
# ❌ WRONG: post-start runs every time you switch
[post-start]
dev = "npm run dev"  # Runs when switching to main, to feature-x, everywhere

# Scenario:
# 1. wt switch -c feature-a  → npm run dev starts on port 15000
# 2. Later: wt switch main   → npm run dev starts AGAIN on port 15000
# 3. TWO servers fighting for port 15000 → unpredictable behavior

# ✅ CORRECT: Use post-create, and clean up with pre-remove
[post-create]
dev = "npm run dev"

[pre-remove]
dev = "lsof -ti :{{ branch | hash_port }} | xargs kill 2>/dev/null || true"
```

**Why This Matters**: `post-start` fires every time you switch worktrees, including back to main. If you run a dev server in `post-start`, you'll have multiple servers competing for the same port (or different ports if using `hash_port`), wasting resources.

**How to Fix**: Use `[post-create]` to start the dev server once, and `[pre-remove]` to kill it when the worktree is deleted.

### NEVER Skip pre-merge Hooks

```bash
# ❌ WRONG: Bypassing safety checks
wt merge --skip-hooks main
# This merges even if [pre-merge] tests or lint would fail
# You now have broken code in main

# ✅ CORRECT: Always run pre-merge hooks
wt merge main
# If [pre-merge test] fails, merge is aborted
# You fix the issues, commit, then merge again
```

**Why This Matters**: Pre-merge hooks (lint, test, build) validate that your branch is safe to merge. Skipping them pushes broken code to main and blocks other agents/developers.

**How to Fix**: Always run `wt merge` without `--skip-hooks`. If merge fails, fix the issue, add a commit, and try again. The `--skip-hooks` flag exists for emergencies only (e.g., production hotfixes where you're running tests separately).

### NEVER Mix Blocking and Non-Blocking Hooks for the Same Event Without Understanding Order

```toml
# ⚠️ PROBLEMATIC: Unclear execution order
[post-create]
install = "npm install"        # Blocking
setup_db = "npm run db:migrate" # Blocking
server = "npm run dev &"        # Non-blocking (note the &)

# What actually happens:
# 1. npm install runs and waits to finish
# 2. npm run db:migrate runs and waits to finish
# 3. npm run dev & runs in background (non-blocking)
# All blocking hooks execute in sequence, then non-blocking run in parallel
#
# BUT if npm run dev fails to start correctly (bad PORT, etc.),
# the entire post-create is considered failed!

# ✅ CORRECT: Separate blocking and non-blocking
[post-create]
install = "npm install"
migrate = "npm run db:migrate"

[post-start]
server = "npm run dev"
```

**Why This Matters**: Worktrunk runs blocking hooks sequentially and non-blocking hooks in parallel. Mixing them can cause race conditions, hidden failures, and hard-to-debug issues. If a non-blocking hook fails, the entire operation may fail unexpectedly.

**How to Fix**: Keep `[post-create]` (blocking) separate from `[post-start]` (non-blocking). Use `post-create` for critical setup, `post-start` for background services.

### NEVER Leave Failed Merges Unresolved

```bash
# ❌ WRONG: Merge failed, but you ignore it
wt merge main
# [pre-merge test] failed
# Worktree is now in a broken state with conflict markers
# You switch to another worktree and forget about it
#
# Later:
# wt list shows the broken worktree
# You can't remove it because pre-remove hooks hang
# Orphaned worktree blocks port or accumulates disk usage

# ✅ CORRECT: Always resolve and cleanup
wt merge main
# Fix conflicts or test failures
git add .
git commit -m "fix: resolve merge conflicts"
wt merge main --continue  # Resume merge if needed
# OR if merge is truly broken:
git merge --abort
wt remove  # Start fresh
```

**Why This Matters**: Failed merges leave worktrees in undefined states. If you abandon them without cleanup, they consume disk space, block ports, and confuse future operations.

**How to Fix**: Always finish what you start. Either fix the merge conflicts and commit, or abort with `git merge --abort` and `wt remove`.

### NEVER Commit to a Detached Worktree

```bash
# ❌ WRONG: You detached HEAD, now commits are orphaned
git checkout abc123def456  # Detached HEAD
git add .
git commit -m "fix: critical bug"
# Commit is created, but no branch points to it
# When you switch worktrees, those commits are invisible
# `git reflog` might save you, but it's hard to recover

# ✅ CORRECT: Always switch to a branch, not a commit
wt switch --create hotfix-xyz  # Creates a branch, switches to it
git add .
git commit -m "fix: critical bug"
wt merge main  # Merge back to main when done
```

**Why This Matters**: Detached HEAD state in a worktree makes commits invisible to other worktrees. You'll lose work if you forget about them.

**How to Fix**: Always use `wt switch --create <branch>` to create a new branch and worktree. Never manually detach HEAD in a worktree.

### NEVER Nest Git Worktrees

```bash
# ❌ WRONG: Creating a worktree inside another worktree's directory
wt switch --create feature-a
cd ../repo.feature-a
git worktree add ../repo.feature-b feature-b  # Nesting!
# Behavior is undefined: git gets confused about which worktree is active

# ✅ CORRECT: Worktrunk manages all worktrees at the same level
wt switch --create feature-a
# feature-a worktree is at ../repo.feature-a

wt switch --create feature-b
# feature-b worktree is at ../repo.feature-b
# Both are siblings, not nested
```

**Why This Matters**: Nested worktrees confuse git and worktrunk. State becomes inconsistent; operations may fail silently or corrupt the repository.

**How to Fix**: Always use `wt switch --create` or `wt switch` to manage worktrees. Never use `git worktree` directly if you're using Worktrunk.

## Troubleshooting & Error Recovery

### wt merge Left Worktree in Broken State

**Symptom**: After `wt merge main`, the worktree shows conflicted or dirty state in `wt list`. You can't commit or switch.

**Root Cause**: Pre-merge hook (tests, lint, build) failed, and you abandoned the worktree without resolving it.

**Diagnosis**:

```bash
wt list  # Shows +/- (dirty) or ⚠ (conflict)
git status  # Shows conflicts or untracked files
git log --oneline -n 3  # See recent commits
```

**Recovery**:

```bash
# Option 1: Resolve and continue
git status  # See what's broken
# Fix conflicts in your editor
git add .
git commit -m "fix: resolve merge conflicts"

# Option 2: Abort and start fresh
git merge --abort
wt remove --force  # Force remove if cleanup hangs
wt switch --create <new-branch>  # Start over
```

### Port Already in Use (hash_port Collision)

**Symptom**: Dev server fails to start: `Error: Port X already in use`. Other worktrees work fine.

**Root Cause**: Another worktree's dev server is still running (previous merge didn't clean up), or a previous worktree's cleanup hook failed.

**Diagnosis**:

```bash
lsof -ti :<PORT>  # Find process using port (macOS/Linux)
netstat -ano | findstr :<PORT>  # Windows
wt list  # Check all worktrees for status
```

**Recovery**:

```bash
# Find the culprit:
wt list  # See which worktree should own this port

# Kill the process:
lsof -ti :<PORT> | xargs kill -9  # macOS/Linux
kill -9 $(lsof -ti :<PORT>)  # Alternative

# Or, use the cleanup hook:
wt switch <offending-worktree>
wt remove --force  # Force removal with cleanup

# Verify port is free:
lsof -ti :<PORT>  # Should return nothing
```

**Prevention**: Always use `pre-remove` hooks to clean up ports:

```toml
[pre-remove]
server = "lsof -ti :{{ branch | hash_port }} | xargs kill -9 2>/dev/null || true"
```

### post-create Hook Hangs (Infinite Wait)

**Symptom**: `wt switch --create feature-a` hangs forever. Nothing happens after 30+ seconds.

**Root Cause**: A blocking hook is running a long-lived process (dev server, database daemon) without backgrounding it, or is stuck in a subprocess.

**Diagnosis** (in another terminal):

```bash
ps aux | grep wt
ps aux | grep <hook-command>  # See what's actually running
wt list  # Shows worktree in "creating" state
```

**Recovery**:

```bash
# In another terminal:
kill -9 <PID>  # Kill the hanging wt process
# Or kill the actual blocking subprocess

# Clean up:
rm -rf ../repo.feature-a  # Remove half-created worktree
wt list  # Verify it's gone
```

**Prevention**: Review `.config/wt.toml` for blocking hooks that run servers. Move long-lived processes to `[post-start]` (non-blocking) or ensure they run in background:

```toml
# ❌ WRONG (blocks)
[post-create]
server = "npm run dev"

# ✅ CORRECT (non-blocking)
[post-start]
server = "npm run dev &"  # Background process
# OR use post-start which is inherently non-blocking
```

### Hook Timeout Exceeded

**Symptom**: Hook runs but exceeds the default timeout (usually 5-10 minutes). Worktrunk kills the hook and fails the operation.

**Root Cause**: Hook performs a slow operation (large npm install, database migration, E2E tests) that legitimately takes longer.

**Diagnosis**:

```bash
# Run the hook manually:
npm install  # See how long it actually takes
bun install  # Might be faster
```

**Recovery**:

```toml
# Increase hook timeout (in .config/wt.toml)
[hooks]
timeout = 300  # 5 minutes (default)
# OR set per-hook:
[post-create]
install = { cmd = "npm install", timeout = 600 }  # 10 minutes
```

Or optimize the hook:

```toml
# Use faster alternatives
[post-create]
install = "bun install"  # Faster than npm

# OR background it:
[post-start]
install = "bun install &"  # Non-blocking
```

### Worktree Detached After Failed Switch

**Symptom**: After failed `wt switch`, your git HEAD is detached (not on any branch). `git status` shows: `HEAD detached at abc123`.

**Root Cause**: `wt switch` encountered an error (merge conflict, untracked files blocking checkout) partway through, leaving you in an inconsistent state.

**Diagnosis**:

```bash
git status  # Shows detached HEAD
git log --oneline -n 1  # See where you're detached at
```

**Recovery**:

```bash
# Option 1: Return to previous branch
git checkout -  # Go back to previous branch

# Option 2: Create a branch at current commit (save work)
git checkout -b recovery-branch

# Option 3: Hard reset (discard work)
git reset --hard HEAD~1
```

Then investigate what went wrong:

```bash
git merge --abort  # If mid-merge
wt switch main  # Go back to main
# Fix the root cause (conflicts, untracked files, etc.)
wt switch --create <new-branch>  # Try again
```

### Out of Disk Space

**Symptom**: `wt switch` fails with "no space left on device." Operations hang or crash.

**Root Cause**: Too many worktrees accumulated with node_modules, build artifacts, and cache directories.

**Diagnosis**:

```bash
du -sh ../repo.*  # See disk usage per worktree
wt list  # List all worktrees
```

**Recovery**:

```bash
# Remove unused worktrees
wt list
wt switch main
wt remove  # Removes current worktree

# Clean up old branches:
for branch in $(git branch --merged main | grep -v main); do
  git branch -d $branch
done

# Clear npm/build caches globally:
rm -rf ~/.npm ~/.next ~/.bun

# Use symlinks for node_modules (if supported):
# Link all node_modules to a shared copy to save space
```

**Prevention**: Use Worktrunk hooks to copy (not reinstall) deps:

```toml
[post-start]
copy = "wt step copy-ignored"  # Copies node_modules from main
```

## Common Commands for devops Work

For microservice's repos, a typical `.config/wt.toml`:

```toml
[post-create]
env = "cp {{ primary_worktree_path }}/.env.local .env.local 2>/dev/null || true"

[post-start]
copy = "wt step copy-ignored"

[pre-merge]
lint = "make lint"
test = "make test"

[post-merge]
notify = "echo '✓ Merged {{ branch }} → {{ target }}'"
```

## Further Reference

- `references/hooks.md` — Complete hook documentation with all patterns
- `references/commands.md` — Full command reference (switch, list, merge, remove, step, config)
- Official docs: https://worktrunk.dev
- Claude Code integration: https://worktrunk.dev/claude-code/
- Tips & patterns: https://worktrunk.dev/tips-patterns/
