# react-plaid-link — React Hook & Component

Source: https://github.com/plaid/react-plaid-link

## Install

```bash
npm install --save react-plaid-link
# or
yarn add react-plaid-link
```

Compatibility: React 16.8–19.x.x

TypeScript definitions are **built into** the npm package (do not install `@types/react-plaid-link`).

---

## Preferred Approach: `usePlaidLink` Hook

```typescript
import { usePlaidLink } from 'react-plaid-link';

const { open, ready } = usePlaidLink({
  token: '<GENERATED_LINK_TOKEN>', // can be null initially
  onSuccess: (public_token, metadata) => {
    // send public_token to server
  },
});

return (
  <button onClick={() => open()} disabled={!ready}>
    Connect a bank account
  </button>
);
```

> **Note:** `token` can be `null` initially and then set once you fetch or generate a `link_token` asynchronously.

---

## `usePlaidLink` Arguments

| Key | Type | Description |
| --- | --- | --- |
| `token` | `string \| null` | The `link_token` from your server |
| `onSuccess` | `(public_token: string, metadata: PlaidLinkOnSuccessMetadata) => void` | Called when user completes Link |
| `onExit` | `(error: null \| PlaidLinkError, metadata: PlaidLinkOnExitMetadata) => void` | Called when user exits Link |
| `onEvent` | `(eventName: PlaidLinkStableEvent \| string, metadata: PlaidLinkOnEventMetadata) => void` | Called on Link events |
| `onLoad` | `() => void` | Called when Link loads |
| `receivedRedirectUri` | `string \| null \| undefined` | For OAuth redirect handling |

---

## `usePlaidLink` Return Value

| Key | Type | Description |
| --- | --- | --- |
| `open` | `() => void` | Opens the Link modal |
| `ready` | `boolean` | True when Link is ready to open |
| `submit` | `(data: PlaidHandlerSubmissionData) => void` | For hosted flow submission |
| `error` | `ErrorEvent \| null` | Any load error |
| `exit` | `(options?: { force: boolean }, callback?: () => void) => void` | Programmatically close Link |

---

## OAuth / Auto-opening Link

For OAuth redirects (or to open Link immediately on render without a button click):

```typescript
import { usePlaidLink } from 'react-plaid-link';

const { open, ready } = usePlaidLink(config);

// Open Link immediately when ready (no button click required)
React.useEffect(() => {
  if (ready) {
    open();
  }
}, [ready, open]);

return <></>;
```

---

## Async Token Fetch Pattern (Full Example)

```tsx
import React, { useEffect, useState, useCallback } from "react";
import { usePlaidLink, PlaidLinkOnSuccess } from "react-plaid-link";

export function PlaidLinkButton() {
  const [linkToken, setLinkToken] = useState<null | string>(null);

  useEffect(() => {
    // Fetch link_token from your server
    fetch("/api/create_link_token", { method: "POST" })
      .then(res => res.json())
      .then(data => setLinkToken(data.link_token));
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token, metadata) => {
      // Exchange public_token for access_token on your server
      fetch("/api/exchange_public_token", {
        body: JSON.stringify({ public_token }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
    },
    []
  );

  const { open, ready } = usePlaidLink({
    onSuccess,
    token: linkToken
  });

  return (
    <button onClick={() => open()} disabled={!ready || !linkToken}>
      Connect a bank account
    </button>
  );
}
```

---

## Legacy: `PlaidLink` Component (Class Component Support)

```tsx
import { PlaidLink } from "react-plaid-link";

class App extends React.Component {
  render() {
    return (
      <PlaidLink
        token={this.state.token}
        onSuccess={this.onSuccess}
        // onEvent={...}
        // onExit={...}
      >
        Link your bank account
      </PlaidLink>
    );
  }
}
```

---

## Examples

- [examples/simple.tsx](https://github.com/plaid/react-plaid-link/blob/master/examples/simple.tsx) — minimal hook usage
- [examples/hooks.tsx](https://github.com/plaid/react-plaid-link/blob/master/examples/hooks.tsx) — all available callbacks
- [examples/oauth.tsx](https://github.com/plaid/react-plaid-link/blob/master/examples/oauth.tsx) — OAuth handling
- [examples/component.tsx](https://github.com/plaid/react-plaid-link/blob/master/examples/component.tsx) — class component

Storybook demo: https://plaid.github.io/react-plaid-link

---

## TypeScript Types

All exported types are in `src/types/index.ts`:

- `PlaidLinkOnSuccess`
- `PlaidLinkOnSuccessMetadata`
- `PlaidLinkOnExit`
- `PlaidLinkOnExitMetadata`
- `PlaidLinkOnEvent`
- `PlaidLinkOnEventMetadata`
- `PlaidLinkStableEvent`
- `PlaidLinkError`
- `PlaidHandlerSubmissionData`
