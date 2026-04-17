@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

echo === Run CI Checks ===
echo This script requires PowerShell.
echo.
echo Starting PowerShell version...
REM Forward default parallel=3 if not provided
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%run-ci-checks.ps1" -Parallel 3 %*

endlocal
