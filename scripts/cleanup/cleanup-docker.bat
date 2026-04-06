@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

echo === Docker Cleanup ===
echo This script requires PowerShell.
echo.
echo Starting PowerShell version...
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%cleanup-docker.ps1" %*

endlocal
