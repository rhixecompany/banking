# opencode-plugin-verify - PowerShell Orchestrator
# Calls TypeScript implementation for plugin verification
# Enhanced to:
# - Use bunx opencode debug config for runtime config
# - Load project configs from multiple paths
# - Detect missing plugins, extra plugins, missing configurations, duplicates

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

# Change to repo root
Push-Location $REPO_ROOT
try {
    # Execute TypeScript implementation with all arguments passed through
    & bunx tsx scripts/ts/opencode-plugin-verify.ts @Arguments
} finally {
    Pop-Location
}
