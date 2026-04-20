#!/usr/bin/env bash
# Provenance: batch2 convert-scripts
# Portable wrapper: forward all args to tsx script and preserve exit code
npx tsx "scripts/ts/utils/disable-extensions.ts" -- "$@"
exit_code=$?
exit $exit_code
