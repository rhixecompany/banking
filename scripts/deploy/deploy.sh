#!/usr/bin/env bash
# Provenance: batch2 convert-scripts
# Thin forwarder to TypeScript deploy entrypoint
set -e

if [ "$#" -eq 0 ]; then
  npx tsx scripts/ts/deploy/deploy.ts
  exit $?
else
  npx tsx scripts/ts/deploy/deploy.ts "$@"
  exit $?
fi
