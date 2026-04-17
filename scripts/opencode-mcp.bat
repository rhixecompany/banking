@echo off
if "%*"=="" (
  npx tsx scripts/mcp-runner.ts --list --catalog-path .opencode/mcp_servers.json
) else (
  npx tsx scripts/mcp-runner.ts %*
)
