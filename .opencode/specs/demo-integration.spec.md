# Spec: Demo Content Integration

**Scope:** Feature spec — replacing placeholder/demo content with banking-appropriate content  
**Plan:** `integrate-demo-and-fix-auth.plan.md`  
**Status:** Defines requirements; implementation follows this spec

---

## Overview

The application contains three categories of demo/placeholder content inherited from shadcn-studio template blocks:

1. **Bistro restaurant content** — landing page testimonials with food imagery
2. **Logistics/shipping admin data** — admin dashboard fallback statistics
3. **Hardcoded identity data** — "John Doe" profile dropdown, `@shadcnstudio.com` email addresses

All must be replaced with banking-appropriate content before the app goes to production.

---

## 1. Landing Page Testimonials

### Current State

`components/home/home-server-wrapper.tsx` exports `sampleMenudata` — an array of 3 objects with:

- `image` — restaurant plate photos from `cdn.shadcnstudio.com/ss-assets/bistro/`
- `comment` — restaurant dining testimonials ("The ambiance is perfect and the food is absolutely delicious.")
- `avatar` — CDN-hosted avatar images

### Requirements

- Replace with 3 banking-themed customer testimonials
- Use local avatar images (no external CDN dependencies in production)
- Avatar images must be stored in `public/avatars/`
- Testimonials must reference banking use cases: transfers, account linking, balance visibility
- Reviewer names should be generic but realistic (not "John Doe")
- No company names, brand names, or email addresses in testimonials

### Acceptance Criteria

- [ ] `sampleMenudata` renamed to `testimonials` (or equivalent)
- [ ] Zero `cdn.shadcnstudio.com` URLs remain in the file
- [ ] Three local avatar images exist at `public/avatars/avatar-{1,2,3}.png` (or `.svg`)
- [ ] Testimonial text references banking (transfers, wallets, accounts, savings)
- [ ] Component renders without errors in production build

---

## 2. Admin Dashboard Fallback Data

### Current State

`components/admin/admin-data.tsx` contains:

**`statisticsCardData`** — 4 cards:

- "Shipped Orders" (Package icon)
- "Damaged Returns" (PackageX icon)
- "Missed Delivery Slots" (PackageOpen icon)
- "Total Income" (DollarSign icon) ← this one is acceptable

**`earningData`** — 5 rows with fake platform names, CDN avatars, and dollar amounts:

- Zipcar, Bitbank, Figma, Shopify, Framer

**`transactionData`** — 25 fake transactions with:

- `@shadcnstudio.com` email addresses
- `cdn.shadcnstudio.com` avatar URLs
- Hardcoded US dollar amounts

### Requirements

#### `statisticsCardData`

Replace with banking-relevant metrics:

| Title | Icon | Description |
| --- | --- | --- |
| Total Transfers | `ArrowLeftRight` | All-time completed transfers |
| Active Wallets | `Wallet` | Currently linked bank accounts |
| Linked Accounts | `Link` | Plaid-connected institutions |
| Pending Transactions | `Clock` | Transactions awaiting settlement |

Note: Values shown in fallback state should be `0` or `"—"` with a note that live data loads from the database.

#### `earningData`

Replace with 5 fictional banking/fintech platform entries:

| Platform | Type | Use Local Avatar |
| --- | --- | --- |
| NovaPay | Direct Deposit | `/avatars/platform-novapay.svg` |
| ClearBank | Savings Transfer | `/avatars/platform-clearbank.svg` |
| TrustVault | Investment Account | `/avatars/platform-trustvault.svg` |
| SwiftLend | Loan Payment | `/avatars/platform-swiftlend.svg` |
| PeakCredit | Credit Card | `/avatars/platform-peakcredit.svg` |

All amounts remain as fictional USD values (no real data needed here).

#### `transactionData`

Replace all 25 entries with 10 banking-realistic entries:

