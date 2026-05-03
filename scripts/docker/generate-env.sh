#!/usr/bin/env bash
# Provenance: batch2 convert-scripts
# Thin wrapper: forward to TypeScript entrypoint
set -e

if [ "$#" -eq 0 ]; then
  bunx tsx scripts/ts/docker/generate-env.ts --list
  exit $?
else
  bunx tsx scripts/ts/docker/generate-env.ts "$@"
  exit $?
fi
