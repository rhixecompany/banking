#!/usr/bin/env bash
# Provenance: batch2 convert-scripts
# Thin forwarder to TypeScript deploy entrypoint
set -e

if [ "$#" -eq 0 ]; then
  bunx tsx scripts/ts/deploy/deploy.ts
  exit $?
else
  bunx tsx scripts/ts/deploy/deploy.ts "$@"
  exit $?
fi
