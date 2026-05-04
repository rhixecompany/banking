---
name: glab
description: "Expert guidance for using the GitLab CLI (glab) to manage GitLab resources from the terminal. Use when: (1) Creating, reviewing, or merging merge requests (glab mr), (2) Managing issues and linking to MRs (glab issue), (3) Monitoring or triggering CI/CD pipelines (glab ci, glab pipeline), (4) Cloning or forking repositories (glab repo), (5) Troubleshooting authentication or command failures. Includes command syntax, API usage, self-hosted GitLab support, and error diagnosis."
---

# GitLab CLI (glab) Skill

Provides guidance for using `glab`, the official GitLab CLI, to perform GitLab operations from the terminal.

## When to Use This Skill

Invoke when the user needs to:

- Create, review, or manage merge requests
- Work with GitLab issues
- Monitor or trigger CI/CD pipelines
- Clone or manage repositories
- Perform any GitLab operation from the command line

## Prerequisites

Verify glab installation before executing commands:

```bash
glab --version
```

If not installed, inform the user and provide platform-specific installation guidance.

## NEVER Do This

Expert-level anti-patterns that cause silent failures, security breaches, or workflow breakdowns.

### Authentication Mistakes

- **NEVER** use the same GITLAB_TOKEN for both gitlab.com and self-hosted instances without hostname specification
  - **Risk**: Token leakage; commands may target wrong server
  - **Fix**: Always set GITLAB_HOST explicitly: `export GITLAB_HOST=gitlab.example.org`

- **NEVER** commit GITLAB_TOKEN to `.git/config`, scripts, or shell history
  - **Risk**: Tokens exposed in version control and process history
  - **Fix**: Use `glab auth login` (interactive, secure storage) or environment variables with `.gitignore`

- **NEVER** reuse personal tokens for CI/CD pipelines or automation
  - **Risk**: When token owner leaves, all automations break; security audit nightmare
  - **Fix**: Create a dedicated service account token with minimal required scopes

- **NEVER** assume token scope is sufficient without testing
  - **Risk**: "403 Forbidden" or "401 Unauthorized" failures mid-automation
  - **Fix**: Check token scopes: `glab auth status --scopes`; regenerate with `api`, `read_repository`, `write_repository` as needed

### Workflow Pitfalls

- **NEVER** create an MR without pushing the branch first
  - **Symptom**: "not a git repository" or "missing source branch" error
  - **Fix**: Push branch BEFORE creating MR: `git push -u origin branch-name` → `glab mr create`

- **NEVER** forget to link MRs to issues
  - **Risk**: Sprint tracking broken; PR context unclear; release notes incomplete
  - **Fix**: Always use "Closes #123" or "Resolves #123" in MR description

- **NEVER** use pagination flags in `glab api` like `--per-page=100`
  - **Symptom**: "unrecognized flag" error; output truncated silently
  - **Fix**: Use query parameters in URL: `glab api "endpoint?per_page=100&page=1"`

- **NEVER** assume repository permissions without explicit checking
  - **Risk**: Scripts fail with cryptic "404 Not Found" when user lacks access
  - **Fix**: Verify access FIRST: `glab repo view -R owner/repo` should list details

- **NEVER** mix personal and organizational repos without explicit `--org` flag
  - **Risk**: `glab mr list` may return unexpected results from personal forks
  - **Fix**: Be explicit: `glab mr list --org gitlab-org` or `glab mr list -R owner/repo`

### CI/CD Mistakes

- **NEVER** retry a failed pipeline without checking logs first
  - **Risk**: Same failure repeats; wasting CI minutes; masks underlying issue
  - **Fix**: Diagnose BEFORE retry: `glab ci trace` → `glab ci retry`

- **NEVER** skip `glab ci lint` before pushing `.gitlab-ci.yml` changes
  - **Risk**: Pipeline fails to trigger; no error message until push
  - **Fix**: Always lint locally: `glab ci lint` before `git push`

- **NEVER** assume pipeline variables are set globally
  - **Risk**: Job fails with "undefined variable" in production
  - **Fix**: Check: `glab ci variable list`; set if missing: `glab ci variable set VAR_NAME value`

## Philosophy: When to Use glab vs Web UI

