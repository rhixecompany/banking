<#: 
SYNOPSIS
  PowerShell shim for running CI checks on Windows.

USAGE
  .\run-ci-checks.ps1 [-Only <string>] [-Skip <string>] [-ReportDir <string>] [-ContinueOnFail] [-Help]

This mirrors scripts/utils/run-ci-checks.sh behavior: runs npm scripts for a canonical set
of steps, writes per-step reports to a timestamped directory by default, supports --only and
--skip filters, and supports --continue-on-fail to exit 0 even if steps failed.
#>

[CmdletBinding()]
param(
    [string]$Only,
    [string]$Skip,
    [string]$ReportDir,
    [switch]$ContinueOnFail,
    [switch]$Help
)

function Show-Usage {
    @"
Usage: .\run-ci-checks.ps1 [-Only "step1,step2"] [-Skip "step1"] [-ReportDir <path>] [-ContinueOnFail]

Options:
  -Only             Run only the listed steps (comma-separated)
  -Skip             Skip the listed steps (comma-separated)
  -ReportDir        Directory to write per-step reports (default: ./ci-reports/<timestamp>)
    -ContinueOnFail   Exit 0 even if some steps fail
    -Help             Show this help message

Examples:
  .\run-ci-checks.ps1
  .\run-ci-checks.ps1 -Only "format-check,type-check"
  .\run-ci-checks.ps1 -Skip "test-ui,build" -ReportDir .\tmp\reports
"@
}

if ($Help) {
    Show-Usage
    exit 0
}

# Canonical steps
$STEPS = @(
    'format-check',
    'type-check',
    'lint-fix',
    'lint-strict',
    'build-debug',
    'test-browser',
    'test-ui',
    'build'
)

# Command mapping
$COMMANDS = @{
    'format-check' = 'npm run format:check'
    'type-check'   = 'npm run type-check'
    'lint-fix'     = 'npm run lint:fix'
    'lint-strict'  = 'npm run lint:strict'
    'build-debug'  = 'npm run build:debug'
    'test-browser' = 'npm run test:browser'
    'test-ui'      = 'npm run test:ui'
    'build'        = 'npm run build'
}

# Report filenames
$REPORTS = @{
    'format-check' = 'format-check-report.txt'
    'type-check'   = 'type-check-report.txt'
    'lint-fix'     = 'lint-fix-report.txt'
    'lint-strict'  = 'lint-strict-report.txt'
    'build-debug'  = 'build-debug-report.txt'
    'test-browser' = 'test-browser-report.txt'
    'test-ui'      = 'test-ui-report.txt'
    'build'        = 'build-report.txt'
}

function Split-CSV($s) {
    if ([string]::IsNullOrWhiteSpace($s)) { return @() }
    return ($s -split ',') | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
}

if ($Only -and $Skip) {
    Write-Error "Cannot use -Only and -Skip together"
    exit 1
}

$onlySteps = Split-CSV $Only
$skipSteps = Split-CSV $Skip

function Validate-Steps($names) {
    foreach ($n in $names) {
        if (-not ($STEPS -contains $n)) {
            Write-Error "Unknown step: $n"
            Write-Host "Valid steps: $($STEPS -join ',')"
            exit 1
        }
    }
}

if ($onlySteps.Count -gt 0) { Validate-Steps $onlySteps }
if ($skipSteps.Count -gt 0) { Validate-Steps $skipSteps }

# Apply filters while preserving canonical order
if ($onlySteps.Count -gt 0) {
    $STEPS = $STEPS | Where-Object { $onlySteps -contains $_ }
} elseif ($skipSteps.Count -gt 0) {
    $STEPS = $STEPS | Where-Object { -not ($skipSteps -contains $_) }
}

if ($STEPS.Count -eq 0) {
    Write-Error "No steps to run after applying filters. Exiting."
    exit 1
}

if (-not $ReportDir) {
    $ts = Get-Date -Format "yyyyMMdd-HHmmss"
    $ReportDir = Join-Path -Path '.' -ChildPath (Join-Path -Path 'ci-reports' -ChildPath $ts)
}

New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null

$Results = @{}

function Run-Step($step) {
    $cmd = $COMMANDS[$step]
    $reportFile = Join-Path $ReportDir $REPORTS[$step]
    Write-Host "==> Running: $cmd"
    # Prefer bash if available (for parity with the Bash script); otherwise fall back to npm or cmd
    $bashCmd = Get-Command bash -ErrorAction SilentlyContinue
    if ($bashCmd) {
        & bash -lc "$cmd" 2>&1 | Tee-Object -FilePath $reportFile
        $exit = $LASTEXITCODE
    } else {
        if ($cmd -match '^npm run\s+(.+)$') {
            $scriptName = $Matches[1]
            & npm run $scriptName 2>&1 | Tee-Object -FilePath $reportFile
            $exit = $LASTEXITCODE
        } else {
            cmd.exe /c $cmd 2>&1 | Tee-Object -FilePath $reportFile
            $exit = $LASTEXITCODE
        }
    }
    if ($exit -eq 0) {
        $Results[$step] = 'PASS'
    } else {
        $Results[$step] = 'FAIL'
    }
}

foreach ($step in $STEPS) {
    Run-Step $step
}

Write-Host "Reports saved to: $ReportDir"

Write-Host "`n==================== Summary ===================="
$failed = @()
foreach ($step in $STEPS) {
    $status = $Results[$step]
    $reportPath = Join-Path $ReportDir $REPORTS[$step]
    Write-Host ([string]::Format("{0,-14} {1,-6} ({2})", $step, $status, $reportPath))
    if ($status -eq 'FAIL') { $failed += $step }
}
Write-Host "================================================"

if ($failed.Count -gt 0) {
    Write-Host "Failed steps: $($failed -join ', ')"
    if ($ContinueOnFail) {
        Write-Host "Exiting 0 due to -ContinueOnFail"
        exit 0
    }
    exit 1
}

Write-Host "All steps passed."
exit 0
