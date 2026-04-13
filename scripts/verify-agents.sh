#!/usr/bin/env bash
# scripts/verify-agents.sh
# Reviewer checklist: type-check -> lint:strict -> unit tests (Vitest) -> E2E (Playwright)
#
# Usage:
#   ./scripts/verify-agents.sh
#
# Notes:
# - This script exits on first failure (set -euo pipefail).
# - Playwright E2E may start the dev server and requires preconditions (DB, env) to be met.
# - Make executable with: chmod +x scripts/verify-agents.sh

set -euo pipefail

echo "=== verify-agents: START $(date) ==="

echo
echo "1) TypeScript type-check"
echo "----------------------------------------"
npm run type-check
echo "-> type-check: OK"

echo
echo "2) ESLint (strict)"
echo "----------------------------------------"
npm run lint:strict
echo "-> lint:strict: OK"

echo
echo "3) Unit tests (Vitest)"
echo "----------------------------------------"
# Run full unit test suite once
npm run test:browser -- --run
echo "-> test:browser: OK"

echo
echo "4) End-to-end tests (Playwright)"
echo "----------------------------------------"
# Allow skipping E2E in CI or local runs by setting SKIP_E2E=true
if [ "${SKIP_E2E:-false}" = "true" ]; then
  echo "-> SKIP_E2E=true, skipping Playwright E2E step"
else
  # Run full Playwright E2E suite (this repo's test:ui starts the dev server as needed)
  # Ensure DB and other preconditions are satisfied before running.
  npm run test:ui -- --run
  echo "-> test:ui: OK"
fi

echo
echo "=== verify-agents: SUCCESS $(date) ==="
