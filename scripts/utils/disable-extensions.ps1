$PSCommandPath = $MyInvocation.MyCommand.Path
# Provenance: batch2 convert-scripts
# Forwarder to TypeScript implementation using tsx
$script = 'scripts/ts/utils/disable-extensions.ts'
$allArgs = $args -join ' '
$cmd = "npx tsx $script -- $allArgs"
# Write-Host "Executing: $cmd"
Invoke-Expression $cmd
exit $LASTEXITCODE
