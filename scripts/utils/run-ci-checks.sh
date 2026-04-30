#!/usr/bin/env bash
# run-ci-checks.sh - CI validation orchestrator
# Calls TypeScript implementation with all original arguments
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "$PROJECT_ROOT"
npx tsx scripts/ts/run-ci-checks.ts "$@"