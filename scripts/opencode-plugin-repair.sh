#!/usr/bin/env bash
# Orchestrator: Calls the TypeScript implementation
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)

cd "$REPO_ROOT"
bunx tsx scripts/ts/opencode-plugin-repair.ts "$@"
