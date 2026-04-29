---
name: security-skill
description: Security patterns for encryption, environment handling, and secret management.
lastReviewed: 2026-04-24
applyTo: "lib/**/*.{ts,js}"
---

# SecuritySkill — Security Patterns

Overview

- Use AES-256-GCM helper (`lib/encryption.ts`) to encrypt tokens before storing.
- Do not log secrets or tokens.

Env Management

- Prefer `app-config.ts` / `lib/env.ts` for validated environment variables.

Validation

- `bun run type-check`
