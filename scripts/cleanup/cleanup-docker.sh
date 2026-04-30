#!/bin/bash
# cleanup-docker.sh - Aggressive Docker Cleanup
# Orchestrator that calls TypeScript implementation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "$PROJECT_ROOT"
npx tsx scripts/ts/cleanup/cleanup-docker.ts "$@"