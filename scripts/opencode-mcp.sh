#!/usr/bin/env sh
set -e
npx tsx scripts/mcp-runner.ts --list --catalog-path .opencode/mcp_servers.json
