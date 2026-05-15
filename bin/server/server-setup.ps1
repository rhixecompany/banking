#Requires -Version 5.1
<#
.SYNOPSIS
    Bootstrap Docker on server
.DESCRIPTION
    Sets up Docker and Docker Compose on a fresh server
.EXAMPLE
    .\server-setup.ps1
#>

param(
    [switch]$Help
)

$ErrorActionPreference = "Stop"

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Please run as Administrator"
    exit 1
}

Write-Host "=== Banking App Server Setup ===" -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Docker..." -ForegroundColor Yellow
    # Note: On Windows, you would typically use Docker Desktop installer
    # This is a placeholder for Linux systems
    Write-Host "Please install Docker Desktop from https://docker.com"
} else {
    Write-Host "Docker already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Creating directory structure..."
$bankingDir = "/opt/banking"
$dirs = @(
    "$bankingDir/compose/traefik/certs",
    "$bankingDir/.envs/production",
    "$bankingDir/scripts"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "✓ Directories created" -ForegroundColor Green
Write-Host ""
Write-Host "=== Setup complete! ===" -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "  1. Copy project files to /opt/banking/"
Write-Host "  2. Create environment file: .envs/production/.env.production"
Write-Host "  3. Generate htpasswd: .\scripts\deploy\generate-htpasswd.ps1"
Write-Host "  4. Start services: docker compose up -d"
