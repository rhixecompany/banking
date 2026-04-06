@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

echo === Server Setup ===
echo This script requires PowerShell.
echo.
echo Starting PowerShell version...
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%server-setup.ps1"

endlocal
