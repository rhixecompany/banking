#!/usr/bin/env sh
set -e
# Provenance: batch5 convert-scripts
# Thin wrapper: forward to TypeScript plan-ensure entrypoint
if [ "$#" -eq 0 ]; then
  npx tsx scripts/plan-ensure.ts --help
  exit $?
else
  npx tsx scripts/plan-ensure.ts "$@"
  exit $?
fi
