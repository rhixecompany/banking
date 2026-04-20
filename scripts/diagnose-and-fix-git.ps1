#!/usr/bin/env pwsh
<#
PowerShell helper to diagnose common git issues and attempt to fix index.lock
#>
Write-Host "=== Git Diagnose & Fix ===" -ForegroundColor Cyan

function Check-GitAvailable {
    try {
        git --version > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

if (-not (Check-GitAvailable)) {
    Write-Host "git not found in PATH. Please install git and retry." -ForegroundColor Yellow
    exit 0
}

Write-Host "git is available:" -ForegroundColor Green
git --version

Write-Host "\n--- git status (porcelain) ---" -ForegroundColor Cyan
git status --porcelain

$lockPath = Join-Path -Path (Get-Location) -ChildPath ".git/index.lock"
if (Test-Path $lockPath) {
    Write-Host "\nFound .git/index.lock at: $lockPath" -ForegroundColor Yellow
    $resp = Read-Host "Remove index.lock? (yes/no)"
    if ($resp -in @('yes','y')) {
        # check for git processes
        $gitProcs = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -match 'git' }
        if ($gitProcs) {
            Write-Host "Found running git processes. Please ensure no git commands are running and try again." -ForegroundColor Red
        } else {
            try {
                Remove-Item -LiteralPath $lockPath -Force
                Write-Host "Removed index.lock" -ForegroundColor Green
            } catch {
                Write-Host "Failed to remove index.lock: $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Skipping removal of index.lock" -ForegroundColor Yellow
    }
} else {
    Write-Host "No .git/index.lock present." -ForegroundColor Green
}

Write-Host "\nAttempting: git add -A" -ForegroundColor Cyan
$addOutput = & git add -A 2>&1
$addExit = $LASTEXITCODE
Write-Host "--- git add output ---" -ForegroundColor Cyan
Write-Host $addOutput

if ($addExit -ne 0) {
    Write-Host "git add failed with exit code $addExit" -ForegroundColor Red
    Write-Host "Suggestion: check file permissions, .gitignore, or run 'git status' to inspect changes." -ForegroundColor Yellow
} else {
    Write-Host "git add succeeded." -ForegroundColor Green
}

exit $addExit
