# Spec: settings-content-tests

Scope: repo

# Coverage: Settings content components (shadcn-studio block)

## Current State

Location: `components/shadcn-studio/blocks/account-settings-01/content/`

- danger-zone.tsx at 66.66% Lines
- social-url.tsx at 22.22% Lines
- connect-account.tsx (coverage unknown, needs analysis)

## Target Coverage: 60%+ each

## Components to Cover (actual files, NOT account-settings t-wrapper.tsx)

### 1. danger-zone.tsx (94 lines)

- `"use client"` component
- Exports: `DangerZone` (default)
- Render: Card + Dialog confirm for account deletion
- Action: Delete button not yet wired (placeholder)
- Tests needed: render, dialog open/close, delete button click

### 2. social-url.tsx (58 lines)

- `"use client"` component
- Exports: `SocialUrl` (default)
- Render: Dynamic list of URL inputs with local useState
- Action: Save button not yet wired
- Tests needed: render, add/remove URL inputs, save button interaction

### 3. connect-account.tsx

- `"use client"` component (exact content TBD from codebase)
- Likely related to bank account linking or wallet connection
- Tests needed: render, connection flow, error handling

## Test Pattern

- Use @testing-library/react for component rendering
- Test render paths (initial state)
- Test user interactions: button clicks, input changes, dialog open/close
- Mock any server actions or API calls
- Test with Vitest (unit tests, not E2E)

## Notes

- These are UI block preview components in shadcn-studio showcase area
- Not part of main app settings flow (those have separate coverage)
- Focus on component behavior, not business logic
- Each component should reach 60% coverage independently