- Use `@example.com` email addresses
- Names from seed user domain (e.g., `"Alex R."`, `"Jordan M."`)
- Use local avatar images (initials-based SVGs acceptable)
- Transaction types: "Transfer", "Deposit", "Withdrawal", "Payment"
- Amounts: realistic banking amounts ($10–$5,000 range)
- Zero `cdn.shadcnstudio.com` or `@shadcnstudio.com` references

### Acceptance Criteria

- [ ] `statisticsCardData` titles all reference banking/fintech concepts
- [ ] `earningData` has no external CDN avatar URLs
- [ ] `transactionData` has zero `@shadcnstudio.com` addresses
- [ ] `transactionData` has zero `cdn.shadcnstudio.com` avatar URLs
- [ ] All local avatar assets referenced in this file exist in `public/avatars/`

---

## 3. Profile Dropdown Identity

### Current State

`components/shadcn-studio/blocks/dropdown-profile.tsx` hardcodes:

```tsx
<AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" alt="John Doe" />
<span>John Doe</span>
<span>john.doe@example.com</span>
```

### Requirements

- Component must accept `name`, `email`, and optional `avatarUrl` as props
- Parent layout components must pass live session data
- Fallback avatar: initials-based display using first letter of `name`
- No hardcoded identity strings remain in the component
- CDN avatar URL removed

### Prop Interface

```typescript
interface DropdownProfileProps {
  name: string;
  email: string;
  avatarUrl?: string; // optional; falls back to initials
}
```

### Where Session Data Comes From

- `(root)` layout: `RootLayoutWrapper` already calls `auth()` — pass `session.user.name` and `session.user.email`
- `(admin)` layout: `AdminLayoutWrapper` already calls `auth()` — same pattern

### Acceptance Criteria

- [ ] `DropdownProfileProps` interface defined with `name`, `email`, `avatarUrl?`
- [ ] No hardcoded `"John Doe"` string in component
- [ ] No hardcoded `"john.doe@example.com"` string in component
- [ ] No `cdn.shadcnstudio.com` URL in component
- [ ] Component renders correctly when `avatarUrl` is `undefined`
- [ ] Both `RootLayoutWrapper` and `AdminLayoutWrapper` pass live session props

---

## 4. Demo Pages Visibility

### Current State

8 pages exist under `app/demo/**` with no auth protection:

- `application-shell-01`, `dashboard-shell-01`, `hero-section-41`
- `onboarding-feed-01`, `pricing-01`, `settings-profile-01`
- `sidebar-07`, `table-advanced-01`

### Requirements

Choose one approach (decision deferred to implementer):

**Option A — Remove entirely** (recommended if not needed for development)  
Delete `app/demo/` directory and all contents.

**Option B — Gate behind env flag**  
In `app/demo/layout.tsx`, check `process.env.ENABLE_DEMO_PAGES` and return 404 if not set.

**Option C — Move to admin route group**  
Move to `app/(admin)/demo/` — inherits admin auth from `AdminLayoutWrapper`.

### Acceptance Criteria

- [ ] Demo pages are NOT accessible without authentication (if Option B or C)  
       OR
- [ ] Demo pages directory does not exist (if Option A)
- [ ] No `app/demo/**` route returns 200 to unauthenticated requests in production

---

## Asset Inventory Required

Before implementation, create these local assets in `public/avatars/`:

| File                       | Usage                      |
| -------------------------- | -------------------------- |
| `avatar-1.png` (or `.svg`) | Landing page testimonial 1 |
| `avatar-2.png` (or `.svg`) | Landing page testimonial 2 |
| `avatar-3.png` (or `.svg`) | Landing page testimonial 3 |
| `platform-novapay.svg`     | Admin earning data         |
| `platform-clearbank.svg`   | Admin earning data         |
| `platform-trustvault.svg`  | Admin earning data         |
| `platform-swiftlend.svg`   | Admin earning data         |
| `platform-peakcredit.svg`  | Admin earning data         |

Simple initials-based SVGs are acceptable. No external image downloads required.
