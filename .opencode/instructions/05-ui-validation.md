---
description: UI validation rules for accessible and testable components
applyTo: "app/**/*.{tsx,ts}"
priority: high
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# UI Validation

- Ensure to always use shadcn components located at `./components/ui/*`.
- Ensure forms have accessible labels and ARIA attributes where necessary.
- Add role-based queries in Playwright tests to avoid fragile selectors.
- Keep components small and testable; avoid large monolithic pages with intertwined logic.
