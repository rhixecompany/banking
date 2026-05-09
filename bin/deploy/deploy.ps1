#Requires -Version 5.1
<#
.SYNOPSIS
    Production deployment workflow for Banking App
.DESCRIPTION
    Orchestrator script that calls the TypeScript implementation
.EXAMPLE
    .\deploy.ps1
#>

param(
    [switch]$Help,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

if ($DryRun) {
    Write-Host "[DRY RUN] Would execute: bunx tsx scripts/ts/deploy/deploy-windows.ts" -ForegroundColor Yellow
    exit 0
}

Set-Location $ProjectRoot
bunx tsx scripts/ts/deploy/deploy-windows.ts