---
description: UI validation rules for accessible and testable components
applyTo: "app/**/*.{tsx,ts}"
lastReviewed: 2026-04-14
---

# UI Validation

- Ensure forms have accessible labels and ARIA attributes where necessary.
- Add role-based queries in Playwright tests to avoid fragile selectors.
- Keep components small and testable; avoid large monolithic pages with intertwined logic.
