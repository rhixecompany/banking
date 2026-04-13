#!/usr/bin/env pwsh
# scripts/verify-agents.ps1
# Reviewer checklist for Windows/PowerShell environments:
# type-check -> lint:strict -> unit tests (Vitest) -> E2E (Playwright)

$ErrorActionPreference = 'Stop'

Write-Host "=== verify-agents: START $(Get-Date -Format o) ==="

Write-Host "`n1) TypeScript type-check"
Write-Host "----------------------------------------"
npm run type-check
Write-Host "-> type-check: OK"

Write-Host "`n2) ESLint (strict)"
Write-Host "----------------------------------------"
npm run lint:strict
Write-Host "-> lint:strict: OK"

Write-Host "`n3) Unit tests (Vitest)"
Write-Host "----------------------------------------"
# Run full unit test suite once
npm run test:browser -- --run
Write-Host "-> test:browser: OK"

Write-Host "`n4) End-to-end tests (Playwright)"
Write-Host "----------------------------------------"
# Run full Playwright E2E suite (this repo's test:ui starts the dev server as needed)
# Ensure DB and other preconditions are satisfied before running.
npm run test:ui -- --run
Write-Host "-> test:ui: OK"

Write-Host "`n=== verify-agents: SUCCESS $(Get-Date -Format o) ==="
