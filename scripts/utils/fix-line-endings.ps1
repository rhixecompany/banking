#Requires -Version 5.1
<#
.SYNOPSIS
    Fix line endings in markdown files
.DESCRIPTION
    Converts CRLF to LF in all .md files
.EXAMPLE
    .\fix-line-endings.ps1
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

Write-Host "=== Fixing Line Endings ===" -ForegroundColor Green
Write-Host ""

$mdFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.md" -Recurse -File -ErrorAction SilentlyContinue
$fixedCount = 0

foreach ($file in $mdFiles) {
    $content = Get-Content $file.FullName -Raw
    $hasCrlf = $content -match "`r`n"
    
    if ($hasCrlf) {
        # Convert CRLF to LF
        $fixed = $content -replace "`r`n", "`n"
        Set-Content -Path $file.FullName -Value $fixed -NoNewline -Encoding UTF8
        $fixedCount++
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host ""
if ($fixedCount -gt 0) {
    Write-Host "✓ Fixed $fixedCount file(s)" -ForegroundColor Green
} else {
    Write-Host "No files needed fixing." -ForegroundColor Green
}
Write-Host ""
Write-Host "All markdown files now have LF line endings."
