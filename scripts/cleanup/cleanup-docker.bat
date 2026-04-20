@echo off
REM Provenance: batch3 convert-scripts
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

set "TS_PATH=%SCRIPT_DIR%..\ts\cleanup\cleanup-docker-windows.ts"

where node >nul 2>&1
if %ERRORLEVEL%==0 (
    for /f "delims=\" %%N in ('where node') do set "NODE=%%N" & goto :haveNode
)

:noNode
npx tsx "%TS_PATH%" %*
exit /b %ERRORLEVEL%

:haveNode
"%NODE%" "%TS_PATH%" %*
exit /b %ERRORLEVEL%

endlocal
