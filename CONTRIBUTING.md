# Contributing to Banking

This document explains how to run the repository verification checks locally, how maintainers can grant E2E runs for forked PRs, and how to request full E2E runs.

## Local verification

- Make sure you have Node.js and Docker installed if you want to run full E2E locally.
- Make the script executable (Unix/macOS/WSL/Git Bash):

  chmod +x scripts/verify-agents.sh

- Run the fast checks (type-check, lint, unit):

  SKIP_E2E=true ./scripts/verify-agents.sh

- Run full verification (requires Postgres and Redis running and env vars set):

  # Start local services (example using docker-compose included in repo)

  docker-compose up -d postgres redis

  # Set required env vars (example)

  export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/banking_test export REDIS_URL=redis://localhost:6379 export ENCRYPTION_KEY=REPLACE_WITH_YOURS export NEXTAUTH_SECRET=REPLACE_WITH_YOURS export NEXT_PUBLIC_SITE_URL=http://localhost:3000

  ./scripts/verify-agents.sh

## Requesting full E2E for forked PRs

- By default, full E2E runs only for PRs originating from this repository (main or develop branches).
- If your PR is from a fork and you need full E2E, ask a maintainer to approve the PR or comment `/run-e2e`. Only authorized maintainers can trigger full E2E.

## Maintainers

The following GitHub usernames are authorized to grant `run-e2e` on forked PRs (Option A trust model):

- rhixecompany
- adminbot

If you need to update the maintainers list, modify `.github/workflows/auto-add-run-e2e.yml` and this file.

## Notes

- Never add real secrets to the repository. CI references secrets via GitHub Actions secrets and injects them only into the full E2E job when it runs.
- Keep the smoke E2E suite small and fast — it's intended for quick feedback on every PR.
