#Requires -Version 5.1
<#
.SYNOPSIS
    Docker build automation for Banking App
.DESCRIPTION
    Builds Docker images with optional migration execution
.PARAMETER SkipMigrations
    Skip database migrations
.PARAMETER EnvFile
    Environment file to use
.EXAMPLE
    .\build.ps1
    .\build.ps1 -SkipMigrations
    .\build.ps1 -EnvFile ".env.local"
#>

param(
    [switch]$SkipMigrations,
    [string]$EnvFile = ".envs/production/.env.production",
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

function Write-Step { param([string]$Message) Write-Host "[STEP] $Message" -ForegroundColor Green }
function Write-Warning { param([string]$Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Banking App - Docker Build Script                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify prerequisites
Write-Step "Verifying prerequisites..."
Write-Host "  Checking Docker..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker not found."
    exit 1
}
Write-Host "  ✓ Docker installed"

Write-Host "  Checking Docker Compose..."
try {
    $null = docker compose version 2>&1
    Write-Host "  ✓ Docker Compose installed"
} catch {
    Write-Error "Docker Compose not found."
    exit 1
}
Write-Host ""

# Step 2: Check environment
Write-Step "Verifying environment configuration..."
$FullEnvFile = Join-Path $ProjectRoot $EnvFile.Replace("/", "\")

if (-not (Test-Path $FullEnvFile)) {
    Write-Warning "$EnvFile not found"
    Write-Host "  Attempting to generate using generate-env.ps1..."
    
    & "$ProjectRoot\scripts\docker\generate-env.ps1" -ErrorAction SilentlyContinue
    if (Test-Path $FullEnvFile) {
        Write-Host "  ✓ Environment file generated" -ForegroundColor Green
    }
}
Write-Host ""

# Step 3: Build
Write-Step "Building Docker image..."
Write-Host "  Using: docker-compose.yml"
Write-Host "  Env:   $EnvFile"
Write-Host ""

Push-Location $ProjectRoot
try {
    docker compose -f docker-compose.yml --env-file $EnvFile build --no-cache
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed."
        exit 1
    }
    
    Write-Host ""
    Write-Host "  ✓ Image built" -ForegroundColor Green
} finally {
    Pop-Location
}
Write-Host ""

# Step 4: Run migrations
if (-not $SkipMigrations) {
    Write-Step "Running database migrations..."
    Push-Location $ProjectRoot
    try {
        docker compose -f docker-compose.yml --env-file $EnvFile --profile init up
        docker compose -f docker-compose.yml --env-file $EnvFile --profile init down --remove-orphans 2>$null
        Write-Host "  ✓ Migrations completed" -ForegroundColor Green
    } catch {
        Write-Warning "Migration may have issues. Check logs above."
    }
    Pop-Location
    Write-Host ""
} else {
    Write-Host "[INFO] Skipping migrations (--SkipMigrations flag set)" -ForegroundColor Blue
    Write-Host ""
}

Write-Step "Build complete!"
Write-Host ""
Write-Host "═════════════════════════════════════════════════════════"
Write-Host "Next steps:"
Write-Host "  • Start application:"
Write-Host "    docker compose -f docker-compose.yml --env-file $EnvFile up -d"
Write-Host ""
Write-Host "  • View logs:"
Write-Host "    docker compose logs -f"
Write-Host ""
Write-Host "  • Check health:"
Write-Host "    curl http://localhost:3000/api/health"
Write-Host "═════════════════════════════════════════════════════════"
