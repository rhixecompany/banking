---
description: Auth testing notes and required patterns for protected actions
applyTo: "actions/**/*.{ts,tsx}"
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Auth Testing

- Server Actions that require authentication must call `auth()` at the start and return `{ ok: false, error: 'Unauthorized' }` when missing.
- Tests for protected routes must include both unauthenticated and authenticated cases.
