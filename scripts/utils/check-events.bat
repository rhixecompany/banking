@echo off
cd /d %~dp0..
bunx tsx scripts/ts/utils/check-events.ts
pause