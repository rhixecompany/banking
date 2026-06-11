#Requires -Version 5.1
<#
.SYNOPSIS
    Automated Banking App Setup (Cross-Platform)
.DESCRIPTION
    Sets up the Banking App on Linux VPS or Windows (Docker Desktop).
    Supports Docker Compose deployment.
.PARAMETER Platform
    Target platform: 'linux' or 'windows'
.PARAMETER InstallDir
    Installation directory (Linux only)
.PARAMETER Profile
    Docker Compose profile: default, local, or monitoring
.PARAMETER Domain
    Domain or IP address for the application
.PARAMETER SkipBuild
    Skip building Docker image (use pre-built)
.EXAMPLE
    .\vps-setup.ps1 -Platform linux -Domain 192.168.1.100
.EXAMPLE
    .\vps-setup.ps1 -Platform windows
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('linux', 'windows', 'auto')]
    [string]$Platform = 'auto',

    [Parameter(Mandatory=$false)]
    [string]$InstallDir = "/opt/banking",

    [Parameter(Mandatory=$false)]
    [ValidateSet('default', 'local', 'monitoring')]
    [string]$Profile = 'default',

    [Parameter(Mandatory=$false)]
    [string]$Domain = '',

    [Parameter(Mandatory=$false)]
    [string]$Email = 'admin@example.com',

    [switch]$SkipBuild,

    [switch]$Help
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

function Write-Banner {
    param([string]$Text, [string]$Color = "Cyan")
    $colors = @{
        "Red" = [ConsoleColor]::Red
        "Green" = [ConsoleColor]::Green
        "Yellow" = [ConsoleColor]::Yellow
        "Cyan" = [ConsoleColor]::Cyan
        "Magenta" = [ConsoleColor]::Magenta
    }
    Write-Host ""
    Write-Host ("=" * 50) -ForegroundColor $colors[$Color]
    Write-Host "  $Text" -ForegroundColor $colors[$Color]
    Write-Host ("=" * 50) -ForegroundColor $colors[$Color]
    Write-Host ""
}

function Write-Step {
    param([string]$Text)
    Write-Host "[*] $Text" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "[✓] $Text" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Text)
    Write-Host "[!] $Text" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Text)
    Write-Host "[✗] $Text" -ForegroundColor Red
}

# Help
if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

# Detect platform
if ($Platform -eq 'auto') {
    if ($IsWindows -or $env:OS -eq "Windows_NT") {
        $Platform = 'windows'
    } else {
        $Platform = 'linux'
    }
}

Write-Banner "Banking App Setup v2.0" -Color Cyan
Write-Host "Platform: $Platform" -ForegroundColor Yellow
Write-Host ""

# Get server IP
if ([string]::IsNullOrEmpty($Domain)) {
    if ($Platform -eq 'windows') {
        $Domain = "localhost"
    } else {
        $Domain = (Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Manual | Where-Object { $_.IPAddress -notlike "127.*" } | Select-Object -First 1).IPAddress
        if ([string]::IsNullOrEmpty($Domain)) {
            $Domain = "localhost"
        }
    }
}

Write-Host "Domain/IP: $Domain" -ForegroundColor Yellow
Write-Host ""

# ==================== WINDOWS SETUP ====================
if ($Platform -eq 'windows') {
    Write-Banner "Windows Setup (Docker Desktop)" -Color Green

    # Check Docker Desktop
    Write-Step "Checking Docker Desktop..."
    try {
        $dockerVersion = docker --version 2>$null
        if ($LASTEXITCODE -ne 0) { throw "Docker not found" }
        Write-Success "Docker found: $dockerVersion"
    } catch {
        Write-Error "Docker Desktop is not installed or not running"
        Write-Host "Please install Docker Desktop from: https://docker.com/products/docker-desktop"
        exit 1
    }

    # Check Docker is running
    Write-Step "Checking Docker is running..."
    if (-not (docker info 2>$null)) {
        Write-Error "Docker is not running. Please start Docker Desktop."
        exit 1
    }
    Write-Success "Docker is running"

    # Create .env file if it doesn't exist
    $envFile = Join-Path $ProjectRoot ".env.local"
    if (-not (Test-Path $envFile)) {
        Write-Step "Creating .env.local..."
        
        $encryptionKey = -join ((1..32) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
        $nextauthSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

        $envContent = @"
# Banking Application - Development Environment
NODE_ENV=development
PORT=3000
HOSTNAME=0.0.0.0
DOMAIN=localhost
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Security
ENCRYPTION_KEY=$encryptionKey
NEXTAUTH_SECRET=$nextauthSecret

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/banking

# Redis
REDIS_URL=redis://localhost:6379
"@

        Set-Content -Path $envFile -Value $envContent -Encoding UTF8
        Write-Success "Created .env.local"
    } else {
        Write-Warning ".env.local already exists"
    }

    # Create .envs/local/.env.local if needed
    $envsDir = Join-Path $ProjectRoot ".envs\local"
    if (-not (Test-Path $envsDir)) {
        New-Item -ItemType Directory -Path $envsDir -Force | Out-Null
        Copy-Item $envFile "$envsDir\.env.local"
        Write-Success "Created .envs/local/.env.local"
    }

    # Build
    if (-not $SkipBuild) {
        Write-Step "Building Docker images..."
        docker compose build
        Write-Success "Build complete"
    }

    # Run migrations
    Write-Step "Running database migrations..."
    docker compose --profile init up
    Start-Sleep -Seconds 5
    docker compose --profile init down
    Write-Success "Migrations complete"

    # Start services
    Write-Step "Starting services..."
    docker compose up -d
    Write-Success "Services started"

    # Wait for app
    Write-Step "Waiting for application to be ready..."
    $maxAttempts = 30
    for ($i = 1; $i -le $maxAttempts; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Success "Application is healthy!"
                break
            }
        } catch {
            Write-Host -NoNewline "."
            Start-Sleep -Seconds 2
        }
    }

    Write-Banner "Setup Complete!" -Color Green
    Write-Host "Application: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Useful commands:" -ForegroundColor Yellow
    Write-Host "  docker compose logs -f     View logs"
    Write-Host "  docker compose down         Stop services"
    Write-Host "  docker compose up -d       Start services"
    Write-Host ""
    exit 0
}

