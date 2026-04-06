#Requires -Version 5.1
<#
.SYNOPSIS
    Generate self-signed TLS certificates for Traefik
.DESCRIPTION
    Creates CA and server certificates for local HTTPS
.EXAMPLE
    .\gen-certs.ps1
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

Write-Host "=== TLS Certificate Generator ===" -ForegroundColor Green
Write-Host ""

$CertDir = Join-Path $ProjectRoot "compose\traefik\certs"

# Create cert directory
if (-not (Test-Path $CertDir)) {
    New-Item -ItemType Directory -Path $CertDir -Force | Out-Null
}

Write-Host "Generating certificates in: $CertDir"
Write-Host ""

# Note: PowerShell doesn't have native OpenSSL
# For Windows, you need OpenSSL installed or use WSL
Write-Host "Note: This script requires OpenSSL to be installed." -ForegroundColor Yellow
Write-Host ""

if (Get-Command openssl -ErrorAction SilentlyContinue) {
    # Generate using OpenSSL
    Write-Host "OpenSSL found. Generating certificates..."
    
    $caKey = Join-Path $CertDir "ca.key"
    $caCert = Join-Path $CertDir "ca.crt"
    $serverKey = Join-Path $CertDir "server.key"
    $serverCert = Join-Path $CertDir "server.crt"
    $serverCsr = Join-Path $CertDir "server.csr"
    
    # Generate CA
    Write-Host "  Generating CA..."
    & openssl genrsa -out $caKey 2048 2>$null
    & openssl req -new -x509 -days 365 -key $caKey -out $caCert -subj "/CN=Banking CA" 2>$null
    
    # Generate server key
    Write-Host "  Generating server key..."
    & openssl genrsa -out $serverKey 2048 2>$null
    
    # Generate server certificate
    Write-Host "  Generating server certificate..."
    & openssl req -new -key $serverKey -out $serverCsr -subj "/CN=banking.localhost" 2>$null
    & openssl x509 -req -days 365 -in $serverCsr -CA $caCert -CAkey $caKey -CAcreateserial -out $serverCert 2>$null
    
    # Cleanup
    Remove-Item $serverCsr -Force -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "✓ Certificates generated:" -ForegroundColor Green
    Get-ChildItem $CertDir | ForEach-Object { Write-Host "  - $($_.Name)" }
    
} else {
    Write-Host "OpenSSL not found. Please either:" -ForegroundColor Yellow
    Write-Host "  1. Install OpenSSL from https://slproweb.com/products/Win32OpenSSL.html"
    Write-Host "  2. Use WSL (Windows Subsystem for Linux)"
    Write-Host "  3. Run 'bash scripts/server/gen-certs.sh' in WSL"
    Write-Host ""
    Write-Host "Alternative: Use Docker's mkcert or letsencrypt in production"
}
