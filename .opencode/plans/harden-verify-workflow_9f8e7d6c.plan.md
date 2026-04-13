# Harden Verify Workflow — Plan (Option A + Smoke E2E)

## Goals

1. Provide reliable local validation instructions for contributors.
2. Harden CI so Playwright full E2E runs only when safe.
3. Add a fast "smoke" E2E job that runs for every PR to provide quick feedback.
4. Implement Option A trust model (hard-coded maintainers list) to gate `run-e2e` label usage for forked PRs.
5. Document the contributor/maintainer flow.

## MAINTAINERS

- rhixecompany
- adminbot

## Scope

- Edit CI workflows and auto-label workflow to implement gating and smoke/full E2E split.
- Update `scripts/README.md`, `.github/pull_request_template.md`, and add `CONTRIBUTING.md` guidance.
- Do NOT modify actual GitHub secrets in this plan phase — workflows will reference secrets to be set by maintainers.

## Target Files

- scripts/README.md (update local guidance + docker-compose example)
- scripts/verify-agents.sh (ensure SKIP_E2E handling documented)
- scripts/verify-agents.ps1 (document SKIP_E2E)
- .github/workflows/verify-agents.yml (CI: type-check, lint, unit, smoke-e2e, conditional full-e2e)
- .github/workflows/auto-add-run-e2e.yml (only add label when reviewer/commenter is in MAINTAINERS list)
- .github/pull_request_template.md (clarify how to request E2E)
- CONTRIBUTING.md (new file describing local run, maintainers, label process)
- .opencode/plans/harden-verify-workflow_9f8e7d6c.plan.md (this plan)

> Note: This change touches >3 files so the plan is created before any edits.

## Risks

- If the MAINTAINERS list is out-of-date, authorized users may be unable to trigger E2E or unauthorized users might be allowed if list is misconfigured.
- Playwright tests can be flaky — flaky tests may block merges if not flaky-resistant.
- Mis-specified workflow conditions might accidentally expose secrets; must scope secret injection to the job that runs only under safe conditions.
- Hard-coding maintainers in YAML requires upkeep when team membership changes.

## Planned Changes (detailed)

1. MAINTAINERS config (Option A)
   - Add a small, explicit MAINTAINERS list to the auto-label workflow and to CONTRIBUTING.md (format: comma-separated usernames).
   - Example (in workflow env): MAINTAINERS: "rhixecompany,adminbot"

2. CI workflow layout (.github/workflows/verify-agents.yml)
   - Jobs:
     - job: verify-fast (runs on all PRs — forks or in-repo)
       - Steps: checkout, npm ci, type-check, lint, test:browser
     - job: smoke-e2e (runs on all PRs)
       - Purpose: quick Playwright subset to catch obvious regressions
     - job: full-e2e (conditionally run)
       - Condition: run IF (PR is in-repo) OR (PR has label `run-e2e`)
       - Important: Provide secrets only in this job's env — do not provide them to other jobs.
       - Provide services (Postgres, Redis) to only this job.

3. Smoke vs Full E2E
   - Define a smoke test tag/marker in Playwright tests (e.g., `@smoke`) and run with `npx playwright test --grep @smoke` in the smoke job.

4. Auto-label workflow (.github/workflows/auto-add-run-e2e.yml)
   - Triggers: pull_request_review (approved) and issue_comment containing `/run-e2e`.
   - Behavior: Only add `run-e2e` when actor is in MAINTAINERS list.

5. Documentation
   - scripts/README.md: add local run instructions, SKIP_E2E usage, and Docker Compose snippet for local Postgres/Redis to run full E2E.
   - .github/pull_request_template.md: brief note on `/run-e2e` or asking a maintainer to approve.
   - CONTRIBUTING.md: step-by-step guide for maintainers to manage MAINTAINERS list and for contributors how to request E2E.

6. Safety: Secrets and job scoping
   - Use `env:` on the full-e2e job to inject secrets via GitHub Actions secrets only when the job runs.
   - Avoid `pull_request_target` for jobs that need secrets.

## Validation Steps

1. Local developer verification
   - Start local services with docker-compose (example provided in scripts/README.md)
   - Run fast checks: `SKIP_E2E=true ./scripts/verify-agents.sh`
   - Run full checks with services + env vars set locally.
2. CI validation
   - PR A (in-repo): expect verify-fast + smoke-e2e + full-e2e (full-e2e gets secrets).
   - PR B (fork without label): expect verify-fast + smoke-e2e; full-e2e must NOT run.
   - PR C (fork requesting E2E): maintainer approves or comments `/run-e2e`; auto-label workflow adds label and full-e2e runs with secrets.

## Rollback / Mitigation

- Revert workflow YAML changes if CI breaks.
- Remove/disable auto-label workflow if label misuse occurs.
- If secrets leak is suspected: rotate the affected GitHub secrets and revert workflow to not expose secrets to forks.

## Next Steps

1. Implement the changes described in a single change-set.
2. Run local verification of scripts (SKIP_E2E and full-run with local services).
3. Open a branch and push changes for review (do not push without explicit go-ahead).

---
