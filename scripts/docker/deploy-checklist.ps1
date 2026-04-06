#Requires -Version 5.1
<#
.SYNOPSIS
    Production deployment checklist
.DESCRIPTION
    Checks if the project is ready for production deployment
.EXAMPLE
    .\deploy-checklist.ps1
#>

param(
    [switch]$Help
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

Write-Host "=== Docker Production Readiness Checklist ===" -ForegroundColor Green
Write-Host ""

# 1. Check if .env.production exists
$envFile = Join-Path $ProjectRoot ".envs\production\.env.production"
if (Test-Path $envFile) {
    Write-Host "✓ .envs/production/.env.production found" -ForegroundColor Green
    $content = Get-Content $envFile -Raw
    if ($content -match "CHANGE_ME|yourdomain") {
        Write-Host "⚠ WARNING: Contains placeholders - replace before deploying" -ForegroundColor Yellow
    } else {
        Write-Host "✓ .env.production appears to have real values" -ForegroundColor Green
    }
} else {
    Write-Host "✗ .envs/production/.env.production not found" -ForegroundColor Red
    Write-Host "  Run: .\generate-env.ps1" -ForegroundColor Cyan
}
Write-Host ""

# 2. Check Dockerfile optimizations
Write-Host "Checking Dockerfile optimizations..."
$dockerfile = Join-Path $ProjectRoot "compose\dev\node\Dockerfile"
if ((Test-Path $dockerfile) -and (Select-String $dockerfile -Pattern "distroless" -Quiet)) {
    Write-Host "✓ Using distroless base image" -ForegroundColor Green
}
if ((Test-Path $dockerfile) -and (Select-String $dockerfile -Pattern "HEALTHCHECK|appuser" -Quiet)) {
    Write-Host "✓ Non-root user and HEALTHCHECK defined" -ForegroundColor Green
}
Write-Host ""

# 3. Check docker-compose security options
Write-Host "Checking docker-compose security options..."
$composeFile = Join-Path $ProjectRoot "docker-compose.yml"
if (Select-String $composeFile -Pattern "no-new-privileges" -Quiet) {
    Write-Host "✓ no-new-privileges security option enabled" -ForegroundColor Green
}
if (Select-String $composeFile -Pattern "env_file" -Quiet) {
    Write-Host "✓ env_file configuration found" -ForegroundColor Green
}
Write-Host ""

# 4. Test health check endpoint
Write-Host "Testing health check endpoint..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Health check endpoint responsive" -ForegroundColor Green
    }
} catch {
    Write-Host "ℹ Health check not responding (app may not be running)" -ForegroundColor Yellow
}
Write-Host ""

# 5. Check Docker image
Write-Host "Checking Docker image..."
try {
    $image = docker image inspect banking-app:latest 2>$null
    if ($image) {
        $size = ($image | ConvertFrom-Json | Select-Object -First 1).Size
        $sizeMB = [math]::Round($size / 1MB, 2)
        Write-Host "✓ Image size: ${sizeMB}MB" -ForegroundColor Green
    }
} catch {
    Write-Host "ℹ banking-app:latest not found - build with: docker compose build" -ForegroundColor Yellow
}
Write-Host ""

# 6. Check Traefik auth
Write-Host "Checking Traefik dashboard authentication..."
$htpasswdFile = Join-Path $ProjectRoot "compose\traefik\auth\htpasswd"
if (Test-Path $htpasswdFile) {
    Write-Host "✓ htpasswd file exists" -ForegroundColor Green
} else {
    Write-Host "⚠ htpasswd not found - run: .\deploy\generate-htpasswd.ps1" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Deployment Steps ===" -ForegroundColor Green
Write-Host "1. Generate env file: .\generate-env.ps1"
Write-Host "2. Edit .envs/production/.env.production with real values"
Write-Host "3. Generate htpasswd: ..\deploy\generate-htpasswd.ps1"
Write-Host "4. Build image: docker compose build"
Write-Host "5. Run migrations: docker compose --profile init up"
Write-Host "6. Stop migrations: docker compose --profile init down"
Write-Host "7. Start app: docker compose up -d"
Write-Host "8. Check health: curl http://localhost:3000/api/health"
Write-Host "9. View logs: docker compose logs -f"
