#!/usr/bin/env bash
# Provenance: batch2 convert-scripts
# Thin wrapper: forward to TypeScript entrypoint
set -e

if [ "$#" -eq 0 ]; then
  npx tsx scripts/ts/docker/docker-quickstart.ts --list
  exit $?
else
  npx tsx scripts/ts/docker/docker-quickstart.ts "$@"
  exit $?
fi
