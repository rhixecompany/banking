---
name: github-issues
description: Create and manage GitHub issues via MCP tools (create, update, label, assign, and search issues).
lastReviewed: 2026-04-29
applyTo: "**/*"
platforms:
  - opencode
  - cursor
  - copilot
---

# GitHub Issues - Banking Project Management

## Overview

This skill provides comprehensive guidelines for creating and managing GitHub issues using MCP tools. It covers issue creation, updates, labeling, assignment, and search patterns.

## Multi-Agent Commands

### OpenCode

```bash
# Create issue
gh issue create --title "Bug: Login fails" --body "Description"

# List issues
gh issue list --state open

# Search issues
gh issue list --search "wallet+label:bug"
```

### Cursor

```
@github-issues
Create a bug report for the transaction issue
```

### Copilot

```
/issue create wallet bug
```

## Issue Creation

### Basic Creation

```bash
# Create issue with title
gh issue create --title "Add wallet connection feature"

# Create with body
gh issue create --title "Feature: Add wallet" --body "Description here"

# Create with labels
gh issue create --title "Bug" --label "bug" --label "priority:high"
```

### Programmatic Creation

```typescript
import { github_agentic_workflows_create_issue } from "@modelcontextprotocol/github";

const issue = await github_agentic_workflows_create_issue({
  owner: "rhixecompany",
  repo: "banking",
  title: "Bug: Transaction fails for large amounts",
  body: `## Description
Transaction amounts over $10,000 fail with error.

## Steps to Reproduce
1. Connect wallet
2. Attempt transfer of $15,000
3. See error

## Expected Behavior
Transfer should complete successfully

## Actual Behavior
Error: "Amount exceeds limit"

## Environment
- App version: 2.1.0
- Browser: Chrome 120
`,
  labels: ["bug", "priority:high"],
  assignees: ["developer"]
});
```

## Issue Updates

### Update Title/Body

```bash
# Update title
gh issue edit 123 --title "Updated title"

# Update body
gh issue edit 123 --body "New description"

# Update both
gh issue edit 123 --title "New" --body "Body"
```

### Add Labels

```bash
# Add single label
gh issue edit 123 --add-label "bug"

# Add multiple labels
gh issue edit 123 --add-label "bug" --add-label "priority:high"

# Remove label
gh issue edit 123 --remove-label "wontfix"
```

### Assignment

```bash
# Assign to user
gh issue edit 123 --assignee "username"

# Unassign
gh issue edit 123 --unassign "username"

# Assign to multiple
gh issue edit 123 --assignee "user1,user2"
```

### State Management

```bash
# Close issue
gh issue close 123

# Reopen issue
gh issue reopen 123

# Mark as completed
gh issue edit 123 --state "closed"
```

## Issue Search

### Basic Search

```bash
# Search by text
gh issue list --search "wallet"

# Search in title
gh issue list --search "title:wallet"

# Search in body
gh issue list --search "body:transfer"
```

### Filter by State

```bash
# Open issues
gh issue list --state open

# Closed issues
gh issue list --state closed

# All issues
gh issue list --state all
```

### Filter by Labels

```bash
# Single label
gh issue list --label "bug"

# Multiple labels (AND)
gh issue list --label "bug" --label "priority:high"

# Any label (OR)
gh issue list --search "label:bug label:feature"
```

### Filter by Assignee

```bash
# Assigned to me
gh issue list --assignee "@me"

# Assigned to specific user
gh issue list --assignee "username"

# Unassigned
gh issue list --unassigned
```

## Banking Project Labels

### Type Labels

| Label           | Description             |
| --------------- | ----------------------- |
| `feature`       | New feature request     |
| `bug`           | Bug report              |
| `enhancement`   | Improvement to existing |
| `documentation` | Docs-related            |
| `question`      | Question from user      |

### Priority Labels

| Label               | Description          |
| ------------------- | -------------------- |
| `priority:critical` | Must fix immediately |
| `priority:high`     | High importance      |
| `priority:medium`   | Normal priority      |
| `priority:low`      | Low priority         |

### Area Labels

| Label              | Description        |
| ------------------ | ------------------ |
| `area:auth`        | Authentication     |
| `area:wallet`      | Wallet operations  |
| `area:transaction` | Transactions       |
| `area:plaid`       | Plaid integration  |
| `area:dwolla`      | Dwolla integration |
| `area:ui`          | User interface     |
| `area:api`         | API endpoints      |

## Issue Templates

### Bug Report Template

```markdown
## Bug Description

[Description of the issue]

## Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior

[What should happen]

## Actual Behavior

[What actually happens]

## Environment

- App version:
- OS:
- Browser:

## Screenshots

[If applicable]

## Additional Context

[Any other information]
```

### Feature Request Template

```markdown
## Feature Summary

[Short description]

## Problem Solved

[What problem does this solve]

## Proposed Solution

[How should it work]

## Alternatives Considered

[Other solutions considered]

## Additional Context

[Any mockups, examples, or notes]
```

## Automation

### Issue Bot

```typescript
// Auto-label based on keywords
async function autoLabel(issue: GitHubIssue) {
  const labels: string[] = [];

  if (issue.title.includes("bug") || issue.body.includes("error")) {
    labels.push("bug");
  }
  if (
    issue.title.includes("feature") ||
    issue.title.includes("add")
  ) {
    labels.push("feature");
  }
  if (
    issue.body.includes("critical") ||
    issue.body.includes("urgent")
  ) {
    labels.push("priority:critical");
  }

  if (labels.length > 0) {
    await github_agentic_workflows_update_issue({
      issue_number: issue.number,
      labels
    });
  }
}
```

### Triage Workflow

```typescript
// Daily triage
async function triageIssues() {
  const issues = await github_agentic_workflows_list_issues({
    state: "open",
    labels: "needs-triage"
  });

  for (const issue of issues) {
    // Add triage label
    // Assign to triage owner
    // Add comment for clarification
  }
}
```

## Best Practices

### 1. Use Descriptive Titles

```bash
# Bad
gh issue create --title "Problem"

# Good
gh issue create --title "Bug: Wallet balance not updating after transfer"
```

### 2. Provide Context

```markdown
## Problem

Explain what you're trying to achieve

## What you've tried

- Approach 1
- Approach 2

## Current workaround

Temporary solution if any
```

### 3. Use Templates

```bash
# Create issue from template
gh issue create --template "bug.md"
```

### 4. Link Related Issues

```bash
# Reference in body
This is related to #123

# Close with commit
Closes #123
Fixes #456
```

## Cross-References

- **gh-cli**: For CLI commands
- **babysit**: For PR maintenance
- **code-review**: For review workflow

## Validation Commands

```bash
# List open issues
gh issue list --state open

# View issue details
gh issue view 123

# Check labels
gh label list
```

## Performance Tips

1. Use saved searches for common filters
2. Bulk update issues when possible
3. Use projects for organization
4. Automate routine triage