| Task | Tool | Why | Example |
| --- | --- | --- | --- |
| **Create single MR** | glab CLI | Faster; no mouse clicks | `glab mr create --title "Fix bug"` |
| **Review with inline comments** | Web UI | Better context; discussion threads | Complex code review feedback |
| **Batch-update 10+ issues** | glab API | Scripting; automation | `glab api --paginate "issues?state=opened"` + bulk close |
| **First-time MR setup** | Web UI | Visual; onboarding | New contributor learning workflow |
| **Monitor live pipeline** | glab CLI | Real-time; no browser overhead | `glab pipeline ci view` during deployment |
| **Approve with conditions** | Web UI | Approval rules UI; configuration | Complex merge rules (minimum reviewers, etc.) |
| **Extract data for reporting** | glab API + jq | Flexible; JSON parsing | `glab mr list --output=json \| jq '.[] .merged_at'` |
| **Troubleshoot broken pipeline** | glab CLI | Logs accessible; no browser tab switching | `glab ci trace` |

**Hybrid Strategy**: Use glab for **reads** (list, status, view) and **simple writes** (create, approve); use Web UI for **complex writes** (setting rules, bulk approvals, branch protection) and **collaborative decisions**.

## Authentication Quick Start

Most glab operations require authentication:

```bash
# Interactive authentication
glab auth login

# Check authentication status
glab auth status

# For self-hosted GitLab
glab auth login --hostname gitlab.example.org

# Using environment variables
export GITLAB_TOKEN=your-token
export GITLAB_HOST=gitlab.example.org  # for self-hosted
```

## Core Workflows

### Creating a Merge Request

```bash
# 1. Ensure branch is pushed
git push -u origin feature-branch

# 2. Create MR
glab mr create --title "Add feature" --description "Implements X"

# With reviewers and labels
glab mr create --title "Fix bug" --reviewer=alice,bob --label="bug,urgent"
```

### Reviewing Merge Requests

```bash
# 1. List MRs awaiting your review
glab mr list --reviewer=@me

# 2. Checkout MR locally to test
glab mr checkout <mr-number>

# 3. After testing, approve
glab mr approve <mr-number>

# 4. Add review comments
glab mr note <mr-number> -m "Please update tests"
```

### Managing Issues

```bash
# Create issue with labels
glab issue create --title "Bug in login" --label=bug

# Link MR to issue
glab mr create --title "Fix login" --description "Closes #<issue-number>"

# List your assigned issues
glab issue list --assignee=@me
```

### Monitoring CI/CD

```bash
# Watch pipeline in progress
glab pipeline ci view

# Check pipeline status
glab ci status

# View logs if failed
glab ci trace

# Retry failed pipeline
glab ci retry

# Lint CI config before pushing
glab ci lint
```

## Common Patterns

### Working Outside Repository Context

When not in a Git repository, specify the repository:

```bash
glab mr list -R owner/repo
glab issue list -R owner/repo
```

### Self-Hosted GitLab

Set hostname for all commands:

```bash
export GITLAB_HOST=gitlab.example.org
# or per-command
glab repo clone gitlab.example.org/owner/repo
```

### Automation and Scripting

Use JSON output for parsing:

```bash
glab mr list --output=json | jq '.[] | .title'
```

### Using the API Command

The `glab api` command provides direct GitLab API access:

```bash
# Basic API call
glab api projects/:id/merge_requests

# IMPORTANT: Pagination uses query parameters in URL, NOT flags
# ❌ WRONG: glab api --per-page=100 projects/:id/jobs
# ✓ CORRECT: glab api "projects/:id/jobs?per_page=100"

# Auto-fetch all pages
glab api --paginate "projects/:id/pipelines/123/jobs?per_page=100"

# POST with data
glab api --method POST projects/:id/issues --field title="Bug" --field description="Details"
```

## Best Practices

1. **Verify authentication** before executing commands: `glab auth status`
2. **Use `--help`** to explore command options: `glab <command> --help`
3. **Link MRs to issues** using "Closes #123" in MR description
4. **Lint CI config** before pushing: `glab ci lint`
5. **Check repository context** when commands fail: `git remote -v`
6. **Batch operations** with `glab api --paginate` instead of loops
7. **Test scripts** on a non-critical repository before production automation

## When to Automate with glab

**glab excels at**:

- **Batch operations** (close 50 issues, merge 10 MRs): `glab api --paginate` + filtering
- **Scripting in CI/CD**: `glab mr list --output=json | jq '.[] .title'`
- **Monitoring workflows**: Watch pipelines, check MR status, trigger automations
- **Data extraction**: Pull metrics, generate reports, audit trail analysis

