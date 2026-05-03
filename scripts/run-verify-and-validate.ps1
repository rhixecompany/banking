#!/usr/bin/env pwsh
<#
Runs format, type-check, lint:strict and verify:rules in sequence.
#>
Set-StrictMode -Version Latest

function Run-Step($cmd) {
    Write-Host "\n=== Running: $cmd ===" -ForegroundColor Cyan
    $proc = Start-Process -FilePath pwsh -ArgumentList "-NoProfile","-Command","$cmd" -NoNewWindow -Wait -PassThru -RedirectStandardOutput stdout.txt -RedirectStandardError stderr.txt
    $out = Get-Content stdout.txt -ErrorAction SilentlyContinue
    $err = Get-Content stderr.txt -ErrorAction SilentlyContinue
    Write-Host $out
    if ($err) { Write-Host $err -ForegroundColor Yellow }
    if ($proc.ExitCode -ne 0) {
        Write-Host "$cmd failed with exit code $($proc.ExitCode)" -ForegroundColor Red
        exit $proc.ExitCode
    } else {
        Write-Host "$cmd succeeded." -ForegroundColor Green
    }
}

Run-Step 'bun run format'
Run-Step 'bun run type-check'
Run-Step 'bun run lint:strict'
Run-Step 'bun run verify:rules'

Write-Host '\nAll steps completed successfully.' -ForegroundColor Green
exit 0
