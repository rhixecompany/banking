#!/usr/bin/env bash
# Provenance: batch2 convert-scripts
# Thin wrapper: forward to TypeScript entrypoint
set -e

if [ "$#" -eq 0 ]; then
  bunx tsx scripts/ts/docker/docker-quickstart.ts --list
  exit $?
else
  bunx tsx scripts/ts/docker/docker-quickstart.ts "$@"
  exit $?
fi
