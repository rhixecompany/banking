---
name: babysit
description: >-
  Keep a PR merge-ready by triaging comments, resolving clear conflicts, and fixing CI in a loop. Use when a PR needs ongoing maintenance, has failing checks, has merge conflicts, or needs comment resolution.
---

# Babysit PR

Your job is to get this PR to a merge-ready state. This is a loop-based skill - you repeat the cycle until the PR is ready.

## When to Use This Skill

- PR has failing CI checks that need fixing
- PR has merge conflicts with base branch
- PR has unresolved comments needing triage
- PR needs ongoing maintenance until mergeable
- User asks to "babysit" or "watch" a PR

## The Babysit Loop

```
┌─────────────────────────────────────┐
│  1. Check PR Status                 │
│     - Comments, CI, conflicts       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  2. Triage Issues                   │
│     - Categorize: fix/ask/ignore    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  3. Execute Fixes                   │
│     - Apply scoped fixes            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  4. Push and Re-watch CI            │
│     - Wait for checks               │
└──────────────┬──────────────────────┘
               ↓
         ┌─────┴─────┐
         │ Mergeable?│
         └─────┬─────┘
           yes ↓ no
         ┌─────┴─────┐
         │  DONE     │ → Return to user
         └───────────┘
```

## Step 1: Check PR Status

### Get PR Information
```bash
# Get PR details
gh pr view <PR-number> --json title,state,mergeable,comments

# Get latest CI status
gh pr checks <PR-number>

# List all comments
gh pr view <PR-number> --comments
```

### Assess Current State

| State | Meaning | Action Needed |
|-------|---------|---------------|
| MERGEABLE + GREEN | Ready to merge | Return success |
| MERGEABLE + RED | Has CI failures | Fix CI |
| CONFLICTING + ANY | Has merge conflicts | Resolve conflicts |
| PENDING + ANY | CI still running | Wait and re-check |

## Step 2: Triage Issues

### Categorize Each Issue

**Type A: Clear Fix** (Just do it)
- Typos, formatting, minor bugs
- Obvious refactoring improvements
- Missing tests for existing functionality
- **Action:** Fix immediately, push, re-watch

**Type B: Needs Clarification** (Ask first)
- Intent unclear from comment
- Suggested change seems wrong
- Conflicting feedback from multiple reviewers
- **Action:** Ask for clarification, don't guess

**Type C: Disagree** (Explain your reasoning)
- You believe the comment is incorrect
- The suggestion would introduce problems
- The change is out of scope
- **Action:** Politely explain why, don't just ignore

**Type D: Won't Fix** (Note and move on)
- Out of scope for this PR
- Better handled in a follow-up
- Invalid or no longer relevant
- **Action:** Note in reply, don't fix

### Comment Triage Template

For each comment, note:
```
Comment by: [reviewer]
Type: [A/B/C/D]
Reasoning: [why you chose this type]
Action: [fix/ask/ignore]
```

## Step 3: Execute Fixes

### For Type A (Clear Fixes)

**Process:**
1. Make the minimal fix
2. Commit with descriptive message
3. Push to update PR
4. Don't rebase (preserve history)

**Example:**
```bash
# Fix typo in comment
git add -p  # Select only the hunk
git commit -m "fix: correct typo in error message"
git push
```

### For Type B (Clarification Needed)

**Process:**
1. Don't make changes yet
2. Ask clear question in reply
3. Wait for response before proceeding

**Example:**
```
@reviewer - Could you clarify what you mean by "this approach"? 
Are you concerned about performance, readability, or something else?
```

### For Type C (Disagreement)

**Process:**
1. Explain your reasoning clearly
2. Provide evidence (tests, benchmarks, docs)
3. Suggest alternative if possible
4. If they insist, then fix

**Example:**
```
@reviewer - I see your point about X, but I chose this approach because:
1. It matches the pattern used in file Y
2. The alternative would break feature Z
3. We discussed this in issue #123

Would it help to add a comment explaining this choice?
```

### For Type D (Won't Fix)

**Process:**
1. Reply explaining why not
2. Offer to address in follow-up
3. Move on

**Example:**
```
@reviewer - Good point about X. However, this is out of scope for 
this PR (it's a refactoring, not a feature change). Created issue #456 
to track adding tests for this scenario.
```

## Step 4: Handle Merge Conflicts

### When Conflicts Occur

**DO:**
- Sync with base branch: `git fetch origin && git merge origin/main`
- Resolve conflicts only when intent is clearly the same
- Test after resolving before pushing

**DON'T:**
- Force push to override conflicts
- Resolve conflicts blindly without understanding
- Delete branches or lose work

### Conflict Resolution Process

1. **Fetch and merge:**
   ```bash
   git fetch origin
   git merge origin/main
   ```

2. **Identify conflict files:**
   ```bash
   git status
   ```

3. **Resolve each conflict:**
   - Open each file
   - Look for `<<<<<<<`, `=======`, `>>>>>>>`
   - Choose or combine changes
   - Remove conflict markers

4. **Verify and test:**
   ```bash
   git add .
   git commit -m "merge: resolve conflicts with main"
   git push
   ```

5. **If unsure:** Stop and ask for clarification

## Step 5: Handle CI Failures

### CI Failure Categories

| Category | Example | Fix Strategy |
|----------|---------|--------------|
| Test Failure | Unit test broke | Fix the test or the code |
| Lint Error | Formatting issue | Auto-fix or fix manually |
| Build Error | TypeScript error | Fix compilation error |
| Security | Vulnerability found | Update dependency |
| Integration | External API down | Skip or mock in test |

### CI Fix Process

1. **Get CI logs:**
   ```bash
   gh run view <run-id> --log
   ```

2. **Identify root cause:**
   - Read error message carefully
   - Find the actual failure, not just symptoms
   - Check if it's a flake (intermittent)

3. **Apply minimal fix:**
   - Fix only what's broken
   - Don't make unrelated changes
   - Don't add new features

4. **Push and re-watch:**
   ```bash
   git add -p
   git commit -m "fix: resolve CI failure"
   git push
   # Wait for CI to complete
   ```

5. **If CI is flaky:**
   - Re-run failed jobs
   - Note in PR if known issue
   - Don't mask real failures

## The Loop: Repeat Until Mergeable

After each fix cycle:
1. Check PR status again
2. Re-triage any new comments
3. Wait for CI to pass
4. Check for new conflicts

Continue until:
- ✅ All Type A issues fixed
- ✅ All Type B issues clarified
- ✅ CI is green
- ✅ No merge conflicts
- ✅ No unresolved Type A comments

## Exit Criteria

The PR is merge-ready when:
- [ ] CI passes (all checks green)
- [ ] No merge conflicts
- [ ] All clear-fix comments addressed
- [ ] Clarification questions answered
- [ ] Disagreements explained or resolved

**Return to user with:**
- Summary of what was fixed
- Any outstanding issues requiring human input
- Confirmation PR is ready (or what's blocking it)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Multiple reviewers disagree | Ask for maintainer arbitration |
| CI keeps failing for same reason | Fix root cause, not symptoms |
| Conflict resolution unclear | Stop and ask for help |
| Comment seems invalid | Reply explaining why, don't ignore |
| PR is blocked by policy | Explain what's needed to unblock |

## Best Practices

1. **Small, focused fixes** - Don't refactor while babysitting
2. **One issue at a time** - Fix, push, wait, repeat
3. **Always test after conflicts** - Don't assume it works
4. **Document your reasoning** - For disagreement explanations
5. **Don't guess** - Ask when unclear
6. **Respect scope** - Don't add new features
7. **Communicate status** - Update user on progress
