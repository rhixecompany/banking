@echo off
REM vps-setup.bat - Banking App VPS Setup (Windows Wrapper)
REM Usage: .\vps-setup.bat [OPTIONS]
REM For full options, run: powershell -ExecutionPolicy Bypass -File "%~dp0vps-setup.ps1" -Help

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "SCRIPT_NAME=vps-setup.ps1"

echo === Banking App VPS Setup ===
echo.
echo Starting PowerShell version...
echo.

REM Pass all arguments to PowerShell
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%%SCRIPT_NAME%" %*

if errorlevel 1 (
    echo.
    echo Installation failed. Check errors above.
    pause
)

endlocal
