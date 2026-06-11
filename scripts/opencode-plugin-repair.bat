@echo off
REM opencode-plugin-repair - Batch Orchestrator
REM Pure orchestrator: delegates all logic to TypeScript implementation
REM See scripts/ts/opencode-plugin-repair.ts for the actual repair logic

setlocal enabledelayedexpansion

REM Get script directory and repo root
set SCRIPT_DIR=%~dp0
set REPO_ROOT=%SCRIPT_DIR%..

REM Change to repo root and pass all arguments through
cd /d "%REPO_ROOT%"
bunx tsx scripts/ts/opencode-plugin-repair.ts %*

REM Preserve exit code
exit /b %errorlevel%
