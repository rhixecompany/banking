---
applyTo: "**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css"
description: "Best practices for building Next.js (App Router) apps with modern caching, tooling, and server/client boundaries (aligned with Next.js 16.1.1)."
---

<!-- Based on/Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/nextjs.instructions.md -->

# Next.js Best Practices

## 1. Project Structure & Organization

- Use the `app/` directory (App Router) for all new projects
- Top-level folders: `app/`, `public/`, `lib/`, `components/`, `types/`
- Prefer feature folders for large features (e.g., `app/dashboard/`)
- Place files near usage, but avoid deep nesting
- Use parentheses for route groups (e.g., `(auth)`)

## 2. Server and Client Component Integration

- Move all client-only logic/UI into a dedicated Client Component (`'use client'`)
- Import Client Components directly in Server Components
- Never use `next/dynamic` with `{ ssr: false }` in Server Components

## 3. Naming Conventions

- PascalCase for components, camelCase for hooks/utilities, UPPER_SNAKE_CASE for constants
- kebab-case for folders, static assets

## 4. API Routes

- Place API routes in `app/api/`
- Always validate and sanitize input (use zod/yup)
- Protect sensitive routes with middleware or server-side checks

## 5. General Best Practices

- Use TypeScript strict mode
- Enforce linting and formatting
- Store secrets in `.env.local`, never commit secrets
- Write tests for all critical logic and components
- Use semantic HTML and ARIA attributes for accessibility
- Use built-in Next.js optimizations for images/fonts
- Prefer Cache Components for memoization/caching
- Use Sentry for error monitoring
- Document public APIs and components
