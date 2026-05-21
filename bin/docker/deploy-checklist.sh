#!/usr/bin/env bash
# Provenance: batch2 convert-scripts
# Thin wrapper: forward to TypeScript entrypoint
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ "$#" -eq 0 ]; then
  bunx tsx scripts/ts/docker/deploy-checklist.ts --list
  exit $?
else
  bunx tsx scripts/ts/docker/deploy-checklist.ts "$@"
  exit $?
fi
