# Automated Branch Sync: Plan

Goal

- Implement an automated branch sync and verification workflow that:
  - stages & commits planned helper files locally,
  - provides a local script to compare origin/main against all origin/\* branches,
  - adds a GitHub Action that runs on pushes to main to verify that main contains files from all remote branches,
  - includes provenance information in commits and PRs.

Scope

- Remote: origin
- Target branch: main
- Sync strategy: merge origin/main into the current branch
- Conflict policy: prefer current branch on simple text conflicts ("ours"), stop for complex/binary conflicts
- Do not push or create PRs automatically in this change; only create files and a local commit.

Files to add

- .opencode/commands/automated-branch-sync.plan.md (this file)
- scripts/branch-compare.sh (bash script to compare origin/main vs origin/\*)
- .github/workflows/verify-main-branches.yml (GH Action to run the script on push to main)

Verification

- The bash script will fetch origin, list files in origin/main, and for each origin/\* branch check for files present in the branch but missing from main. If any branch contains files not in main, the script exits with non-zero status and prints a report.
- The GitHub Action runs the script on pushes to main and will fail the workflow if the script exits non-zero.

Commit / Provenance

- Commit short message: "chore(ci): sync branch with main"
- Commit body MUST include a provenance line listing files read to prepare this change. Example: Provenance: read package.json, AGENTS.md, scripts/utils/run-ci-checks.sh, tests/setup.ts

Implementation Notes

- Scripts are written for bash. On Windows use WSL or Git Bash.
- The local script is intentionally conservative and performs only read operations on the repo; it does not modify branches or refs.
- The GH Action checks out the repository with fetch-depth: 0 so it can examine all refs.

Next steps after this commit (manual)

1. Ensure working tree is clean or that you want these files committed.
2. Run the local script to verify state: `bash scripts/branch-compare.sh`.
3. When ready, merge origin/main into your feature branch per the repository strategy and push the branch.
4. Create a PR to main and include the provenance line in the PR body.

Provenance: read package.json, AGENTS.md, scripts/utils/run-ci-checks.sh, tests/setup.ts
