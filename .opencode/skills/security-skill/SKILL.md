---
name: SecuritySkill
description: Security patterns — encryption, env handling, and secret management.
---

# SecuritySkill — Security Patterns

Overview

- Use AES-256-GCM helper (`lib/encryption.ts`) to encrypt tokens before storing.
- Do not log secrets or tokens.

Env Management

- Prefer `app-config.ts` / `lib/env.ts` for validated environment variables.

Validation

- `npm run type-check`
