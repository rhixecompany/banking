#Requires -Version 5.1
<#
.SYNOPSIS
    Run CI checks for Banking App
.DESCRIPTION
    Runs all validation and test steps
.PARAMETER Steps
    Specific steps to run (default: all)
.EXAMPLE
    .\run-ci-checks.ps1
    .\run-ci-checks.ps1 -Steps @("type-check", "lint")
#>

param(
    [string[]]$Steps = @(),
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

# Default steps if none specified
if ($Steps.Count -eq 0) {
    $Steps = @("format-check", "type-check", "lint", "build", "test-browser")
}

$commands = @{
    "format-check" = "npm run format:check"
    "type-check" = "npm run type-check"
    "lint" = "npm run lint"
    "lint-strict" = "npm run lint:strict"
    "build" = "npm run build"
    "build-debug" = "npm run build:debug"
    "test-browser" = "npm run test:browser"
    "test-ui" = "npm run test:ui"
}

$results = @{}

Write-Host "=== CI Checks ===" -ForegroundColor Green
Write-Host ""

Push-Location $ProjectRoot

foreach ($step in $Steps) {
    if (-not $commands.ContainsKey($step)) {
        Write-Host "Unknown step: $step" -ForegroundColor Yellow
        continue
    }
    
    $command = $commands[$step]
    Write-Host "==> Running: $command"
    
    $startTime = Get-Date
    $reportFile = Join-Path $ProjectRoot "${step}-report.txt"
    
    try {
        Invoke-Expression $command 2>&1 | Tee-Object -FilePath $reportFile | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ PASS" -ForegroundColor Green
            $results[$step] = "PASS"
        } else {
            Write-Host "  ✗ FAIL" -ForegroundColor Red
            $results[$step] = "FAIL"
        }
    } catch {
        Write-Host "  ✗ FAIL: $_" -ForegroundColor Red
        $results[$step] = "FAIL"
    }
    
    $duration = (Get-Date) - $startTime
    Write-Host "  Duration: $($duration.TotalSeconds)s"
    Write-Host ""
}

Pop-Location

# Summary
Write-Host "==================== Summary ====================" -ForegroundColor Cyan
foreach ($step in $results.Keys) {
    $status = $results[$step]
    $color = if ($status -eq "PASS") { "Green" } else { "Red" }
    $statusSymbol = if ($status -eq "PASS") { "✓" } else { "✗" }
    Write-Host "  $statusSymbol $step : $status" -ForegroundColor $color
}
Write-Host "================================================"

# Exit with error if any failed
if ($results.Values -contains "FAIL") {
    Write-Host ""
    Write-Host "Some checks failed. Review reports above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All checks passed!" -ForegroundColor Green
