#!/usr/bin/env sh
set -e
# Forward args to mcp runner; default to --list when no args provided
if [ "$#" -eq 0 ]; then
  npx tsx scripts/ts/entrypoints/opencode-mcp-cli.ts --list --catalog-path .opencode/mcp_servers.json
  exit $?
else
  npx tsx scripts/ts/entrypoints/opencode-mcp-cli.ts "$@"
  exit $?
fi
