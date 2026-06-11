# Check for bugcheck/power-related events in System log
# Orchestrator - calls TypeScript implementation
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent

Set-Location $ProjectRoot
bunx tsx scripts/ts/utils/check-events.ts