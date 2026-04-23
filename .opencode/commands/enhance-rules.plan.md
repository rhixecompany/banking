# Enhance Rules: verification script, CI, and local hooks

## Goals

- Add a standalone verification script to enforce rules that linters don't cover.
- Integrate verification into CI (PRs) and add local husky pre-commit hooks.
- Produce JSON reports and a console summary for triage.

## Scope

- New script: scripts/verify-rules.ts
- Config: .opencode/verify-rules.config.json
- package.json scripts and husky pre-commit
- CI: .github/workflows/ci.yml job addition
- Documentation: AGENTS.md update

## Target Files

- scripts/verify-rules.ts
- .opencode/verify-rules.config.json
- package.json
- .github/workflows/ci.yml
- .husky/pre-commit (added)
- AGENTS.md (doc update)

## Risks

- New checks may reveal many existing violations; initial mode is warn-first to reduce friction.
- Heuristics may produce false positives; allowlist and config exist to suppress known exceptions.

## Planned Changes

- Implement verify-rules.ts with checks for process.env, any, direct DB imports, server action heuristics, and Home static rule.
- Add configuration file with default allowlist and severities.
- Add npm scripts to run verification locally and in CI.
- Add husky pre-commit to run quick staged checks.
- Update CI workflow to run verify:rules on PRs (warn-first behavior).

## Validation

- Run `npm run verify:rules` locally and inspect .opencode/reports/rules-report.json.
- Confirm CI job uploads the JSON artifact and returns warn/ok when only non-critical issues are found.

## Rollback / Mitigation

- If the checks are too noisy, change severities in .opencode/verify-rules.config.json to "warn" or add allowlist globs.
