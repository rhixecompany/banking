---
name: vscode-ext-localization
description: Guidelines for proper localization of VS Code extensions following VS Code extension development guidelines and best practices.
lastReviewed: 2026-04-29
applyTo: "**/*.ts"
platforms:
  - opencode
  - cursor
  - copilot
---

# VSCode Extension Localization - Banking Project Guidelines

## Overview

This skill provides comprehensive guidelines for implementing localization in VS Code extensions. It covers the l10n framework, translation management, locale files, and best practices for internationalization.

## Multi-Agent Commands

### OpenCode

```bash
# Extract strings for translation
npx vscode-l10n-extract

# Generate bundle
npx vscode-l10n-run bundle

# Check locale files
ls -la out/nls/
```

### Cursor

```
@vscode-ext-localization
Add Japanese localization to the banking extension
```

### Copilot

```
/localize add command labels
```

## Localization Architecture

### File Structure

```
out/
  nls/
    bundle.l10n.json        # Default locale
    ja/
      bundle.l10n.json      # Japanese
    es/
      bundle.l10n.json      # Spanish
    de/
      bundle.l10n.json      # German
src/
  main.ts                   # Entry point
  nls.metadata.json         # String metadata
```

### Package.json Configuration

```json
{
  "contributes": {
    "localizations": [
      {
        "languageId": "en",
        "languageName": "English",
        "translations": "./out/nls/bundle.l10n.json"
      },
      {
        "languageId": "ja",
        "languageName": "Japanese",
        "translations": "./out/nls/ja/bundle.l10n.json"
      }
    ]
  },
  "l10n": "./out/nls.metadata.json"
}
```

## String Extraction

### Inline Strings

```typescript
import { localize } from "@vscode/l10n";

// Simple string
const message = localize("connectWallet", "Connecting wallet...");

// With plural
const count = localize(
  "transactionCount",
  "{0} transaction found",
  "{0} transactions found",
  transactions.length
);

// With arguments
const amount = localize(
  "transferAmount",
  "Transferring {0} to {1}",
  amount.toFixed(2),
  recipientName
);
```

### JSON Bundle Format

```json
{
  "connectWallet": "Connecting wallet...",
  "disconnectWallet": "Disconnecting wallet...",
  "transactionCount": {
    "message": "{0} transaction found",
    "comment": "Singular form"
  },
  "transferAmount": "Transferring {0} to {1}"
}
```

## Localization API

### Basic Usage

```typescript
import { localize, getLocalization } from "@vscode/l10n";

// Get current locale
const locale = getLocalization();

// Simple localization
const msg = localize("key", "Default message");

// With substitutions
const msg = localize(
  "balance",
  "Your balance is {0}",
  balance.toFixed(2)
);
```

### Dynamic Locale Loading

```typescript
import { loadMessageBundle } from "@vscode/l10n";

async function loadCustomLocale(locale: string) {
  const bundle = await loadMessageBundle(
    `./locales/${locale}/bundle.l10n.json`
  );
  return bundle;
}
```

## Banking-Specific Strings

### Categories

```typescript
// Wallet operations
const WALLET_STRINGS = {
  connect: localize("wallet.connect", "Connect Wallet"),
  disconnect: localize("wallet.disconnect", "Disconnect Wallet"),
  sync: localize("wallet.sync", "Sync Wallet"),
  viewBalance: localize("wallet.viewBalance", "View Balance")
};

// Transaction operations
const TRANSACTION_STRINGS = {
  transfer: localize("transaction.transfer", "Transfer"),
  viewHistory: localize("transaction.viewHistory", "View History"),
  export: localize("transaction.export", "Export"),
  filter: localize("transaction.filter", "Filter")
};

// Error messages
const ERROR_STRINGS = {
  connectionFailed: localize("error.connection", "Connection failed"),
  insufficientFunds: localize("error.funds", "Insufficient funds"),
  invalidAccount: localize("error.account", "Invalid account"),
  networkError: localize("error.network", "Network error")
};
```

