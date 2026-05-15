#!/usr/bin/env sh
set -e
# Provenance: batch5 convert-scripts
# Thin wrapper: forward to TypeScript orchestrator entrypoint
if [ "$#" -eq 0 ]; then
  bunx tsx scripts/orchestrator.ts --help
  exit $?
else
  bunx tsx scripts/orchestrator.ts "$@"
  exit $?
fi
