---
description: Rate-limit handling patterns for external APIs
applyTo: "lib/**/*.{ts,tsx}"
priority: medium
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Alibaba Rate-Limit Handling

- Detect 429 responses and implement jittered exponential backoff.
- Respect `Retry-After` headers when available.
