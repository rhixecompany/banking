#Requires -Version 5.1
<#
.SYNOPSIS
    Production deployment workflow for Banking App
.DESCRIPTION
    Step-by-step deployment with health checks and verification
.EXAMPLE
    .\deploy.ps1
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

function Write-Step { param([string]$Message) Write-Host "[STEP] $Message" -ForegroundColor Green }
function Write-Warning { param([string]$Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Banking App - Production Deployment Workflow         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify prerequisites
Write-Step "Verifying prerequisites..."
Write-Host "  Checking Docker..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker not found. Please install Docker."
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

# Step 2: Generate htpasswd
Write-Step "Setting up Traefik dashboard authentication..."
$htpasswdFile = Join-Path $ProjectRoot "compose\traefik\auth\htpasswd"
if (-not (Test-Path $htpasswdFile)) {
    Write-Host "  Creating htpasswd file..."
    & "$ScriptDir\generate-htpasswd.ps1" -Password "admin" -ErrorAction SilentlyContinue
    if (Test-Path $htpasswdFile) {
        Write-Host "  ✓ htpasswd created"
    } else {
        Write-Warning "Could not create htpasswd. Run manually: .\generate-htpasswd.ps1"
    }
} else {
    Write-Host "  ✓ htpasswd already exists"
}
Write-Host ""

# Step 3: Verify environment
Write-Step "Verifying environment configuration..."
$envFile = Join-Path $ProjectRoot ".envs\production\.env.production"
if (-not (Test-Path $envFile)) {
    Write-Warning ".envs/production/.env.production not found"
    Write-Host "  Choose an option:"
    Write-Host "    1) Copy from .env.production.example"
    Write-Host "    2) Copy from .env.example"
    $choice = Read-Host "  Enter choice (1-2)"
    
    switch ($choice) {
        "1" {
            $src = Join-Path $ProjectRoot ".env.production.example"
            if (Test-Path $src) {
                Copy-Item $src $envFile -Force
                Write-Warning "Created .envs/production/.env.production - please edit with real values"
            }
        }
        "2" {
            $src = Join-Path $ProjectRoot ".env.example"
            if (Test-Path $src) {
                Copy-Item $src $envFile -Force
                Write-Warning "Created .envs/production/.env.production - please edit with real values"
            }
        }
    }
    exit 1
}

Write-Host "  ✓ Environment configured"
Write-Host ""

# Step 4: Build
Write-Step "Building Docker image..."
Push-Location $ProjectRoot
try {
    docker compose -f docker-compose.yml --env-file $envFile build --no-cache
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed."
        exit 1
    }
    Write-Host "  ✓ Image built"
} finally {
    Pop-Location
}
Write-Host ""

# Step 5: Run migrations
Write-Step "Running database migrations..."
Push-Location $ProjectRoot
try {
    docker compose -f docker-compose.yml --env-file $envFile --profile init up
    docker compose -f docker-compose.yml --env-file $envFile --profile init down --remove-orphans 2>$null
    Write-Host "  ✓ Done"
} catch {
    Write-Warning "Migration may have issues. Continuing..."
}
Pop-Location
Write-Host ""

# Step 6: Start application
Write-Step "Starting application..."
Push-Location $ProjectRoot
docker compose -f docker-compose.yml --env-file $envFile up -d
Pop-Location

Write-Host "  Waiting for services to become healthy..."
$maxAttempts = 60
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ Services healthy"
            break
        }
    } catch { }
    if ($i % 10 -eq 0) {
        Write-Host "    Attempt $i/$maxAttempts..."
    }
    Start-Sleep -Seconds 1
}
Write-Host ""

# Step 7: Verify
Write-Step "Verifying deployment..."
Write-Host "  Service status:"
docker compose ps | Select-Object -First 5
Write-Host ""
Write-Host "  Health check:"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "    ✓ App responding" -ForegroundColor Green
    }
} catch {
    Write-Warning "Health check not responding."
}
Write-Host ""

Write-Step "✓ Deployment complete!"
Write-Host ""
Write-Host "═════════════════════════════════════════════════════════"
Write-Host "Next steps:"
Write-Host "  • View logs: docker compose logs -f app"
Write-Host "  • Check health: curl http://localhost:3000/api/health"
Write-Host "  • Stop app: docker compose down"
Write-Host ""
Write-Host "Documentation:"
Write-Host "  • Docker docs: docs/docker/"
Write-Host "═════════════════════════════════════════════════════════"
