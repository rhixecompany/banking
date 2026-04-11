# Plaid Script Embed Audit

This document lists every component and file found that interacts with Plaid or initializes Plaid Link, and provides a recommended fix to avoid the duplicate "link-initialize.js script embedded more than once" warning.

## Files interacting with Plaid

- components/plaid-context/plaid-context.tsx — PlaidProvider uses usePlaidLink and fetches link tokens; does not include the external script directly.
- components/plaid-link/plaid-link.tsx — Local Plaid button that uses usePlaidSafe hook and falls back to local usePlaidLink initialization when no provider exists.
- components/plaid-link-button/plaid-link-button.tsx — Small wrapper that uses usePlaid from context.
- app/(root)/layout.tsx — Uses PlaidProvider at the top of the protected banking layout: <PlaidProvider userId={user.id}> which means Plaid initialization runs on any protected page.
- scripts/seed/create-plaid-tokens.ts — seed helper that uses Plaid APIs (server-side)

## Root cause

The repository uses react-plaid-link's usePlaidLink hook in both a PlaidProvider (components/plaid-context/plaid-context.tsx) and in a fallback local button (components/plaid-link/plaid-link.tsx). If a component that initializes Plaid is rendered and another local component also initializes (without being wrapped by the provider), react-plaid-link may inject the Plaid script multiple times.

## Recommended fix (docs only)

1. Ensure the external Plaid script is added exactly once when the Plaid feature is used. Add a lightweight PlaidScriptLoader placed at the top-level layout that uses PlaidProvider.

Example (docs-only suggestion):

```tsx
"use client";
import Script from "next/script";
export function PlaidScriptLoader() {
  return (
    <Script
      src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
      strategy="afterInteractive"
      id="plaid-link-script"
    />
  );
}
```

2. Update PlaidProvider to include PlaidScriptLoader or to ensure the script is loaded once via Script tag. Since app/(root)/layout.tsx already wraps pages with PlaidProvider, adding the Script tag inside PlaidProvider ensures single inclusion.

3. Keep LocalPlaidButton (fallback) but ensure it relies on usePlaidSafe() to detect provider presence. If provider exists, the local button should not call usePlaidLink or otherwise initialize Plaid.

4. Optionally, add a runtime guard in PlaidScriptLoader to check for window.\_\_PLAID_SCRIPT_LOADED to avoid double injection when Script is not used (defensive for SSR edges).

## Files to modify (docs recommendation)

- components/plaid-context/plaid-context.tsx — add Script loader or import PlaidScriptLoader
- components/plaid-link/plaid-link.tsx — already uses usePlaidSafe; ensure no code path calls usePlaidLink when provider exists (it currently guards this)
- app/(root)/layout.tsx — no change required if PlaidProvider includes the Script loader
