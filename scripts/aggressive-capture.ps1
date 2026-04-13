param(
    [int]$DurationSeconds = 90
)

# Aggressive Docker event capture for ephemeral MCP tool containers
# - Listens for docker create/destroy events for containers
# - On create: spawns a background job that repeatedly captures `docker inspect` and `docker logs` for that container
# - Saves outputs under ./mcp-capture-logs/<container-id>*

$OutDir = Join-Path (Get-Location) "mcp-capture-logs"
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

$end = (Get-Date).AddSeconds($DurationSeconds)
Write-Output "[aggressive-capture] Listening for docker events for $DurationSeconds seconds. Output: $OutDir"

# Start docker events process
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "docker"
$psi.Arguments = 'events --filter event=create --filter event=destroy --format "{{json .}}"'
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$proc = New-Object System.Diagnostics.Process
$proc.StartInfo = $psi
$started = $proc.Start()
if (-not $started) { Write-Error "Failed to start docker events process"; exit 1 }

$reader = $proc.StandardOutput
$errReader = $proc.StandardError

# Function to spawn a background capture job for a container id
function Start-ContainerCapture {
    param($id, $OutDir)

    $script = {
        param($id, $OutDir)
        $logFile = Join-Path $OutDir ("container-$id.log")
        $inspectFile = Join-Path $OutDir ("container-$id.inspect.json")
        $metaFile = Join-Path $OutDir ("container-$id.meta.txt")
        "Started capture job for $id at $((Get-Date).ToString('o'))" | Out-File -FilePath $metaFile -Encoding utf8

        $attempts = 0
        while ($true) {
            try {
                docker inspect $id | Out-File -FilePath $inspectFile -Encoding utf8 -Append
            } catch {
                "$((Get-Date).ToString('o')) - inspect failed: $($_.Exception.Message)" | Out-File -FilePath $inspectFile -Append -Encoding utf8
            }

            try {
                # Capture logs snapshot
                docker logs $id 2>&1 | Out-File -FilePath $logFile -Encoding utf8
            } catch {
                "$((Get-Date).ToString('o')) - logs failed: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append -Encoding utf8
            }

            Start-Sleep -Milliseconds 200

            # Check if container still exists
            try {
                $exists = docker ps -a --filter "id=$id" --format "{{.ID}}"
            } catch {
                $exists = $null
            }

            if (-not $exists) {
                "$((Get-Date).ToString('o')) - container no longer present" | Out-File -FilePath $metaFile -Append -Encoding utf8
                break
            }

            $attempts++
            if ($attempts -gt 1000) {
                "$((Get-Date).ToString('o')) - reached max attempts ($attempts), stopping capture" | Out-File -FilePath $metaFile -Append -Encoding utf8
                break
            }
        }
    }

    Start-Job -ScriptBlock $script -ArgumentList $id, $OutDir | Out-Null
}

# Process docker events stream
try {
    while (-not $reader.EndOfStream -and (Get-Date) -lt $end) {
        $line = $reader.ReadLine()
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        try {
            $obj = $line | ConvertFrom-Json
        } catch {
            # not JSON - record raw line
            $rawFile = Join-Path $OutDir ("docker-event-raw-$(Get-Date -Format o).txt")
            $line | Out-File -FilePath $rawFile -Encoding utf8 -Append
            continue
        }

        # Save the event line for correlation
        $eventFile = Join-Path $OutDir ("event-$($obj.Time)-$($obj.Actor.ID)-$($obj.Action).json")
        $line | Out-File -FilePath $eventFile -Encoding utf8

        if ($obj.Type -ne 'container') { continue }

        $action = $obj.Action
        $id = $obj.Actor.ID
        Write-Output "[aggressive-capture] Event: $action container $id"

        if ($action -eq 'create') {
            Start-ContainerCapture -id $id -OutDir $OutDir
        } elseif ($action -eq 'destroy') {
            # write a small marker file
            $marker = Join-Path $OutDir ("destroy-$id-$(Get-Date -Format o).txt")
            "destroy event for $id at $((Get-Date).ToString('o'))" | Out-File -FilePath $marker -Encoding utf8
        }
    }
} finally {
    try { if (-not $proc.HasExited) { $proc.Kill() } } catch {}
}

Write-Output "[aggressive-capture] Finished listening. Logs saved under: $OutDir"
