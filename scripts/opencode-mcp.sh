#!/usr/bin/env sh
set -e
# Forward args to mcp runner; default to --list when no args provided
if [ "$#" -eq 0 ]; then
  npx tsx scripts/mcp-runner.ts --list --catalog-path .opencode/mcp_servers.json
else
  npx tsx scripts/mcp-runner.ts "$@"
fi
