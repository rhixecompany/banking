@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

echo === Generate TLS Certificates ===
echo This script requires PowerShell.
echo.
echo Starting PowerShell version...
powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_DIR%gen-certs.ps1"

endlocal
