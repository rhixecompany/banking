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
    [string]$File,
    [switch]$ContinueOnFail,
    [switch]$DryRun,
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
 $ExitCodes = @{}
 $Fallbacks = @{}

function Run-Step($step) {
    $cmd = $COMMANDS[$step]
    $reportFile = Join-Path $ReportDir $REPORTS[$step]
    Write-Host "==> Running: $cmd"

    # Targeted commands for file-level runs
    $TARGETED = @{
        'format-check' = 'prettier --config .prettierrc.ts --check {path}'
        'format' = 'prettier --config .prettierrc.ts --write {path}'
        'format:markdown' = 'npx markdownlint-cli2 -c .markdownlintrc.json {path}'
        'lint-fix' = 'eslint --config eslint.config.mts --fix {path}'
        'lint-strict' = 'eslint --config eslint.config.mts --max-warnings=0 {path}'
        'test-browser' = 'vitest --config=vitest.config.ts run {path}'
        'test-ui' = 'cross-env PLAYWRIGHT_PREPARE_DB=true playwright test {path} --project=chromium'
        'type-check' = 'tsc --noEmit --pretty {path}'
    }

    # If File parameter provided and targeted mapping exists, substitute
    if ($File -and $TARGETED.ContainsKey($step)) {
        $paths = $File -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        $joined = $paths -join ' '
        $cmd = $TARGETED[$step].Replace('{path}',$joined)

        # detect tool availability
        $tool = switch ($step) {
            'format-check' {'prettier'}
            'format' {'prettier'}
            'format:markdown' {'markdownlint-cli2'}
            'lint-fix' {'eslint'}
            'lint-strict' {'eslint'}
            'test-browser' {'vitest'}
            'test-ui' {'playwright'}
            'type-check' {'tsc'}
            default { $null }
        }
    if ($tool) {
        $found = Get-Command $tool -ErrorAction SilentlyContinue
        if (-not $found) {
                "Tool $tool not found on PATH; falling back to 'npm run $step'" | Out-File -FilePath $reportFile -Encoding utf8
                $cmd = $COMMANDS[$step]
                $Fallbacks[$step] = $true
        }
    }
    }

    # Prefer bash if available (for parity with the Bash script); otherwise fall back to npm or cmd
    $bashCmd = Get-Command bash -ErrorAction SilentlyContinue
    if ($DryRun) {
        "[DRY-RUN] $cmd" | Out-File -FilePath $reportFile -Encoding utf8
        $exit = 0
    } elseif ($bashCmd) {
        & bash -lc "$cmd" 2>&1 | Tee-Object -FilePath $reportFile
        $exit = $LASTEXITCODE
    } else {
        # If command is "npm run <script>" or starts with "npx" or "npm", prefer invoking node tooling directly
        if ($cmd -match '^npm run\s+(.+)$') {
            $scriptName = $Matches[1]
            # Use npm command directly and pass through script name
            & npm run $scriptName 2>&1 | Tee-Object -FilePath $reportFile
            $exit = $LASTEXITCODE
        } elseif ($cmd -match '^npx\s+(.+)$') {
            $tool = $Matches[1]
            & npx $tool 2>&1 | Tee-Object -FilePath $reportFile
            $exit = $LASTEXITCODE
        } elseif ($cmd -match '^npm\s+(.+)$') {
            $args = $Matches[1]
            & npm $args 2>&1 | Tee-Object -FilePath $reportFile
            $exit = $LASTEXITCODE
        } else {
            # Last resort: run via cmd.exe
            cmd.exe /c $cmd 2>&1 | Tee-Object -FilePath $reportFile
            $exit = $LASTEXITCODE
        }
    }
    if ($exit -eq 0) {
        $Results[$step] = 'PASS'
    } else {
        $Results[$step] = 'FAIL'
    }
    $ExitCodes[$step] = $exit
    if (-not $Fallbacks.ContainsKey($step)) { $Fallbacks[$step] = $false }

    # write incremental summary
    Write-Summary

    # If this was test-ui and File provided, attempt seed prep
    if ($step -eq 'test-ui' -and $File) {
        if (Test-Path 'scripts/utils/ci-helpers/seed-prep.ts' -PathType Leaf -ErrorAction SilentlyContinue) {
            "`n==> Running seed prep for targeted Playwright run" | Out-File -FilePath $reportFile -Append -Encoding utf8
            # attempt to run npm helper
            & npm run ci:helpers:seed-prep 2>&1 | Tee-Object -FilePath $reportFile -Append
        } else {
            "Seed prep helper not found; skipping DB prep" | Out-File -FilePath $reportFile -Append -Encoding utf8
        }
    }
}

foreach ($step in $STEPS) {
    Run-Step $step
}

# Write machine-readable summary incrementally
function Write-Summary {
    $summary = [ordered]@{
        timestamp = (Get-Date -Format "yyyyMMdd-HHmmss")
        report_dir = (Resolve-Path -Path $ReportDir).Path
        steps = @()
    }

    foreach ($s in $STEPS) {
        $entry = [ordered]@{
            name = $s
            status = $Results[$s]
            report = (Join-Path $ReportDir $REPORTS[$s])
            exit_code = ($ExitCodes[$s] -as [int])
            fallback = ($Fallbacks[$s] -eq $true)
        }
        $summary.steps += $entry
    }

    $summary_json = $summary | ConvertTo-Json -Depth 4
    $summary_file = Join-Path $ReportDir 'ci-summary.json'
    $summary_json | Out-File -FilePath $summary_file -Encoding utf8
}

Write-Summary

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

# Write machine-readable summary
$summary = [ordered]@{
    timestamp = (Get-Date -Format "yyyyMMdd-HHmmss")
    report_dir = (Resolve-Path -Path $ReportDir).Path
    steps = @()
}

foreach ($step in $STEPS) {
    $s = [ordered]@{
        name = $step
        status = $Results[$step]
        report = (Join-Path $ReportDir $REPORTS[$step])
        exit_code = ($ExitCodes[$step] -as [int])
        fallback = ($Fallbacks[$step] -eq $true)
    }
    $summary.steps += $s
}

$summary_json = $summary | ConvertTo-Json -Depth 4
$summary_file = Join-Path $ReportDir 'ci-summary.json'
$summary_json | Out-File -FilePath $summary_file -Encoding utf8
Write-Host "Wrote CI summary: $summary_file"
