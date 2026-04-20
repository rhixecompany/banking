@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

echo === Production Deployment (wrapper) ===
if "%*"=="" (
  npx tsx scripts/ts/entrypoints/deploy-cli.ts
) else (
  npx tsx scripts/ts/entrypoints/deploy-cli.ts %*
)

endlocal
