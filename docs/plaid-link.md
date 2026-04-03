# Plaid Link — Overview

Source: https://plaid.com/docs/link/

## Introduction

Plaid Link is the client-side component users interact with to link their bank accounts to Plaid. It is **mandatory** for all Plaid integrations except products that require no end-user interaction (e.g. Enrich, Identity Verification backend-only flow).

Link handles credential validation, MFA, error handling, and account-linking confirmation emails. For OAuth institutions, Link manages the full OAuth handoff.

Demo: https://plaid.com/demo/

---

## Supported Platforms

| Use Case | Method |
| --- | --- |
| Best mobile UX | Native iOS, Android, or React Native SDKs |
| Best web UX | Native web SDK (React wrapper available) |
| Webviews, iFrames, no frontend | Hosted Link |

Optional presentation modes:

- **Embedded Institution Search** — shows search screen embedded in your UI before user interacts with Link; increases pay-by-bank uptake
- **Multi-Item Link** — link multiple banks in a single session

---

## Token Flow

1. **Create `link_token`**: Call `/link/token/create` server-side → pass token to client
2. **Open Link**: Use `link_token` to initialize Link → `onSuccess` callback returns `public_token`
3. **Exchange token**: Call `/item/public_token/exchange` → get permanent `access_token` + `item_id`
4. **Store & use `access_token`**: Use for all subsequent Plaid API calls for that Item

> Some products (Plaid Check, Identity Verification, Monitor, Document Income, Payroll Income) do **not** use `public_token`/`access_token` — see product-specific docs.

---

## Initializing Link

Pass the `link_token` to Link. Implementation varies by platform. See:

- [Web](https://plaid.com/docs/link/web/)
- [iOS](https://plaid.com/docs/link/ios/)
- [Android](https://plaid.com/docs/link/android/)
- [React Native](https://plaid.com/docs/link/react-native/)
- [Hosted Link](https://plaid.com/docs/link/hosted-link/)

---

## Error Handling Flows

- **Update mode**: Required if your app accesses an Item on a recurring basis. Handles re-authentication after password or MFA changes. See [Update mode](https://plaid.com/docs/link/update-mode/).
- **Duplicate Items**: Requesting access tokens for duplicate Items causes higher bills and end-user confusion. See [Preventing duplicate Items](https://plaid.com/docs/link/duplicate-items/).
- **Invalid Link token**: Link expires after 30 minutes of inactivity. See [Handling invalid Link tokens](https://plaid.com/docs/link/handle-invalid-link-token/).

---

## OAuth Support

Many institutions use OAuth, redirecting users to their bank's website or app. See [OAuth guide](https://plaid.com/docs/link/oauth/).

---

## Returning User Flow

Enables faster Link experience for users who already use Plaid. See [Returning user experience](https://plaid.com/docs/link/returning-user/).

---

## Customization

- Customize Link flow from the [Dashboard](https://dashboard.plaid.com/link) with real-time preview
- [Link best practices guide](https://plaid.com/docs/link/best-practices/)
- [In-app messaging guide](https://plaid.com/docs/link/messaging/)
- [Full customization docs](https://plaid.com/docs/link/customization/)

---

## Bypassing Link in Sandbox

Use `/sandbox/public_token/create` to bypass Link in Sandbox for testing.

---

## Additional Link Modes

| Mode | Purpose |
| --- | --- |
| [Embedded Link](https://plaid.com/docs/link/embedded-institution-search/) | Show institution search embedded in your UI |
| [Multi-Item Link](https://plaid.com/docs/link/multi-item-link/) | Link multiple banks in one session |
| [Link Recovery (beta)](https://plaid.com/docs/link/link-recovery/) | Recovery flow |
| [Update mode](https://plaid.com/docs/link/update-mode/) | Re-authenticate expired Items |
