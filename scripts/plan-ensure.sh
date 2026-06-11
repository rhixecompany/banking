#!/usr/bin/env sh
set -e
# Provenance: batch5 convert-scripts
# Thin wrapper: forward to TypeScript plan-ensure entrypoint
if [ "$#" -eq 0 ]; then
  bunx tsx scripts/plan-ensure.ts --help
  exit $?
else
  bunx tsx scripts/plan-ensure.ts "$@"
  exit $?
fi
