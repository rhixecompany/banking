@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

echo === Fix Line Endings ===
echo This script requires PowerShell.
echo.
echo Starting PowerShell version...
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%fix-line-endings.ps1"

endlocal
