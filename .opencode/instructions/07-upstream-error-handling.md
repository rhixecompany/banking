---
description: Guidance for handling upstream API errors and retries
applyTo: "lib/**/*.{ts,tsx}"
lastReviewed: 2026-04-14
---

# Upstream Error Handling

- Use typed error wrappers for upstream API calls and map to user-friendly messages.
- Implement exponential backoff and circuit breaker where repeated failures are expected.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
