@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%..\.."

echo === Banking Application Docker Quick Start ===
echo This script requires PowerShell.
echo.
echo Starting PowerShell version...
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%docker-quickstart.ps1"

endlocal
