# Spec: test-triage-iterative

Scope: feature

# Test Triage & Fix Iterative Workflow

## Overview

Run Vitest and Playwright tests iteratively without timeout, triaging and fixing failures in batches until all tests pass.

## Parameters

| Parameter  | Value                                        |
| ---------- | -------------------------------------------- |
| Test Types | Vitest (unit/integration) + Playwright (E2E) |
| Timeout    | 0 (infinite)                                 |
| Batch Size | 6 failures per batch                         |

## Workflow

### Phase 1: Vitest

1. Run Vitest without timeout: `vitest run --config=vitest.config.ts --testTimeout=0`
2. Read output, identify failures
3. Triage first batch (max 6 failures)
4. Fix failures
5. Repeat until 0 failures

### Phase 2: Port 3000 Cleanup

Free port 3000 after Vitest:

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

### Phase 3: Playwright

1. Run Playwright without timeout: `playwright test --project=chromium --timeout=0`
2. Read output, identify failures
3. Triage first batch (max 6 failures)
4. Fix failures
5. Repeat until 0 failures

### Phase 4: Final Port Cleanup

Free port 3000 after Playwright (same as Phase 2).

## Notes

- Use bun as package manager per AGENTS.md
- Batch failures by root cause similarity
- Re-run full test suite after each batch fix
