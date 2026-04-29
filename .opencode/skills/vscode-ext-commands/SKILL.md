---
name: vscode-ext-commands
description: Guidelines for contributing commands in VS Code extensions (naming, visibility, localization, and conventions).
lastReviewed: 2026-04-29
applyTo: "**/*.ts"
platforms:
  - opencode
  - cursor
  - copilot
---

# VSCode Extension Commands - Banking Project Guidelines

## Overview

This skill provides comprehensive guidelines for creating and managing commands in VS Code extensions. It covers naming conventions, visibility rules, localization, and best practices for command implementation.

## Multi-Agent Commands

### OpenCode
```bash
# List available commands
grep -r "commands.registerCommand" --include="*.ts"

# Find command definitions
grep -r "when:" --include="package.json"
```

### Cursor
```
@vscode-ext-commands
Add a new command for the banking extension
```

### Copilot
```
/vscode command add dashboard view
```

## Command Naming Conventions

### Format
```
<category>.<action>
```

### Categories (Banking Extension)
- `banking.` - Core banking operations
- `wallet.` - Wallet management
- `transaction.` - Transaction operations
- `plaid.` - Plaid integration
- `dwolla.` - Dwolla integration
- `auth.` - Authentication
- `debug.` - Debug operations

### Examples
```typescript
// Good
commands.registerCommand('banking.connectWallet', async () => { ... });
commands.registerCommand('transaction.viewHistory', async () => { ... });
commands.registerCommand('plaid.refreshToken', async () => { ... });

// Bad
commands.registerCommand('connect', async () => { ... });
commands.registerCommand('doSomething', async () => { ... });
```

## Command Visibility

### When Conditions

```json
{
  "when": "view == explorer"
}
```

### Common Conditions
- `view` - Active view (explorer, debug, scm, etc.)
- `resourceScheme` - File scheme (file, untitled, etc.)
- `editorFocus` - Editor focus state
- `terminalFocus` - Terminal focus state
- `config` - Configuration state

### Banking-Specific Conditions

```json
{
  "when": "banking.connected == true"
}
```

## Command Registration

### Simple Command

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'banking.connectWallet',
      async (item?: vscode.TreeItem) => {
        const walletId = item?.id || await promptForWalletId();
        await connectWallet(walletId);
      }
    )
  );
}
```

### Command with Context Menu

```typescript
vscode.commands.registerCommand(
  'wallet.viewTransactions',
  async (node: WalletNode) => {
    await vscode.window.showQuickPick(
      ['Last 7 days', 'Last 30 days', 'Last 90 days'],
      { placeHolder: 'Select time range' }
    );
  }
);
```

## Command Palette Configuration

### Properties

```json
{
  "contributes": {
    "commands": [
      {
        "command": "banking.connectWallet",
        "title": "Banking: Connect Wallet",
        "category": "Banking",
        "shortcut": "Ctrl+Shift+W"
      }
    ]
  }
}
```

### Title Formatting
- Use title case for display
- Include category prefix
- Keep under 50 characters

## Localization

### Key Structure

```json
{
  "command.banking.connectWallet": "Connect Wallet",
  "command.banking.disconnectWallet": "Disconnect Wallet"
}
```

### Implementation

```typescript
import { localize } from '@vscode/l10n';

export async function connectWallet() {
  const message = localize('connectWallet.message', 'Connecting wallet...');
  vscode.window.showInformationMessage(message);
}
```

## Best Practices

### 1. Always Dispose Commands

```typescript
export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(
    'banking.connectWallet',
    handler
  );
  context.subscriptions.push(command); // Auto-dispose on deactivate
}
```

### 2. Handle Errors Gracefully

```typescript
vscode.commands.registerCommand(
  'banking.connectWallet',
  async () => {
    try {
      await connectWallet();
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to connect: ${error.message}`
      );
    }
  }
);
```

### 3. Use Progress for Long Operations

```typescript
vscode.commands.registerCommand(
  'banking.syncTransactions',
  async () => {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Syncing transactions'
      },
      async (progress) => {
        progress.report({ increment: 0 });
        await syncTransactions();
        progress.report({ increment: 100 });
      }
    );
  }
);
```

### 4. Validate Before Execution

```typescript
vscode.commands.registerCommand(
  'banking.transfer',
  async (amount: number) => {
    if (amount <= 0) {
      vscode.window.showErrorMessage('Amount must be positive');
      return;
    }
    if (amount > MAX_TRANSFER_LIMIT) {
      vscode.window.showErrorMessage(
        `Amount exceeds limit of ${MAX_TRANSFER_LIMIT}`
      );
      return;
    }
    await performTransfer(amount);
  }
);
```

## Testing Commands

### Unit Test

```typescript
import * as vscode from 'vscode';
import { describe, it, beforeEach, afterEach } from 'mocha';

suite('Banking Commands', () => {
  let sandbox: vscode.Sandbox;

  beforeEach(() => {
    sandbox = new vscode.Sandbox();
  });

  it('should connect wallet', async () => {
    const result = await sandbox.executeCommand(
      'banking.connectWallet',
      'test-wallet-id'
    );
    assert.ok(result);
  });
});
```

### Integration Test

```typescript
it('should show transaction history', async () => {
  await vscode.commands.executeCommand('wallet.viewTransactions');
  const doc = await vscode.workspace.openTextDocument();
  assert.ok(doc.getText().includes('Transactions'));
});
```

## Troubleshooting

### Command Not Found

**Problem**: `Command not found: banking.connectWallet`
**Solutions**:
1. Check package.json commands section
2. Verify activation events include command
3. Run `Developer: Reload Window`

### Command Not Visible

**Problem**: Command doesn't appear in Command Palette
**Solutions**:
1. Check when conditions in package.json
2. Verify category matches filter
3. Check keybindings don't conflict

### Command Execution Fails

**Problem**: Command throws error on execution
**Solutions**:
1. Check console for error details
2. Verify required dependencies installed
3. Test with minimal implementation first

## Cross-References

- **create-skill**: For creating new extension skills
- **vscode-ext-localization**: For localization patterns
- **testing-skill**: For testing patterns
- **agent-governance**: For command governance

## Validation Commands

```bash
# Check command registration
grep -r "registerCommand" src/ --include="*.ts"

# Validate package.json
npx vsce package --dry-run
```

## Performance Tips

1. Use `when` conditions to limit command availability
2. Lazy load command handlers
3. Cache command state when possible
4. Use tree views for complex command hierarchies