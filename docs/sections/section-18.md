# Section 18 — PLAID & External Integrations

- Centralize third-party embeds to avoid duplicate initialization and keep integration code in a single provider.
- Keep secrets in environment variables and do not leak them to client bundles.

Example provider:

```tsx
"use client";
import Script from "next/script";
export function PlaidProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js" />
      {children}
    </>
  );
}
```
