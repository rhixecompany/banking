# scripts/

This folder contains repository helper scripts used by reviewers and CI to run quick verification steps.

Files

- verify-agents.sh — Reviewer checklist script that runs TypeScript type-check, ESLint strict lint, the Vitest unit test suite, and the Playwright E2E suite, in that order. It exits on the first failure and prints progress to stdout.

Purpose

- Provide a single, easy-to-run script that enforces top-level repository checks before creating a PR or merging code.

How to run (Unix / macOS / WSL / Git Bash)

1. Make the script executable (only needed once):

   chmod +x scripts/verify-agents.sh

2. Run the script:

   ./scripts/verify-agents.sh

Notes for Windows users

- The script is a POSIX shell script and runs in Git Bash, WSL, or other bash-compatible environments. If you prefer PowerShell, run the equivalent commands manually:

  # Type-check

  npm run type-check

  # Lint (strict)

  npm run lint:strict

  # Unit tests (Vitest)

  npm run test:browser -- --run

  # E2E tests (Playwright)

  npm run test:ui -- --run

CI usage

- Call `./scripts/verify-agents.sh` in your CI job to enforce the same checks. Ensure the CI environment has the required services and environment variables (e.g., DATABASE_URL, ENCRYPTION_KEY, NEXTAUTH_SECRET) available when running Playwright E2E.

Local Postgres/Redis (docker-compose example)

If you don't want to install Postgres and Redis locally, you can use the repository's docker-compose.yml to start services for local E2E runs:

docker-compose up -d postgres redis

Then set the env vars described in CONTRIBUTING.md before running the full script.

Customizing the script

- The current script always runs all steps. You can edit the script to add guards or env variables such as:
  - SKIP_E2E=true to skip Playwright E2E
  - SMOKE_TEST_PATTERN="pattern" to run a subset of Vitest tests (using `-t`) if your tests are named consistently
  - RUN_E2E=true to gate E2E runs behind an explicit flag

Troubleshooting & tips

- Playwright E2E may start the dev server and requires port 3000 to be free. On Windows you can free the port with:

  $p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select -ExpandProperty OwningProcess -Unique; if ($p) { Stop-Process -Id $p -Force }

- If DB seeding or other preconditions are required for E2E, ensure you run the project's seed or prep steps (e.g., set PLAYWRIGHT_PREPARE_DB=true in CI or run npm run db:seed) before calling the script.

Contributing

- If you add new scripts under `scripts/`, please update this README with the filename, purpose, and usage examples.
