# Custom Components — Inventory & Guidelines

Purpose

- Capture conventions for custom components that are referenced directly by pages (excluding the component library under ./components/ui).

Guidelines

- Structure: prefer presentational components to be pure (props-only) and free of fetching logic. If a component mixes fetching + rendering, extract the presentational part into components/layouts.
- Tests: add unit tests for presentational components. Keep DOM interaction minimal and avoid heavy E2E testing for presentational-only pieces.
- Naming: components under components/layouts should be kebab-cased folders with an index.tsx exporting the primary component.

Example

- components/layouts/total-balance/
  - index.tsx
  - total-balance.test.tsx

Inventory

- This document is a living inventory. Use the per-page audits (stored in the plan's artifacts) to update this file with discovered custom components and their intended reuse.
