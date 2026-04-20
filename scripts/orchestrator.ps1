#!/usr/bin/env pwsh
# Provenance: batch5 convert-scripts
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $RemainingArgs
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$tsPath = Join-Path $ScriptDir 'orchestrator.ts' | Resolve-Path -Relative

try {
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($node) {
        & $node.Path $tsPath @RemainingArgs
        exit $LASTEXITCODE
    } else {
        npx tsx $tsPath @RemainingArgs
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "Failed to invoke TypeScript orchestrator script: $_"
    exit 1
}
