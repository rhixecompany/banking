#!/usr/bin/env bash
# Orchestrator: Calls the TypeScript implementation
set -euo pipefail

cd "$(dirname "$0")/.."
bunx tsx scripts/ts/opencode-plugin-repair.ts "$@"
