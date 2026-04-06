#Requires -Version 5.1
<#
.SYNOPSIS
    Generate secure environment variables for production
.DESCRIPTION
    Creates .envs/production/.env.production with secure random secrets
.EXAMPLE
    .\generate-env.ps1
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

Write-Host "=== Production Environment Generator ===" -ForegroundColor Green
Write-Host ""

$EnvFile = Join-Path $ProjectRoot ".envs\production\.env.production"

# Check if file already exists
if (Test-Path $EnvFile) {
    $confirm = Read-Host ".envs/production/.env.production exists. Overwrite? (y/n)"
    if ($confirm -ne "y") {
        Write-Host "Aborted."
        exit 0
    }
}

Write-Host "Generating secure secrets..."
Write-Host ""

# Generate secrets
$EncryptionKey = -join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
$NextAuthSecret = [Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
$PostgresPassword = [Convert]::ToBase64String((1..16 | ForEach-Object {Get-Random -Maximum 256}))
$RedisPassword = [Convert]::ToBase64String((1..16 | ForEach-Object {Get-Random -Maximum 256}))

Write-Host "Secrets generated:"
Write-Host "  ENCRYPTION_KEY: $($EncryptionKey.Substring(0,20))..."
Write-Host "  NEXTAUTH_SECRET: $($NextAuthSecret.Substring(0,20))..."
Write-Host "  POSTGRES_PASSWORD: $($PostgresPassword.Substring(0,20))..."
Write-Host "  REDIS_PASSWORD: $($RedisPassword.Substring(0,20))..."
Write-Host ""

# Ensure directory exists
$EnvDir = Split-Path $EnvFile -Parent
if (-not (Test-Path $EnvDir)) {
    New-Item -ItemType Directory -Path $EnvDir -Force | Out-Null
}

# Generate content
$content = @"
# Production Environment Variables
# Generated: $(Get-Date)

# Next.js Public Config
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Database (REQUIRED)
DATABASE_URL=postgresql://postgres:${PostgresPassword}@db:5432/banking
POSTGRES_PASSWORD=${PostgresPassword}
POSTGRES_DB=banking

# Auth & Security (REQUIRED - 32+ characters)
ENCRYPTION_KEY=${EncryptionKey}
NEXTAUTH_SECRET=${NextAuthSecret}

# Redis
REDIS_URL=redis://:${RedisPassword}@redis:6379
REDIS_PASSWORD=${RedisPassword}

# Node Environment
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Traefik/Let's Encrypt
LETSENCRYPT_EMAIL=admin@yourdomain.com
# For production certificates, uncomment below:
# LETSENCRYPT_CA_SERVER=https://acme-v02.api.letsencrypt.org/directory

# Plaid Integration (optional)
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
PLAID_BASE_URL=https://sandbox.plaid.com
PLAID_PRODUCTS=
PLAID_COUNTRY_CODES=

# Dwolla Integration (optional)
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_ENV=sandbox
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com

# Email Configuration (optional)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASS=
# SMTP_FROM=
"@

Set-Content -Path $EnvFile -Value $content

Write-Host "✓ .envs/production/.env.production generated" -ForegroundColor Green
Write-Host ""
Write-Host "⚠ IMPORTANT: Edit .envs/production/.env.production and set:" -ForegroundColor Yellow
Write-Host "  1. NEXT_PUBLIC_SITE_URL=https://yourdomain.com"
Write-Host "  2. LETSENCRYPT_EMAIL=your-email@domain.com"
Write-Host "  3. Any integration keys (Plaid, Dwolla, etc.)"
Write-Host ""
Write-Host "🔒 SECURITY:" -ForegroundColor Yellow
Write-Host "  - Never commit .env.production to git"
Write-Host "  - Copy secrets to secure vault"
Write-Host "  - Rotate secrets periodically"
