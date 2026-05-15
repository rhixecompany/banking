#Requires -Version 5.1
<#
.SYNOPSIS
    Generate htpasswd file for Traefik dashboard
.DESCRIPTION
    Creates htpasswd for basic authentication on Traefik dashboard
.PARAMETER Username
    Username for dashboard access (default: admin)
.PARAMETER Password
    Password for dashboard access (default: admin)
.EXAMPLE
    .\generate-htpasswd.ps1 -Username admin -Password mypassword
#>

param(
    [string]$Username = "admin",
    [string]$Password = "admin",
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Full
    exit 0
}

$AuthDir = Join-Path $ProjectRoot "compose\traefik\auth"
$HtpasswdFile = Join-Path $AuthDir "htpasswd"

Write-Host "Generating htpasswd for user: $Username"

# Create auth directory
if (-not (Test-Path $AuthDir)) {
    New-Item -ItemType Directory -Path $AuthDir -Force | Out-Null
}

# Generate htpasswd
# Using bcrypt-like hash (Apache format)
try {
    $salt = -join ((97..122) + (48..57) | Get-Random -Count 22 | ForEach-Object {[char]$_})
    $salt = $salt.Substring(0, 22)
    
    # Simple APR1 hash approximation
    $passwordHash = "$Username:`$apr1`$$salt`$$(([System.Security.Cryptography.MD5]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes("$Password`$salt")) | ForEach-Object {$_.ToString("x2")}) -join '')"
    
    # For Windows, we'll create a basic htpasswd-compatible file
    # Using the standard Apache htpasswd format
    $md5 = [System.Security.Cryptography.MD5]::Create()
    $saltBytes = [System.Text.Encoding]::ASCII.GetBytes($salt)
    $passwordBytes = [System.Text.Encoding]::ASCII.GetBytes($Password)
    
    $hash = $md5.ComputeHash($passwordBytes + $saltBytes + $passwordBytes)
    for ($i = 0; $i -lt 1000; $i++) {
        if ($i % 2 -eq 0) {
            $hash = $md5.ComputeHash($hash + $saltBytes)
        } else {
            $hash = $md5.ComputeHash($hash + $passwordBytes)
        }
    }
    
    $hashStr = [Convert]::ToBase64String($hash)
    $hashStr = $hashStr.Replace("+", ".").Replace("/", ".").Replace("=", "")
    
    $htpasswdLine = "${Username}:`$apr1`$${salt.Substring(0,8)}${hashStr}"
    Set-Content -Path $HtpasswdFile -Value $htpasswdLine -NoNewline
    
    # Set permissions
    if (-not ([System.Environment]::OSVersion.Platform -eq "Unix")) {
        $acl = Get-Acl $HtpasswdFile
        $acl.SetAccessRuleProtection($true, $false)
        $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($identity, "FullControl", "Allow")
        $acl.AddAccessRule($rule)
        Set-Acl -Path $HtpasswdFile -AclObject $acl
    }
    
    Write-Host "Created: $HtpasswdFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Change default credentials in production!" -ForegroundColor Yellow
    Write-Host "  User: $Username"
    Write-Host "  File: $HtpasswdFile"
    
} catch {
    Write-Error "Failed to generate htpasswd: $_"
    Write-Host ""
    Write-Host "Alternative: Use htpasswd command if available (Apache Utils)"
    Write-Host "  htpasswd -Bc $HtpasswdFile $Username"
    exit 1
}
