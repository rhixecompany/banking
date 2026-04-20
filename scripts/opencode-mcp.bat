@echo off
@if "%*"=="" (
  npx tsx scripts/ts/entrypoints/opencode-mcp-cli.ts --list --catalog-path .opencode/mcp_servers.json
) else (
  npx tsx scripts/ts/entrypoints/opencode-mcp-cli.ts %*
  exit /b %ERRORLEVEL%
)
