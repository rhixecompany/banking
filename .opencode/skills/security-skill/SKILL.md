---
name: SecuritySkill
description: Security patterns — encryption, env handling, and secret management.
lastReviewed: 2026-04-13
---

# SecuritySkill — Security Patterns

Overview

- Use AES-256-GCM helper (`lib/encryption.ts`) to encrypt tokens before storing.
- Do not log secrets or tokens.

Env Management

- Prefer `app-config.ts` / `lib/env.ts` for validated environment variables.

Validation

- `npm run type-check`
