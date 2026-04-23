---
description: TypeScript and Next.js guidelines for code quality
applyTo: "**/*.ts,**/*.tsx"
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# TypeScript & Next.js Guidelines

- Use TypeScript strict mode for all new code.
- Prefer Server Components; mark client components with `use client` only when needed.
- Keep components small and focused; prefer hooks for logic reuse.
- Use DAL helpers for all DB interactions to avoid N+1 queries.
- Validate external input with Zod and handle errors consistently.
- Avoid direct process.env reads in application code; use app-config.ts.
- Document complex types with TSDoc comments.
