REM Provenance: batch2 convert-scripts
@echo off
bunx tsx scripts/ts/utils/disable-extensions.ts %*
exit /b %ERRORLEVEL%
