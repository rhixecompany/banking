# opencode-plugin-repair - PowerShell Orchestrator
# Pure orchestrator: delegates all logic to TypeScript implementation
# See scripts/ts/opencode-plugin-repair.ts for the actual repair logic

#Requires -Version 5.0
[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

$ErrorActionPreference = 'Stop'

# Get script and repo directories
$SCRIPT_DIR = Split-Path -Parent $PSCommandPath
$REPO_ROOT = Split-Path -Parent $SCRIPT_DIR

# Change to repo root and pass all arguments through
Push-Location $REPO_ROOT
try {
    & bunx tsx scripts/ts/opencode-plugin-repair.ts @Arguments
} finally {
    Pop-Location
}
