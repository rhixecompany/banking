#!/usr/bin/env bash
# opencode-plugin-verify - Orchestrator that calls TypeScript implementation
set -euo pipefail

SCRIPT_DIR=$(dirname "$(realpath "$0")")
REPO_ROOT=$(realpath "$SCRIPT_DIR/..")

cd "$REPO_ROOT"
bunx tsx scripts/ts/opencode-plugin-verify.ts "$@"