# ==================== LINUX SETUP ====================
Write-Banner "Linux/VPS Setup" -Color Green

# Check if running as root
$isRoot = $((whoami) -eq "root")

# Check Docker
Write-Step "Checking Docker..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Warning "Docker not found. Installing..."
    if (-not $isRoot) {
        Write-Error "Please run as root or use sudo"
        exit 1
    }
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
}
Write-Success "Docker installed"

# Get server IP
if ([string]::IsNullOrEmpty($Domain) -or $Domain -eq "localhost") {
    $serverIP = hostname -I | awk '{print $1}'
    if ([string]::IsNullOrEmpty($serverIP)) {
        $serverIP = "localhost"
    }
} else {
    $serverIP = $Domain
}

Write-Host "Server IP: $serverIP" -ForegroundColor Yellow
Write-Host ""

# Check for existing installation
$needsClone = $true
if (Test-Path $InstallDir) {
    Write-Warning "$InstallDir already exists"
    $update = Read-Host "Update existing installation? (y/N)"
    if ($update -eq 'y' -or $update -eq 'Y') {
        Push-Location $InstallDir
        git pull origin main 2>$null
        Pop-Location
        $needsClone = $false
        Write-Success "Updated existing installation"
    }
} else {
    # Clone repository
    Write-Step "Cloning repository..."
    if (-not $isRoot) {
        Write-Error "Please run as root or use sudo"
        exit 1
    }
    git clone "https://github.com/rhixecompany/banking.git" $InstallDir
    Write-Success "Repository cloned"
}

# Create directories
Write-Step "Creating directories..."
$dirs = @(
    "$InstallDir/compose/traefik/certs",
    "$InstallDir/compose/traefik/auth",
    "$InstallDir/.envs/production"
)
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}
Write-Success "Directories created"

# Generate secrets
Write-Step "Generating secrets..."
$encryptionKey = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
$nextauthSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Create environment file
Write-Step "Creating environment file..."
$envContent = @"
# Banking Application - Production Environment
# Generated by vps-setup.ps1

NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
DOMAIN=${serverIP}
NEXT_PUBLIC_SITE_URL=http://${serverIP}

# Security
ENCRYPTION_KEY=${encryptionKey}
NEXTAUTH_SECRET=${nextauthSecret}

# Database
DATABASE_URL=postgresql://postgres:banking_secure_pass@postgres:5432/banking
POSTGRES_USER=postgres
POSTGRES_PASSWORD=banking_secure_pass
POSTGRES_DB=banking

# Redis
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=banking_redis_pass

# Plaid (optional)
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox

# Dwolla (optional)
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox

# Docker
COMPOSE_PROFILE=${Profile}
"@

Set-Content -Path "$InstallDir/.envs/production/.env.production" -Value $envContent -Encoding UTF8
Write-Success "Environment file created"

# Generate htpasswd
Write-Step "Generating Traefik credentials..."
$htpasswdFile = "$InstallDir/compose/traefik/auth/htpasswd"
try {
    $htpasswdOutput = docker run --rm --entrypoint htpasswd httpd:2 -bc "$htpasswdFile" admin banking123 2>&1
    Write-Success "htpasswd created (admin:banking123)"
} catch {
    Write-Warning "Could not generate htpasswd. Creating manually..."
    "admin:$apr1$randomhash$randomhash" | Out-File -FilePath $htpasswdFile -Encoding ASCII
}

# Build or pull
Push-Location $InstallDir
if (-not $SkipBuild) {
    Write-Step "Building Docker images..."
    Write-Warning "This may take 10-15 minutes..."
    docker compose build --build-arg "NEXT_PUBLIC_SITE_URL=http://${serverIP}"
    Write-Success "Build complete"
} else {
    Write-Step "Pulling Docker image..."
    docker compose pull
}

# Run migrations
Write-Step "Running database migrations..."
docker compose --profile init up 2>$null
Start-Sleep -Seconds 10
docker compose --profile init down
Write-Success "Migrations complete"

# Start services
Write-Step "Starting services..."
switch ($Profile) {
    'monitoring' { docker compose --profile monitoring up -d }
    'local' { docker compose --profile local up -d }
    default { docker compose up -d }
}
Write-Success "Services started"

# Wait for app
Write-Step "Waiting for application to be ready..."
$maxAttempts = 30
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://${serverIP}:3000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "Application is healthy!"
            break
        }
    } catch {
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 2
    }
}

Pop-Location

# Final output
Write-Banner "Setup Complete!" -Color Green
Write-Host "Application:       http://${serverIP}:3000" -ForegroundColor Cyan
Write-Host "Traefik Dashboard: http://${serverIP}:8090" -ForegroundColor Cyan
Write-Host "  Username: admin" -ForegroundColor Cyan
Write-Host "  Password: banking123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  docker compose logs -f     View logs"
Write-Host "  docker compose down        Stop services"
Write-Host "  docker compose up -d       Start services"
Write-Host ""
Write-Host "Update:" -ForegroundColor Yellow
Write-Host "  cd $InstallDir && git pull origin main"
Write-Host "  docker compose build && docker compose up -d"
Write-Host ""
