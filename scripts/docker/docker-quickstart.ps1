#Requires -Version 5.1
<#
.SYNOPSIS
    Docker Quick Start - Interactive menu for Banking Application
.DESCRIPTION
    Provides an interactive menu for common Docker operations
.EXAMPLE
    .\docker-quickstart.ps1
#>

param(
    [switch]$Help
)

$ErrorActionPreference = "Stop"
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
        "Blue" = [ConsoleColor]::Blue
        "White" = [ConsoleColor]::White
    }
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Test-DockerInstalled {
    try {
        $null = Get-Command docker -ErrorAction Stop
        return $true
    } catch {
        Write-ColorOutput "Error: Docker is not installed" "Red"
        return $false
    }
}

function Show-Menu {
    Write-Host ""
    Write-ColorOutput "=== Banking Application Docker Quick Start ===" "Green"
    Write-Host "1. Start development environment (with Traefik)"
    Write-Host "2. Start local environment (no Traefik, direct ports)"
    Write-Host "3. Start with monitoring (Prometheus + Grafana)"
    Write-Host "4. Stop all containers"
    Write-Host "5. View application logs"
    Write-Host "6. Build images"
    Write-Host "7. Run database migrations"
    Write-Host "8. Clean up volumes & restart"
    Write-Host "9. View services status"
    Write-Host "10. Exit"
    Write-Host ""
}

function Start-Default {
    Write-ColorOutput "Starting default environment (with Traefik)..." "Yellow"
    
    $envFile = Join-Path $ProjectRoot ".envs\local\.env.local"
    if (-not (Test-Path $envFile)) {
        Write-ColorOutput "Error: .envs\local\.env.local not found" "Red"
        return
    }
    
    Push-Location $ProjectRoot
    try {
        docker compose -f docker-compose.yml --profile traefik --env-file .envs/local/.env.local up -d
        Write-ColorOutput "✓ Default environment started" "Green"
        Write-Host "Application: http://localhost"
        Write-Host "Traefik Dashboard: https://traefik.localhost"
    } finally {
        Pop-Location
    }
}

function Start-Local {
    Write-ColorOutput "Starting local environment (no Traefik)..." "Yellow"
    
    Push-Location $ProjectRoot
    try {
        docker compose --profile local --env-file .envs/local/.env.local up -d
        Write-ColorOutput "✓ Local environment started" "Green"
        Write-Host "Application: http://localhost:3000"
        Write-Host "Database: localhost:5432"
        Write-Host "Redis: localhost:6379"
    } finally {
        Pop-Location
    }
}

function Start-Monitoring {
    Write-ColorOutput "Starting with monitoring stack..." "Yellow"
    
    Push-Location $ProjectRoot
    try {
        docker compose --profile traefik --profile monitoring --env-file .envs/local/.env.local up -d
        Write-ColorOutput "✓ Monitoring stack started" "Green"
        Write-Host "Application: http://localhost"
        Write-Host "Prometheus: http://prometheus.localhost:9090"
        Write-Host "Grafana: https://grafana.localhost"
    } finally {
        Pop-Location
    }
}

function Stop-All {
    Write-ColorOutput "Stopping all containers..." "Yellow"
    Push-Location $ProjectRoot
    docker compose down
    Pop-Location
    Write-ColorOutput "✓ All containers stopped" "Green"
}

function View-Logs {
    Push-Location $ProjectRoot
    docker compose logs -f
    Pop-Location
}

function Build-Images {
    Write-ColorOutput "Building Docker images..." "Yellow"
    Push-Location $ProjectRoot
    docker compose build
    Pop-Location
    Write-ColorOutput "✓ Images built" "Green"
}

function Migrate-Database {
    Write-ColorOutput "Running database migrations..." "Yellow"
    Push-Location $ProjectRoot
    docker compose --profile init --env-file .envs/local/.env.local up
    docker compose --profile init down
    Pop-Location
    Write-ColorOutput "✓ Migrations completed" "Green"
}

function Cleanup {
    $confirm = Read-Host "This will remove all containers and volumes. Continue? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "Cancelled"
        return
    }
    
    Push-Location $ProjectRoot
    docker compose down -v
    Pop-Location
    Write-ColorOutput "✓ Cleanup completed" "Green"
}

function Show-Status {
    Push-Location $ProjectRoot
    Write-ColorOutput "`nDocker Containers:" "Green"
    docker compose ps
    Write-ColorOutput "`nDocker Volumes:" "Green"
    docker volume ls | Select-String "banking" -SimpleMatch
    Pop-Location
}

# Main
if (-not (Test-DockerInstalled)) {
    exit 1
}

while ($true) {
    Show-Menu
    $choice = Read-Host "Select option [1-10]"
    
    switch ($choice) {
        "1" { Start-Default }
        "2" { Start-Local }
        "3" { Start-Monitoring }
        "4" { Stop-All }
        "5" { View-Logs }
        "6" { Build-Images }
        "7" { Migrate-Database }
        "8" { Cleanup; Start-Default }
        "9" { Show-Status }
        "10" { Write-Host "Goodbye!"; exit 0 }
        default { Write-ColorOutput "Invalid option" "Red" }
    }
    
    $null = Read-Host "Press Enter to continue..."
}
