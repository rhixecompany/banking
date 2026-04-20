#!/usr/bin/env bash
# Provenance: batch3 convert-scripts
# Thin wrapper: forward to TypeScript cleanup-docs
set -e

if [ "$#" -eq 0 ]; then
  npx tsx scripts/ts/cleanup/cleanup-docs.ts --dry-run
  exit $?
else
  npx tsx scripts/ts/cleanup/cleanup-docs.ts "$@"
  exit $?
fi
