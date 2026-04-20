REM Provenance: batch2 convert-scripts
@echo off
npx tsx scripts/ts/utils/disable-extensions.ts %*
exit /b %ERRORLEVEL%
