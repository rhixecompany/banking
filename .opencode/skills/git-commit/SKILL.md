---
name: git-commit
description: Create conventional git commits with intelligent staging and message generation.
lastReviewed: 2026-04-29
applyTo: "**/*"
platforms:
  - opencode
  - cursor
  - copilot
---

# Git Commit - Conventional Commits

## Overview

This skill provides comprehensive guidelines for creating conventional git commits. It covers commit message format, intelligent staging, and best practices for the Banking project.

## Multi-Agent Commands

### OpenCode
```bash
# Stage and commit with conventional message
git commit -m "feat: add wallet connection"

# Interactive staging
git add -p

# View commit history
git log --oneline -20
```

### Cursor
```
@git-commit
Commit the banking feature changes
```

### Copilot
```
/git commit add login feature
```

## Commit Message Format

### Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance |
| `perf` | Performance |
| `ci` | CI/CD changes |

### Examples

```bash
# Feature
git commit -m "feat(wallet): add Plaid link integration"

# Fix
git commit -m "fix(auth): resolve session timeout issue"

# Documentation
git commit -m "docs: update API documentation"

# Refactor
git commit -m "refactor(dal): simplify transaction queries"

# Test
git commit -m "test: add wallet connection tests"

# Chore
git commit -m "chore(deps): update Drizzle ORM"
```

## Intelligent Staging

### Stage by Pattern

```bash
# Stage all new files
git add .

# Stage by pattern
git add "**/*.ts"
git add "**/*.tsx"
git add "!**/*.test.ts"

# Stage modified files only
git add -u
```

### Interactive Staging

```bash
# Stage hunks interactively
git add -p

# Stage specific files
git add -p file1.ts file2.ts

# Stage by directory
git add --patch src/components/
```

### Stage with Intent

```bash
# Stage with intent message
git add -v file.ts

# Stage and see what will be committed
git diff --cached
```

## Banking Project Conventions

### Feature Commits

```bash
# Wallet feature
git commit -m "feat(wallet): add connect wallet flow

- Implement Plaid Link integration
- Add wallet DAL methods
- Add connection status UI

Closes #123"

# Transaction feature
git commit -m "feat(transaction): add transfer functionality

- Implement Dwolla transfer API
- Add transfer validation
- Add transaction history view

Refs #456"
```

### Fix Commits

```bash
# Bug fix with context
git commit -m "fix(auth): resolve login redirect loop

The login flow was redirecting to /dashboard even when
authentication failed due to missing session check.

Fixes #789"

# Security fix
git commit -m "fix(security): sanitize user input in forms

- Add XSS prevention
- Validate all form inputs
- Update validation-skill documentation

Security: CVE-2024-12345"
```

### Refactor Commits

```bash
# Refactoring
git commit -m "refactor(dal): extract common query patterns

- Create base query builder
- Simplify N+1 pattern in transaction.dal.ts
- Add documentation

No functional changes"
```

## Commit Best Practices

### 1. Write Descriptive Messages

```bash
# Bad
git commit -m "fixed it"

# Good
git commit -m "fix(wallet): resolve balance display issue

The wallet balance was not updating after transactions
due to missing cache invalidation.

Root cause: Cache was not cleared on transaction completion"
```

### 2. Keep Commits Atomic

```bash
# One feature per commit
git commit -m "feat(ui): add wallet card component"
git commit -m "feat(dal): add findByUserId method"
git commit -m "feat(api): add /api/wallets endpoint"

# Not
git commit -m "feat: add wallet card, dal method, and API"
```

### 3. Reference Issues

```bash
# Close issue
git commit -m "feat: add feature

Closes #123"

# Reference issue
git commit -m "feat: add feature

Refs #123"

# Multiple references
git commit -m "feat: add feature

Closes #123
Fixes #456"
```

### 4. Use Body for Context

```bash
git commit -m "feat(auth): add JWT refresh token

The refresh token endpoint now returns a new access token
without requiring re-authentication.

Implementation:
- Add refresh token to database
- Implement token rotation
- Add expiration handling

Testing:
- Add unit tests for token refresh
- Add integration tests for auth flow"
```

## Advanced Patterns

### Squashing Commits

```bash
# Interactive rebase to squash
git rebase -i HEAD~3

# Squash all commits into one
git reset --soft HEAD~3
git commit -m "feat: complete feature"
```

### Amending Commits

```bash
# Amend last commit
git commit --amend

# Amend with new message
git commit --amend -m "feat: updated message"

# Amend to add files
git add forgotten-file.ts
git commit --amend --no-edit
```

### Cherry-Picking

```bash
# Cherry-pick a commit
git cherry-pick <commit-hash>

# Cherry-pick without commit
git cherry-pick -n <commit-hash>
```

## Git Hooks

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/sh
npx lint-staged
npm run verify:rules
npm run type-check
```

### Commit Message Hook

```bash
# .git/hooks/commit-msg
#!/bin/sh
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

if ! echo "$COMMIT_MSG" | grep -qE '^(feat|fix|docs|style|refactor|test|chore|perf|ci)(\(.+\))?: .+'; then
  echo "Invalid commit message format"
  exit 1
fi
```

## Troubleshooting

### Accidental Commit to Wrong Branch

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Switch to correct branch
git checkout correct-branch

# Commit again
git commit -m "feat: add feature"
```

### Merge Conflicts in Commit

```bash
# Resolve conflicts
git status
# Edit conflicted files
git add resolved-file.ts

# Continue rebase
git rebase --continue

# Or abort
git rebase --abort
```

### Large Commit

**Problem**: Commit is too large
**Solutions**:
1. Split into smaller commits: `git rebase -i`
2. Use partial staging: `git add -p`
3. Split by directory: `git add src/feature-a/ && git commit`

## Cross-References

- **gh-cli**: For GitHub integration
- **babysit**: For PR maintenance
- **code-review**: For review patterns

## Validation Commands

```bash
# Check commit message format
git log --format="%s" | head -20

# View commit details
git show --stat HEAD

# Verify staged changes
git diff --cached --stat
```

## Performance Tips

1. Use aliases for common commands
2. Enable git auto-gc periodically
3. Use shallow clones for large repos
4. Cache credentials securely