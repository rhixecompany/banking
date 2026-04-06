@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

echo === Load Secrets ===
echo This script requires PowerShell.
echo.
echo Starting PowerShell version...
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%read-secrets.ps1"

endlocal
