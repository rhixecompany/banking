---
description: Core repo standards for code style, commits, and tests
applyTo: "**/*.{ts,tsx,js,md}"
priority: high
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Core Standards

- Use `bun run format` before committing.
- Type-check: `bun run type-check` and fix all TypeScript errors.
- Lint strictly: `bun run lint:strict` — zero warnings allowed for PRs.
- Avoid `any`; prefer `unknown` with guards.
- Zod schemas must include `.describe()` for each field and explicit error messages.
