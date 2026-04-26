---
description: Guidance for handling upstream API errors and retries
applyTo: "lib/**/*.{ts,tsx}"
priority: medium
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Upstream Error Handling

- Use typed error wrappers for upstream API calls and map to user-friendly messages.
- Implement exponential backoff and circuit breaker where repeated failures are expected.
