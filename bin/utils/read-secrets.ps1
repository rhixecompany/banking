#Requires -Version 5.1
<#
.SYNOPSIS
    Load environment variables from Docker Compose .env file
.DESCRIPTION
    Reads a .env file and exports variables to the current session
.PARAMETER EnvFile
    Path to the .env file (defaults to .envs/production/.env)
.PARAMETER Help
    Show this help message
.EXAMPLE
    .\read-secrets.ps1
.EXAMPLE
    .\read-secrets.ps1 -EnvFile ".envs/local/.env"
#>

param(
    [string]$EnvFile,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_ROOT = (Get-Item $SCRIPT_DIR).Parent.Parent.FullName

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

if (-not $EnvFile) {
    $EnvFile = Join-Path $PROJECT_ROOT ".envs\production\.env"
}

if (-not (Test-Path $EnvFile)) {
    Write-Error "Environment file not found: $EnvFile"
    exit 1
}

Write-Host "=== Loading Environment Variables ===" -ForegroundColor Green
Write-Host "Source: $EnvFile"
Write-Host ""

$content = Get-Content $EnvFile -Raw

$pattern = '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$'
$lines = $content -split "`n"

$exportCount = 0
foreach ($line in $lines) {
    if ($line -match $pattern) {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $value = $value -replace '^(["\'']?)(.*?)\1$', '$2'
        
        if (-not [string]::IsNullOrWhiteSpace($key) -and -not $key.StartsWith('#')) {
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  + $key" -ForegroundColor Green
            $exportCount++
        }
    }
}

Write-Host ""
Write-Host "Loaded $exportCount variables into current process environment." -ForegroundColor Green
Write-Host "Use `$env:$name to access in PowerShell (e.g., `$env:ENCRYPTION_KEY)."
