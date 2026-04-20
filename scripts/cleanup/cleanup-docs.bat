@echo off
REM Provenance: batch3 convert-scripts

SET SCRIPT_DIR=%~dp0

FOR /F "delims=" %%N IN ('where node 2^>nul') DO SET NODE=%%N
IF DEFINED NODE (
  "%NODE%" "%SCRIPT_DIR%..\ts\cleanup\cleanup-docs.ts" %*
  EXIT /B %ERRORLEVEL%
)

npx tsx "%SCRIPT_DIR%..\ts\cleanup\cleanup-docs.ts" %*
EXIT /B %ERRORLEVEL%
