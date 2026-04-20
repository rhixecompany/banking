---
description: Core repo standards for code style, commits, and tests
applyTo: "**/*.{ts,tsx,js,md}"
lastReviewed: 2026-04-14
---

# Core Standards

- Use `npm run format` before committing.
- Type-check: `npm run type-check` and fix all TypeScript errors.
- Lint strictly: `npm run lint:strict` — zero warnings allowed for PRs.
- Avoid `any`; prefer `unknown` with guards.
- Zod schemas must include `.describe()` for each field and explicit error messages.
