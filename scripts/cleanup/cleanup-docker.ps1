#Requires -Version 5.1
<#
.SYNOPSIS
    Aggressive Docker cleanup script
.DESCRIPTION
    Cleans up Docker system: dangling images, stopped containers, unused networks, images, and build cache
.PARAMETER SkipVolumes
    Skip volume pruning
.PARAMETER AutoConfirm
    Skip all confirmations
.EXAMPLE
    .\cleanup-docker.ps1
    .\cleanup-docker.ps1 -AutoConfirm
#>

param(
    [switch]$SkipVolumes,
    [switch]$AutoConfirm,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

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
        "Blue" = [ConsoleColor]::Cyan
        "White" = [ConsoleColor]::White
    }
    Write-Host $Message -ForegroundColor $colors[$Color]
}

Write-Host ""
Write-ColorOutput "╔════════════════════════════════════════════════════════╗" "Cyan"
Write-ColorOutput "║         Docker Aggressive Cleanup Script             ║" "Cyan"
Write-ColorOutput "╚════════════════════════════════════════════════════════╝" "Cyan"
Write-Host ""

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-ColorOutput "Error: Docker is not installed" "Red"
    exit 1
}

# Show current disk usage
function Show-DiskUsage {
    Write-ColorOutput "Current Docker Disk Usage:" "Cyan"
    docker system df
    Write-Host ""
}

# List items before cleanup
function Get-Items {
    Write-ColorOutput "Listing items to be cleaned:" "Cyan"
    Write-Host ""

    # Dangling images
    $danglingImages = docker images -f "dangling=true" 2>$null | Select-Object -Skip 1
    if ($danglingImages) {
        Write-ColorOutput "Dangling images: $($danglingImages.Count)" "Yellow"
        $danglingImages | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host "Dangling images: 0"
    }
    Write-Host ""

    # Stopped containers
    $stoppedContainers = docker ps -a -f status=exited 2>$null | Select-Object -Skip 1
    if ($stoppedContainers) {
        Write-ColorOutput "Stopped containers: $($stoppedContainers.Count)" "Yellow"
        $stoppedContainers | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host "Stopped containers: 0"
    }
    Write-Host ""

    # Unused networks
    $unusedNetworks = docker network ls -f dangling=true 2>$null | Select-Object -Skip 1
    if ($unusedNetworks) {
        Write-ColorOutput "Unused networks: $($unusedNetworks.Count)" "Yellow"
        $unusedNetworks | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host "Unused networks: 0"
    }
    Write-Host ""

    # Unused images
    $unusedImages = docker images -a 2>$null | Select-Object -Skip 1 | Where-Object { $_ -notmatch "REPOSITORY" -and $_ -notmatch "^<none>" }
    if ($unusedImages) {
        Write-ColorOutput "Unused images: $($unusedImages.Count)" "Yellow"
        $unusedImages | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" }
        if ($unusedImages.Count -gt 10) {
            Write-Host "  ... and $($unusedImages.Count - 10) more"
        }
    } else {
        Write-Host "Unused images: 0"
    }
    Write-Host ""
}

# Aggressive cleanup
function Invoke-AggressiveCleanup {
    Write-ColorOutput "Starting aggressive cleanup..." "Green"
    Write-Host ""

    Write-ColorOutput "Step 1: Removing dangling images..." "Yellow"
    docker image prune -f
    Write-Host ""

    Write-ColorOutput "Step 2: Removing stopped containers..." "Yellow"
    docker container prune -f
    Write-Host ""

    Write-ColorOutput "Step 3: Removing unused networks..." "Yellow"
    docker network prune -f
    Write-Host ""

    Write-ColorOutput "Step 4: Removing unused images..." "Yellow"
    docker image prune -a -f
    Write-Host ""

    Write-ColorOutput "Step 5: Removing build cache..." "Yellow"
    docker builder prune -af
    Write-Host ""
}

# Volume cleanup
function Invoke-VolumeCleanup {
    Write-Host ""
    Write-ColorOutput "⚠️  WARNING: Volume pruning will delete persistent data!" "Red"
    Write-Host ""

    Write-ColorOutput "Current volumes:" "Cyan"
    docker volume ls
    Write-Host ""

    $volumes = docker volume ls -q 2>$null
    if ($volumes.Count -gt 0) {
        Write-Host "Found $($volumes.Count) volume(s)."

        if (-not $AutoConfirm) {
            $confirm = Read-Host "Delete ALL unused volumes? This will delete database data! (yes/no)"
        } else {
            $confirm = "no"
        }

        if ($confirm -eq "yes") {
            Write-ColorOutput "Removing unused volumes..." "Yellow"
            docker volume prune -f
            Write-ColorOutput "Volume cleanup complete" "Green"
        } else {
            Write-Host "Volume cleanup skipped."
        }
    } else {
        Write-Host "No volumes to prune."
    }
}

# Main
Write-ColorOutput "Step 0: Current disk usage" "Cyan"
Show-DiskUsage

Write-ColorOutput "Step 1: Listing items to be cleaned" "Cyan"
Get-Items

if (-not $AutoConfirm) {
    $confirm = Read-Host "Proceed with aggressive Docker cleanup? (yes/no)"
} else {
    $confirm = "yes"
}

if ($confirm -eq "yes") {
    Invoke-AggressiveCleanup

    Write-ColorOutput "Disk usage after cleanup:" "Cyan"
    Show-DiskUsage

    if (-not $SkipVolumes) {
        Invoke-VolumeCleanup
    }

    Write-Host ""
    Write-ColorOutput "╔════════════════════════════════════════════════════════╗" "Green"
    Write-ColorOutput "║              Docker Cleanup Complete!                    ║" "Green"
    Write-ColorOutput "╚════════════════════════════════════════════════════════╝" "Green"
    Write-Host ""
} else {
    Write-Host "Cleanup cancelled."
    exit 0
}
