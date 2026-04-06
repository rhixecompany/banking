#Requires -Version 5.1
param(
    [switch]$DryRun,
    [switch]$AutoConfirm,
    [switch]$Help
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    $colors = @{
        "Red" = [ConsoleColor]::Red
        "Green" = [ConsoleColor]::Green
        "Yellow" = [ConsoleColor]::Yellow
        "Blue" = [ConsoleColor]::Cyan
        "White" = [ConsoleColor]::White
    }
    Write-Host $Message -ForegroundColor $colors[$Color]
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Documentation Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Scanning documentation files..." -ForegroundColor Cyan
Write-Host ""

$CoreKeep = @()
$DockerKeep = @()
$IntegrationKeep = @()
$SwarmDelete = @()
$LegacyDelete = @()
$OtherDelete = @()

$SwarmPatterns = @(
    "docs\docker\swarm-overview.md",
    "docs\traefik\docker-swarm.md"
)

$LegacyPatterns = @(
    "00-DOCKER-START-HERE.md",
    "00-START-HERE.md",
    "DOCKER-COMMANDS.md",
    "DOCKER-CONFIG-SUMMARY.md",
    "DOCKER-DEPLOYMENT.md",
    "DOCKER-IMPLEMENTATION.md",
    "DOCKER-INDEX.md",
    "DOCKER-MANIFEST.md",
    "DOCKER-QUICK-START.md",
    "DOCKER-SETUP-CHECKLIST.md",
    "DOCKER-SETUP.md",
    "DOCKER-SUMMARY.md",
    "DOCKERFILE-EXPLANATION.md",
    "DEPLOYMENT-MIGRATION.md",
    "PRODUCTION-DEPLOYMENT.md"
)

$OtherRootPatterns = @(
    "INDEX.md",
    "QUICK-REFERENCE.md",
    "ARCHITECTURE.md",
    "SECURITY.md",
    "OPTIMIZATION-SUMMARY.md",
    "MARKETPLACE.md",
    "CONTRIBUTING.md",
    "SUPPORT.md",
    "setupTasks.md",
    "blocks.prompts.md",
    "README.opencode.md"
)

$ESLintPluginPatterns = @(
    "docs\eslint-plugin-*-context.md"
)

$mdFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.md" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { 
        $_.FullName -notmatch "node_modules" -and 
        $_.FullName -notmatch "\.cursor" -and 
        $_.FullName -notmatch "\.github" -and 
        $_.FullName -notmatch "\.opencode" -and
        $_.FullName -notmatch "data"
    }

foreach ($file in $mdFiles) {
    $relPath = $file.FullName.Replace("$ProjectRoot\", "").Replace("/", "\")
    
    if ($relPath -eq "README.md" -or $relPath -eq "AGENTS.md") {
        $CoreKeep += $relPath
        continue
    }
    
    if ($relPath -like "docs\docker\*") {
        $DockerKeep += $relPath
        continue
    }
    
    if ($relPath -like "docs\plaid\*") {
        $IntegrationKeep += $relPath
        continue
    }
    
    if ($relPath -like "docs\services\*") {
        $IntegrationKeep += $relPath
        continue
    }
    
    $isSwarm = $false
    foreach ($p in $SwarmPatterns) {
        if ($relPath -like $p) {
            $SwarmDelete += $relPath
            $isSwarm = $true
            break
        }
    }
    if ($isSwarm) { continue }
    
    $isLegacy = $false
    foreach ($p in $LegacyPatterns) {
        if ($relPath -like $p) {
            $LegacyDelete += $relPath
            $isLegacy = $true
            break
        }
    }
    if ($isLegacy) { continue }
    
    if ($relPath -like "docs\traefik\*") {
        $LegacyDelete += $relPath
        continue
    }
    
    $isOther = $false
    foreach ($p in $OtherRootPatterns) {
        if ($relPath -like $p) {
            $OtherDelete += $relPath
            $isOther = $true
            break
        }
    }
    if ($isOther) { continue }
    
    $isESLint = $false
    foreach ($p in $ESLintPluginPatterns) {
        if ($relPath -like $p) {
            $OtherDelete += $relPath
            $isESLint = $true
            break
        }
    }
    if ($isESLint) { continue }
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
