---
name: "nextjs-patterns"
description: "Best practices for building Next.js (App Router) apps with modern caching, tooling, and server/client boundaries (aligned with Next.js 16.2.2)."
applyTo: "**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css"
priority: "high"
version: "1.1"
lastUpdated: "2026-04-05"
---

# Next.js Best Practices for LLMs (2026)

_Last updated: April 2026 (aligned to Next.js 16.2.2)_

This document summarizes the latest, authoritative best practices for building, structuring, and maintaining Next.js applications. It is intended for use by LLMs and developers to ensure code quality, maintainability, and scalability.

## 3. Component Best Practices

- **Component Types:**
  - **Server Components** (default): For data fetching, heavy logic, and non-interactive UI.
  - **Client Components:** Add `'use client'` at the top. Use for interactivity, state, or browser APIs.
- **When to Create a Component:**
  - If a UI pattern is reused more than once.
  - If a section of a page is complex or self-contained.
  - If it improves readability or testability.
- **Naming Conventions:**
  - Use `PascalCase` for component files and exports (e.g., `UserCard.tsx`).
  - Use `camelCase` for hooks (e.g., `useUser.ts`).
  - Use `snake_case` or `kebab-case` for static assets (e.g., `logo_dark.svg`).
  - Name context providers as `XyzProvider` (e.g., `ThemeProvider`).
- **File Naming:**
  - Match the component name to the file name.
  - For single-export files, default export the component.
  - For multiple related components, use an `index.ts` barrel file.
- **Component Location:**
  - Place shared components in `components/`.
  - Place route-specific components inside the relevant route folder.
- **Props:**
  - Use TypeScript interfaces for props.
  - Prefer explicit prop types and default values.
- **Testing:**
  - Co-locate tests with components (e.g., `UserCard.test.tsx`).

## 4. Naming Conventions (General)

- **Folders:** `kebab-case` (e.g., `user-profile/`)
- **Files:** `PascalCase` for components, `camelCase` for utilities/hooks, `kebab-case` for static assets
- **Variables/Functions:** `camelCase`
- **Types/Interfaces:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`

## 5. API Routes (Route Handlers)

- **Prefer Server Actions over API Routes** for mutations in this project.
- **Location:** Place API routes in `app/api/` (e.g., `app/api/auth/[...nextauth]/route.ts`).
- **HTTP Methods:** Export async functions named after HTTP verbs (`GET`, `POST`, etc.).
- **Request/Response:** Use the Web `Request` and `Response` APIs. Use `NextRequest`/`NextResponse` for advanced features.
- **Dynamic Segments:** Use `[param]` for dynamic API routes.
- **Validation:** Always validate and sanitize input. Use `zod`.
- **Error Handling:** Return appropriate HTTP status codes and error messages.
- **Authentication:** Protect sensitive routes using middleware (`proxy.ts`) or server-side session checks.

### Route Handler usage note (performance)

- **Do not call your own Route Handlers from Server Components** (e.g., `fetch('/api/...')`) just to reuse logic. Prefer extracting shared logic into modules (e.g., `lib/`, `dal/`) and calling it directly.

## 6. General Best Practices

- **TypeScript:** Use TypeScript for all code. Enable `strict` mode in `tsconfig.json`.
- **ESLint & Prettier:** Enforce code style and linting. Use the official Next.js ESLint config. In Next.js 16, prefer running ESLint via the ESLint CLI (not `next lint`).
- **Environment Variables:** Store secrets in `.env.local`. Never commit secrets to version control.
  - **Never read `process.env` directly** — use `app-config.ts` (preferred) or `lib/env.ts`.
  - `NEXT_PUBLIC_` variables are **inlined at build time**.
- **Testing:** Use Vitest (unit) and Playwright (E2E). Write tests for all critical logic and components.
- **Accessibility:** Use semantic HTML and ARIA attributes. Test with screen readers.
- **Performance:**
  - Use built-in Image and Font optimization.
  - Prefer **Cache Components** (`cacheComponents` + `use cache`) over legacy caching patterns.
  - Use Suspense and loading states for async data.
  - Avoid large client bundles; keep most logic in Server Components.
- **Security:**
  - Sanitize all user input through Zod.
  - Use HTTPS in production.
  - Set secure HTTP headers.
  - Prefer server-side authorization for Server Actions and Route Handlers; never trust client input.

## 7. Caching & Revalidation (Next.js 16 Cache Components)

- **Prefer Cache Components for memoization/caching** in the App Router.
  - Enable in `next.config.*` via `cacheComponents: true`.
  - Use the **`use cache` directive** to opt a component/function into caching.
- **Use cache tagging and lifetimes intentionally:**
  - Use `cacheTag(...)` to associate cached results with tags.
  - Use `cacheLife(...)` to control cache lifetime (presets or configured profiles).
- **Revalidation guidance:**
  - Use `updateTag(...)` inside **Server Actions** when you need "read-your-writes" / immediate consistency.
  - Use `revalidateTag(tag)` for background stale-while-revalidate.
  - Use `revalidatePath()` for route-level invalidation.
- **Avoid `unstable_cache`** for new code; treat it as legacy and migrate toward Cache Components.

## 8. Tooling updates (Next.js 16)

- **Turbopack is the default dev bundler.** Configure via the top-level `turbopack` field in `next.config.*`.
- **Typed routes are stable** via `typedRoutes` (TypeScript required).
- **React Compiler** enabled for automatic memoization.

## 9. Avoid Unnecessary Example Files

Do not create example/demo files (like ModalExample.tsx) in the main codebase unless the user specifically requests a live example, Storybook story, or explicit documentation component. Keep the repository clean and production-focused by default.

## 10. Always Use the Latest Documentation and Guides

- For every Next.js related request, begin by searching for the most up-to-date Next.js documentation, guides, and examples.
- Use the following tools to fetch and search documentation if they are available:
  - `resolve_library_id` to resolve the package/library name in the docs.
  - `get_library_docs` for up-to-date documentation.
