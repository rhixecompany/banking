@echo off
REM opencode-plugin-verify - Batch Orchestrator
REM Calls TypeScript implementation for plugin verification
REM Enhanced to:
REM - Use bunx opencode debug config for runtime config
REM - Load project configs from multiple paths
REM - Detect missing plugins, extra plugins, missing configurations, duplicates

setlocal enabledelayedexpansion

REM Get script directory and repo root
set SCRIPT_DIR=%~dp0
set REPO_ROOT=%SCRIPT_DIR%..

REM Change to repo root
cd /d "%REPO_ROOT%"

REM Execute TypeScript implementation with all arguments passed through
bunx tsx scripts/ts/opencode-plugin-verify.ts %*

REM Preserve exit code
exit /b %errorlevel%
