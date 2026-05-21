@echo off
@if "%*"=="" (
  bunx tsx scripts/ts/entrypoints/opencode-mcp-cli.ts --list --catalog-path .opencode/mcp_servers.json
) else (
  bunx tsx scripts/ts/entrypoints/opencode-mcp-cli.ts %*
  exit /b %ERRORLEVEL%
)