### Implementation

```typescript
export class WalletService {
  async connect(accessToken: string): Promise<void> {
    try {
      await this.plaidClient.linkToken(accessToken);
      vscode.window.showInformationMessage(WALLET_STRINGS.connect);
    } catch (error) {
      vscode.window.showErrorMessage(ERROR_STRINGS.connectionFailed);
    }
  }
}
```

## Plural Handling

### Simple Plurals

```typescript
// English: 1 = singular, other = plural
const message = localize(
  "transactionCount",
  "{0} transaction",
  "{0} transactions",
  count
);
```

### Complex Plurals

```typescript
// For languages with multiple plural forms
const message = localize(
  "balanceUpdate",
  "{0} new transaction",
  "{0} new transactions",
  count
);
```

## Placeholder Formatting

### Number Formatting

```typescript
// Currency
const amount = localize(
  "amount",
  "Amount: {0}",
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD"
  }).format(value)
);

// Percentage
const percent = localize(
  "fee",
  "Fee: {0}%",
  (feeRate * 100).toFixed(2)
);
```

### Date Formatting

```typescript
const date = localize(
  "lastSync",
  "Last synced: {0}",
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(lastSyncDate)
);
```

## Testing Localization

### Unit Test

```typescript
import { localize } from "@vscode/l10n";
import * as assert from "assert";

suite("Localization", () => {
  it("should return default for missing key", () => {
    const result = localize("missing", "Default");
    assert.strictEqual(result, "Default");
  });

  it("should substitute arguments", () => {
    const result = localize("amount", "Amount: {0}", "100.00");
    assert.strictEqual(result, "Amount: 100.00");
  });
});
```

### Integration Test

```typescript
it("should display localized message", async () => {
  await vscode.commands.executeCommand("wallet.connect");
  const message = await vscode.window.showInformationMessage();
  assert.ok(message);
});
```

## Troubleshooting

### Missing Translations

**Problem**: Translation key shows instead of value **Solutions**:

1. Check bundle.l10n.json exists
2. Verify key matches exactly
3. Run extraction command
4. Check file encoding (UTF-8)

### Locale Not Loading

**Problem**: Wrong locale displayed **Solutions**:

1. Check VS Code locale setting
2. Verify localization files exist
3. Check package.json localization config
4. Restart extension host

### Placeholder Not Replaced

**Problem**: `{0}` shows in output **Solutions**:

1. Check argument count matches placeholders
2. Verify arguments are strings
3. Use correct placeholder format

## Best Practices

### 1. Use Meaningful Keys

```typescript
// Good
localize("wallet.connect.success", "Wallet connected successfully");

// Bad
localize("msg1", "Wallet connected");
```

### 2. Add Comments for Translators

```typescript
localize(
  "transfer.pending",
  "Transfer pending",
  "Status shown when transfer is being processed"
);
```

### 3. Group Related Strings

```typescript
// Use prefixes
"wallet.connect"; // Connect action
"wallet.disconnect"; // Disconnect action
"wallet.sync"; // Sync action

"wallet.error.connect"; // Connect error
"wallet.error.timeout"; // Timeout error
```

### 4. Test All Locales

```typescript
// Test each locale
for (const locale of ["en", "ja", "es", "de"]) {
  await setLocale(locale);
  await testCommand("wallet.connect");
}
```

## Cross-References

- **vscode-ext-commands**: For command naming
- **create-skill**: For extension creation
- **agent-governance**: For localization governance
- **testing-skill**: For testing patterns

## Validation Commands

```bash
# Extract strings
npx vscode-l10n-extract src/ --output out/nls/

# Validate bundle
npx vscode-l10n-validate out/nls/bundle.l10n.json

# Check missing keys
npx vscode-l10n-check --source src/ --bundle out/nls/bundle.l10n.json
```

## Performance Tips

1. Cache loaded bundles
2. Use lazy loading for non-default locales
3. Minimize bundle size with tree-shaking
4. Preload common strings
