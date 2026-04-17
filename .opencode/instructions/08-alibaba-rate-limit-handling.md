---
description: Rate-limit handling patterns for external APIs
applyTo: "lib/**/*.{ts,tsx}"
lastReviewed: 2026-04-14
---

# Alibaba Rate-Limit Handling

- Detect 429 responses and implement jittered exponential backoff.
- Respect `Retry-After` headers when available.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
