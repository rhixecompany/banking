@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

echo === Production Deployment (wrapper) ===
if "%*"=="" (
bunx tsx scripts/ts/entrypoints/deploy-cli.ts
) else (
  bunx tsx scripts/ts/entrypoints/deploy-cli.ts %*
)

endlocal
