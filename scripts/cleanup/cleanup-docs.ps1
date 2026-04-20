#!/usr/bin/env pwsh
# Provenance: batch3 convert-scripts
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $RemainingArgs
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$tsPath = Join-Path $ScriptDir '..\ts\cleanup\cleanup-docs.ts' | Resolve-Path -Relative

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
    Write-Error "Failed to invoke TypeScript cleanup script: $_"
    exit 1
}

Write-Host "=== Documentation Scan Results ===" -ForegroundColor Green
Write-Host ""

Write-Host "Category A - Docker Docs (Keep): $($DockerKeep.Count) files" -ForegroundColor Green
$DockerKeep | ForEach-Object { Write-Host "  [KEEP] $_" -ForegroundColor Green }
Write-Host ""

Write-Host "Category B - Integration Docs (Keep): $($IntegrationKeep.Count) files" -ForegroundColor Green
$IntegrationKeep | ForEach-Object { Write-Host "  [KEEP] $_" -ForegroundColor Green }
Write-Host ""

Write-Host "Category C - Docker Swarm (Delete): $($SwarmDelete.Count) files" -ForegroundColor Red
$SwarmDelete | ForEach-Object { Write-Host "  [DELETE] $_" -ForegroundColor Red }
Write-Host ""

Write-Host "Category D - Legacy Docker Docs (Delete): $($LegacyDelete.Count) files" -ForegroundColor Red
$LegacyDelete | ForEach-Object { Write-Host "  [DELETE] $_" -ForegroundColor Red }
Write-Host ""

Write-Host "Category E - Other Root Docs (Review): $($OtherDelete.Count) files" -ForegroundColor Yellow
$OtherDelete | ForEach-Object { Write-Host "  [REVIEW] $_" -ForegroundColor Yellow }
Write-Host ""

$TotalDelete = $SwarmDelete.Count + $LegacyDelete.Count + $OtherDelete.Count
$TotalKeep = $CoreKeep.Count + $DockerKeep.Count + $IntegrationKeep.Count

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Files to keep: $TotalKeep"
Write-Host "  Files to review/delete: $TotalDelete" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN - No files will be deleted" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Files that would be deleted:"
    Write-Host ""
    Write-Host "Category C - Docker Swarm:" -ForegroundColor Red
    $SwarmDelete | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "Category D - Legacy Docker:" -ForegroundColor Red
    $LegacyDelete | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "Category E - Other:" -ForegroundColor Yellow
    $OtherDelete | ForEach-Object { Write-Host "  $_" }
    exit 0
}

Write-Host "Actions available:" -ForegroundColor Yellow
Write-Host "  1) Delete Docker Swarm files only"
Write-Host "  2) Delete legacy Docker docs only"
Write-Host "  3) Delete all identified files"
Write-Host "  4) Exit (no changes)"
Write-Host "  5) Delete Docker Swarm + Legacy Docker docs (C + D)"
Write-Host ""

if ($AutoConfirm) {
    $action = "5"
} else {
    $action = Read-Host "Select action [1-5]"
}

switch ($action) {
    "1" {
        Write-Host "Deleting Docker Swarm files..." -ForegroundColor Yellow
        foreach ($f in $SwarmDelete) {
            $fullPath = Join-Path $ProjectRoot $f
            if (Test-Path $fullPath) {
                Remove-Item $fullPath -Force
                Write-Host "  Deleted: $f" -ForegroundColor Green
            }
        }
    }
    "2" {
        Write-Host "Deleting legacy Docker docs..." -ForegroundColor Yellow
        foreach ($f in $LegacyDelete) {
            $fullPath = Join-Path $ProjectRoot $f
            if (Test-Path $fullPath) {
                Remove-Item $fullPath -Force
                Write-Host "  Deleted: $f" -ForegroundColor Green
            }
        }
    }
    "3" {
        $confirm = "yes"
        if (-not $AutoConfirm) {
            $confirm = Read-Host "Delete ALL identified files? This cannot be undone! (yes/no)"
        }
        if ($confirm -eq "yes") {
            Write-Host "Deleting all files..." -ForegroundColor Yellow
            $allDelete = $SwarmDelete + $LegacyDelete + $OtherDelete
            foreach ($f in $allDelete) {
                $fullPath = Join-Path $ProjectRoot $f
                if (Test-Path $fullPath) {
                    Remove-Item $fullPath -Force
                    Write-Host "  Deleted: $f" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "Cancelled."
            exit 0
        }
    }
    "4" {
        Write-Host "Exiting without changes."
        exit 0
    }
    "5" {
        Write-Host "Deleting Docker Swarm + Legacy Docker docs (C + D)..." -ForegroundColor Yellow
        $cdDelete = $SwarmDelete + $LegacyDelete
        foreach ($f in $cdDelete) {
            $fullPath = Join-Path $ProjectRoot $f
            if (Test-Path $fullPath) {
                Remove-Item $fullPath -Force
                Write-Host "  Deleted: $f" -ForegroundColor Green
            }
        }
        Write-Host ""
        Write-Host "  $($SwarmDelete.Count) Swarm files deleted" -ForegroundColor Cyan
        Write-Host "  $($LegacyDelete.Count) Legacy Docker files deleted" -ForegroundColor Cyan
    }
    default {
        Write-Host "Invalid option." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
