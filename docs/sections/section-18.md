# Section 18 — PLAID & External Integrations

- Centralize third-party script embeds (e.g., Plaid) to avoid duplicate initialization.
- Store secrets encrypted and use environment variables for runtime.

Example client provider scaffold:

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
