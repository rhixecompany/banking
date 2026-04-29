---
name: mcp-cli
description: CLI interface for interacting with MCP (Model Context Protocol) servers and their tools.
lastReviewed: 2026-04-29
applyTo: "**/*.ts"
platforms:
  - opencode
  - cursor
  - copilot
---

# MCP CLI - Model Context Protocol

## Overview

This skill provides comprehensive guidelines for working with MCP (Model Context Protocol) servers and their CLI tools. It covers server management, tool invocation, and best practices.

## Multi-Agent Commands

### OpenCode
```bash
# List available MCP servers
mcp list

# Start a server
mcp start <server-name>

# Invoke a tool
mcp invoke <server>.<tool> <args>
```

### Cursor
```
@mcp-cli
Connect to the banking MCP server
```

### Copilot
```
/mcp servers list
```

## MCP Architecture

### Components

1. **MCP Server**: Exposes tools via protocol
2. **MCP Client**: Consumes tools from servers
3. **MCP Protocol**: JSON-RPC based communication

### Server Types

```typescript
// Local server
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"]
    }
  }
}

// HTTP server
{
  "mcpServers": {
    "api": {
      "url": "https://api.example.com/mcp"
    }
  }
}

// STDIO server
{
  "mcpServers": {
    "local-tool": {
      "command": "./local-server",
      "args": ["--stdio"]
    }
  }
}
```

## Server Management

### Starting Servers

```bash
# Start from config
mcp start

# Start specific server
mcp start <server-name>

# Start with options
mcp start <server-name> --port 8080 --debug
```

### Server Configuration

```json
{
  "mcpServers": {
    "banking-api": {
      "command": "bun",
      "args": ["run", "scripts/mcp-runner.ts"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "nextjs": {
      "command": "bunx",
      "args": ["-y", "@modelcontextprotocol/server-nextjs"],
      "url": "http://localhost:3000/_next/mcp"
    }
  }
}
```

### Server Lifecycle

```bash
# List running servers
mcp list

# Stop server
mcp stop <server-name>

# Restart server
mcp restart <server-name>

# View server logs
mcp logs <server-name>
```

## Tool Invocation

### Listing Tools

```bash
# List all available tools
mcp tools

# List tools from specific server
mcp tools <server-name>

# Show tool details
mcp show <server>.<tool-name>
```

### Calling Tools

```bash
# Simple call
mcp invoke banking.getUser --user-id 123

# With arguments
mcp invoke wallet.create --user-id 123 --amount 100.00

# With options
mcp invoke transaction.list --user-id 123 --limit 10 --offset 0
```

### Tool Response Format

```json
{
  "success": true,
  "result": {
    "data": [...]
  },
  "error": null
}
```

## Banking MCP Tools

### User Tools

```bash
# Get user
mcp invoke banking.getUser --user-id <id>

# List users
mcp invoke banking.listUsers --page 1 --limit 20

# Create user
mcp invoke banking.createUser --email "user@example.com" --name "John"
```

### Wallet Tools

```bash
# Get wallets
mcp invoke wallet.list --user-id <id>

# Connect wallet
mcp invoke wallet.connect --user-id <id> --public-token <token>

# Get balance
mcp invoke wallet.balance --wallet-id <id>
```

### Transaction Tools

```bash
# List transactions
mcp invoke transaction.list --wallet-id <id> --limit 20

# Get transaction
mcp invoke transaction.get --transaction-id <id>

# Create transfer
mcp invoke transaction.transfer --from <wallet-id> --to <wallet-id> --amount 100.00
```

## Error Handling

### Common Errors

```json
{
  "error": {
    "code": "TOOL_NOT_FOUND",
    "message": "Tool 'banking.getUser' not found",
    "data": {
      "server": "banking-api",
      "tool": "getUser"
    }
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `TOOL_NOT_FOUND` | Tool doesn't exist |
| `INVALID_PARAMS` | Wrong parameters |
| `SERVER_ERROR` | Server threw error |
| `TIMEOUT` | Request timed out |
| `AUTH_REQUIRED` | Authentication needed |

### Handling Errors

```typescript
try {
  const result = await mcp.invoke('banking.getUser', { id: '123' });
  if (!result.success) {
    console.error('Error:', result.error.message);
    return;
  }
  console.log('User:', result.result);
} catch (error) {
  console.error('Network error:', error);
}
```

## Configuration

### Global Config

```json
{
  "servers": {
    "banking-api": {
      "command": "bun",
      "args": ["run", "scripts/mcp-runner.ts"]
    }
  },
  "defaults": {
    "timeout": 30000,
    "retries": 3
  }
}
```

### Per-Server Config

```json
{
  "servers": {
    "banking-api": {
      "command": "bun",
      "args": ["run", "scripts/mcp-runner.ts"],
      "env": {
        "NODE_ENV": "production"
      },
      "timeout": 60000
    }
  }
}
```

## Best Practices

### 1. Use Typed Tools

```typescript
interface BankingTool {
  invoke<T>(tool: string, params: T): Promise<BankingResult<T>>;
}
```

### 2. Handle Timeouts

```typescript
const result = await mcp.invoke('banking.getUser', { id: '123' }, {
  timeout: 5000,
  retries: 3
});
```

### 3. Cache Results

```typescript
const cache = new Map();

async function getUser(id: string) {
  const key = `user:${id}`;
  if (cache.has(key)) return cache.get(key);

  const result = await mcp.invoke('banking.getUser', { id });
  cache.set(key, result);
  return result;
}
```

### 4. Validate Input

```typescript
function validateParams(params: unknown): params is UserParams {
  return (
    typeof params === 'object' &&
    params !== null &&
    'id' in params &&
    typeof (params as any).id === 'string'
  );
}
```

## Testing MCP Tools

### Unit Test

```typescript
import { describe, it, expect, vi } from 'vitest';

vi.mock('mcp', () => ({
  invoke: vi.fn().mockResolvedValue({
    success: true,
    result: { id: '123', name: 'Test' }
  })
}));

describe('Banking MCP', () => {
  it('should get user', async () => {
    const user = await getUser('123');
    expect(user.name).toBe('Test');
  });
});
```

### Integration Test

```typescript
it('should list transactions', async () => {
  const result = await mcp.invoke('transaction.list', {
    walletId: 'wallet-123',
    limit: 10
  });

  expect(result.success).toBe(true);
  expect(result.result).toHaveLength(10);
});
```

## Troubleshooting

### Server Not Starting

**Problem**: Server fails to start
**Solutions**:
1. Check command and args
2. Verify dependencies installed
3. Check port availability
4. View logs: `mcp logs <server>`

### Tool Not Found

**Problem**: `Tool not found` error
**Solutions**:
1. List available tools: `mcp tools`
2. Check server is running
3. Verify tool name format (server.tool)

### Timeout Errors

**Problem**: Request times out
**Solutions**:
1. Increase timeout in config
2. Check server performance
3. Reduce request size

## Cross-References

- **server-action-skill**: For server-side patterns
- **nextjs-page-refactor**: For Next.js integration
- **testing-skill**: For testing patterns

## Validation Commands

```bash
# List all servers
mcp list

# List all tools
mcp tools

# Test connection
mcp ping <server-name>

# View logs
mcp logs <server-name> --follow
```

## Performance Tips

1. Use connection pooling
2. Implement request batching
3. Cache frequently accessed data
4. Use streaming for large responses