**Don't use glab for**:

- **Visual workflows**: Code review with inline comments (use Web UI)
- **Approval rule configuration**: Merge rules, branch protection (Web UI only)
- **One-off operations**: Creating a single MR (either works; UI may be faster for new users)

## Common Commands Quick Reference

**Merge Requests:**

- `glab mr list --assignee=@me` - Your assigned MRs
- `glab mr list --reviewer=@me` - MRs for you to review
- `glab mr create` - Create new MR
- `glab mr checkout <number>` - Test MR locally
- `glab mr approve <number>` - Approve MR
- `glab mr merge <number>` - Merge approved MR

**Issues:**

- `glab issue list` - List all issues
- `glab issue create` - Create new issue
- `glab issue close <number>` - Close issue

**CI/CD:**

- `glab pipeline ci view` - Watch pipeline
- `glab ci status` - Check status
- `glab ci lint` - Validate .gitlab-ci.yml
- `glab ci retry` - Retry failed pipeline

**Repository:**

- `glab repo clone owner/repo` - Clone repository
- `glab repo view` - View repo details
- `glab repo fork` - Fork repository

## Progressive Disclosure: When to Load References

For detailed command documentation and troubleshooting, reference files provide progressive disclosure:

- **references/commands-detailed.md** — Comprehensive command reference with all flags and options
- **references/quick-reference.md** — Condensed command cheat sheet (~50 lines)
- **references/troubleshooting.md** — Detailed error scenarios and diagnostic trees

### MANDATORY - Load References When:

**Scenario: "I need all glab commands and their flags"**

- **Load**: `references/commands-detailed.md` (ENTIRE FILE)
- **Why**: Comprehensive; official glab docs reference
- **Do NOT load**: quick-reference.md (too condensed for learning)

**Scenario: "I have an authentication error"**

- **Load**: `references/troubleshooting.md` (ENTIRE FILE)
- **Why**: Diagnostic trees; root-cause analysis
- **Do NOT load**: commands-detailed.md (not relevant to auth failures)

**Scenario: "I need a quick command cheat sheet"**

- **Load**: `references/quick-reference.md` (~50 lines)
- **Why**: Fast lookup; condensed syntax
- **Do NOT load**: commands-detailed.md (overkill; too verbose)

**Scenario: "Automation is failing; need API syntax"**

- **Load**: `references/commands-detailed.md` (API section)
- **Why**: glab api specifics; pagination patterns; POST examples
- **Do NOT load**: quick-reference.md (omits API detail)

## Common Issues Quick Fixes

**"command not found: glab"**

- Verify installation: `glab --version`
- If missing, provide platform-specific installation: macOS (`brew install glab`), Linux (`sudo apt install glab`), Windows (`choco install glab`)

**"401 Unauthorized"** — Diagnostic tree:

1. Check active authentication: `glab auth status`
2. List all authenticated accounts: `glab auth list`
3. If multiple accounts, verify GITLAB_HOST matches: `echo $GITLAB_HOST`
4. If single account, token may have expired: `glab auth refresh`
5. If still failing, regenerate token with required scopes: `api`, `read_repository`, `write_repository`

**"404 Project Not Found"**

- Verify repository name: `git remote -v`
- Check access permissions: `glab repo view -R owner/repo` (should list details, not error)
- If access denied, request permissions from repository maintainer

**"not a git repository"**

- Navigate to Git repository: `cd /path/to/repo`
- OR specify repository explicitly: `glab mr list -R owner/repo`
- Verify Git remote: `git remote -v`

**"source branch already has a merge request"**

- Check existing MRs: `glab mr list --source-branch=branch-name`
- Find the MR and update it: `glab mr update <number> --title "Updated title"`
- OR close old MR and create new one: `glab mr close <old-number>` → `glab mr create`

**"unrecognized flag" error in `glab api`**

- Check if using old pagination syntax: `--per-page=100` (❌ WRONG)
- Use query parameters in URL instead: `glab api "endpoint?per_page=100"` (✓ CORRECT)
- Verify endpoint exists: Check [GitLab API docs](https://docs.gitlab.com/ee/api/)

For detailed troubleshooting, **Load references/troubleshooting.md**.

## Notes

- glab auto-detects repository context from Git remote
- Most commands have `--web` flag to open in browser
- Use `--output=json` for scripting and automation
- Multiple GitLab accounts can be authenticated simultaneously
- Commands respect Git configuration and current repository context
