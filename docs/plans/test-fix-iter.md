---
plan name: test-fix-iter
plan description: Run tests iteratively and fix in batches
plan status: active
---

## Idea

Run Vitest tests iteratively without timeout, triage failures in groups of 6, fix each batch, then repeat until no errors. Free port 3000 after Vitest. Then run Playwright tests iteratively without timeout, triage failures in groups of 6, fix each batch, and repeat until no errors. Free port 3000 after Playwright.

## Implementation

- Phase 1: Run Vitest WITHOUT timeout - override testTimeout to 0 via CLI flag
- Phase 2: Read Vitest output, identify first batch of up to 6 failures, and analyze root causes
- Phase 3: Fix first batch of failures (max 6), then rerun Vitest WITHOUT timeout
- Phase 4: Repeat Phase 2-3 until Vitest has 0 failures
- Phase 5: Free port 3000 using PowerShell script from AGENTS.md
- Phase 6: Run Playwright WITHOUT timeout - override timeout via CLI flag
- Phase 7: Read Playwright output, identify first batch of up to 6 failures, and analyze root causes
- Phase 8: Fix first batch of failures (max 6), then rerun Playwright WITHOUT timeout
- Phase 9: Repeat Phase 7-8 until Playwright has 0 failures
- Phase 10: Free port 3000 using PowerShell script from AGENTS.md

## Required Specs

<!-- SPECS_START -->

- test-triage-iterative
<!-- SPECS_END -->
