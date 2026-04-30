---
name: update-cli-config
description: View and modify Cursor CLI configuration settings in ~/.cursor/cli-config.json. Use when you want to change CLI settings, configure permissions, switch approval mode, enable vim mode, toggle display options, configure sandbox, or manage any CLI preferences.
lastReviewed: 2026-04-29
applyTo: "**/*"
platforms:
  - opencode
  - cursor
  - copilot
---

# Update CLI Config

Manage Cursor CLI configuration settings. This skill provides comprehensive guidance for modifying CLI preferences, permissions, and behavior across all AI agent platforms.

## When to Use This Skill

- Changing CLI settings in `~/.cursor/cli-config.json`
- Configuring approval mode for CLI commands
- Enabling or disabling vim mode
- Managing display options
- Configuring sandbox settings
- Setting up permissions for CLI operations

## Platform-Specific Considerations

### OpenCode

In OpenCode, the CLI config is managed through:

- Direct file editing of `~/.cursor/cli-config.json`
- Using the `update-cli-config` tool when available
- Environment variables for some settings

### Cursor

In Cursor IDE:

- Use the Settings UI for some options
- Direct config file editing for advanced settings
- Terminal for command-line configuration

### GitHub Copilot

In Copilot CLI:

- Settings managed via `copilot config` commands
- Environment variables for additional options
- Config file at `~/.copilot/config.json`

## 1. Locate Configuration File

Find the CLI configuration file:

```bash
# Find Cursor CLI config
ls -la ~/.cursor/cli-config.json

# Find Copilot CLI config
ls -la ~/.copilot/config.json

# View current config
cat ~/.cursor/cli-config.json
```

### OpenCode Tool Usage

```typescript
// Use read to inspect config
read({ filePath: "~/.cursor/cli-config.json" });

// Use glob to find config files
glob({ pattern: "~/.cursor/*.json" });
```

### Cursor Tool Usage

```typescript
// Use terminal to read config
await terminal.exec("cat ~/.cursor/cli-config.json");
```

## 2. Understand Configuration Structure

The CLI config typically contains:

```json
{
  "approvalMode": "prompt",
  "display": {
    "showTokens": true,
    "showTimestamps": true
  },
  "permissions": {
    "allowBash": true,
    "allowFileWrite": true,
    "allowFileRead": true
  },
  "sandbox": {
    "enabled": false,
    "allowedPaths": []
  },
  "version": "1.0",
  "vimMode": false
}
```

### Configuration Sections

| Section        | Purpose                                     |
| -------------- | ------------------------------------------- |
| `permissions`  | Controls what operations are allowed        |
| `approvalMode` | How to handle operations requiring approval |
| `vimMode`      | Enable vim keybindings                      |
| `display`      | UI display preferences                      |
| `sandbox`      | Sandboxed execution settings                |

## 3. Modify Permissions

Configure what operations the CLI can perform:

### Common Permission Settings

```json
{
  "permissions": {
    "allowBash": true,
    "allowFileWrite": true,
    "allowFileRead": true,
    "allowNetworkAccess": true,
    "allowEnvironmentRead": true
  }
}
```

### Permission Types

| Permission | Description | Default |
| --- | --- | --- |
| `allowBash` | Allow shell command execution | true |
| `allowFileWrite` | Allow file creation/modification | true |
| `allowFileRead` | Allow file reading | true |
| `allowNetworkAccess` | Allow network requests | true |
| `allowEnvironmentRead` | Allow reading env variables | true |

### Platform-Specific Permissions

**OpenCode:**

```json
{
  "permissions": {
    "allowBash": true,
    "allowFileWrite": true,
    "allowSubagents": true
  }
}
```

**Cursor:**

```json
{
  "permissions": {
    "allowBash": true,
    "allowFileWrite": true,
    "allowInlineEdit": true
  }
}
```

## 4. Configure Approval Mode

Set how the CLI handles operations requiring user approval:

### Approval Modes

| Mode     | Behavior                               |
| -------- | -------------------------------------- |
| `prompt` | Ask for approval before each operation |
| `auto`   | Approve automatically                  |
| `reject` | Reject without asking                  |
| `ask`    | Ask once, remember decision            |

### Configuration Example

```json
{
  "approvalMode": "prompt",
  "approvalSettings": {
    "promptTimeout": 30000,
    "rememberDecision": true,
    "maxAutoApproved": 10
  }
}
```

### Approval Rules

```json
{
  "approvalRules": {
    "fileWrite": {
      "mode": "prompt",
      "excludePatterns": ["*.env", "*.pem"]
    },
    "bash": {
      "mode": "prompt",
      "excludeCommands": ["rm -rf", "dd"]
    },
    "network": {
      "mode": "auto"
    }
  }
}
```

## 5. Enable Vim Mode

Configure vim keybindings:

### Basic Vim Configuration

```json
{
  "vimMode": true,
  "vimSettings": {
    "insertModeKey": "Escape",
    "leaderKey": "Space",
    "relativeLineNumbers": true
  }
}
```

### Vim Mode Features

| Feature               | Description                    |
| --------------------- | ------------------------------ |
| `insertModeKey`       | Key to enter insert mode       |
| `leaderKey`           | Leader key for custom mappings |
| `relativeLineNumbers` | Use relative line numbers      |

### Platform-Specific Vim

**Cursor:**

```json
{
  "vimMode": true,
  "vimUseSystemClipboard": true
}
```

**OpenCode:**

```json
{
  "vimEnableNeovimIntegration": false,
  "vimMode": true
}
```

## 6. Configure Display Options

Customize the CLI display:

### Display Settings

```json
{
  "display": {
    "showTokens": true,
    "showTimestamps": true,
    "showModel": true,
    "colorMode": "auto",
    "verbose": false
  }
}
```

### Display Options

| Option           | Description      | Values               |
| ---------------- | ---------------- | -------------------- |
| `showTokens`     | Show token usage | true/false           |
| `showTimestamps` | Show timestamps  | true/false           |
| `showModel`      | Show model name  | true/false           |
| `colorMode`      | Color output     | auto/dark/light/none |
| `verbose`        | Verbose output   | true/false           |

### Custom Themes

```json
{
  "display": {
    "theme": "default",
    "customTheme": {
      "primary": "#007ACC",
      "secondary": "#6A9955",
      "error": "#F44747"
    }
  }
}
```

## 7. Configure Sandbox

Set up sandboxed execution:

### Basic Sandbox Config

```json
{
  "sandbox": {
    "enabled": true,
    "allowedPaths": ["/home/user/projects"],
    "blockedPaths": ["/etc", "/root"],
    "maxMemoryMB": 1024,
    "maxTimeout": 300
  }
}
```

### Sandbox Options

| Option         | Description                      | Default |
| -------------- | -------------------------------- | ------- |
| `enabled`      | Enable sandbox mode              | false   |
| `allowedPaths` | Paths that can be accessed       | []      |
| `blockedPaths` | Paths that are blocked           | []      |
| `maxMemoryMB`  | Maximum memory usage             | 1024    |
| `maxTimeout`   | Maximum execution time (seconds) | 300     |

### Platform-Specific Sandbox

**OpenCode:**

```json
{
  "sandbox": {
    "enabled": true,
    "allowSubagents": true,
    "maxConcurrentTasks": 5
  }
}
```

**Cursor:**

```json
{
  "sandbox": {
    "enabled": false,
    "allowTerminalAccess": true
  }
}
```

## 8. Environment Variables

Some settings can be set via environment variables:

### Common Environment Variables

```bash
# Set approval mode
export CLI_APPROVAL_MODE=prompt

# Enable verbose output
export CLI_VERBOSE=true

# Set color mode
export CLI_COLOR_MODE=dark

# Set config path
export CLI_CONFIG_PATH=~/.custom-config.json
```

### Priority Order

1. Environment variables (highest)
2. CLI config file
3. Default values (lowest)

## 9. Validation and Testing

After making changes, validate the configuration:

### Validation Commands

```bash
# Validate JSON syntax
cat ~/.cursor/cli-config.json | python3 -m json.tool

# Check specific setting
jq '.permissions.allowBash' ~/.cursor/cli-config.json

# Test config loading
cursor-cli --validate-config
```

### OpenCode Validation

```typescript
// Use bash to validate
bash({
  command: "cat ~/.cursor/cli-config.json | jq .",
  description: "Validate config JSON"
});
```

### Testing Changes

```bash
# Reload config
cursor-cli --reload-config

# Test specific permission
cursor-cli --test-permission bash

# Show current config
cursor-cli --show-config
```

## 10. Common Configurations

### Development Mode

```json
{
  "approvalMode": "auto",
  "display": {
    "verbose": true,
    "showTokens": true
  },
  "permissions": {
    "allowBash": true,
    "allowFileWrite": true,
    "allowFileRead": true,
    "allowNetworkAccess": true
  }
}
```

### Production Mode

```json
{
  "approvalMode": "prompt",
  "permissions": {
    "allowBash": false,
    "allowFileWrite": false,
    "allowFileRead": true,
    "allowNetworkAccess": false
  },
  "sandbox": {
    "enabled": true
  }
}
```

### Restricted Mode

```json
{
  "approvalMode": "reject",
  "permissions": {
    "allowBash": false,
    "allowFileWrite": false,
    "allowFileRead": true,
    "allowNetworkAccess": false
  },
  "sandbox": {
    "enabled": true,
    "allowedPaths": ["/home/user/readonly"]
  }
}
```

## Troubleshooting

### Issue: Config changes not applied

**Solution:**

1. Restart the CLI/application
2. Check for syntax errors in JSON
3. Verify file permissions

### Issue: Permission denied

**Solution:**

1. Check file ownership: `ls -la ~/.cursor/cli-config.json`
2. Fix permissions: `chmod 644 ~/.cursor/cli-config.json`
3. Verify JSON is valid

### Issue: Sandbox not working

**Solution:**

1. Verify sandbox is enabled in config
2. Check allowed paths are correct
3. Ensure sandbox feature is supported

### Issue: Vim mode not working

**Solution:**

1. Check vimMode is set to true
2. Restart the application
3. Verify no conflicting keybindings

## Advanced Configuration

### Conditional Permissions

```json
{
  "permissions": {
    "allowBash": {
      "when": "projectType == 'development'",
      "default": false
    }
  }
}
```

### Rate Limiting

```json
{
  "rateLimit": {
    "maxRequestsPerMinute": 60,
    "maxBashCommands": 10,
    "maxFileWrites": 20
  }
}
```

### Audit Logging

```json
{
  "audit": {
    "enabled": true,
    "logFile": "~/.cursor/audit.log",
    "logLevel": "info",
    "includeTimestamps": true
  }
}
```

## Best Practices

1. **Backup before changes** - Keep a backup of working config
2. **Test in development** - Try changes in dev environment first
3. **Use version control** - Track config changes
4. **Document custom settings** - Add comments explaining changes
5. **Validate after changes** - Always verify JSON is valid
6. **Use minimal permissions** - Only enable what's needed

## Cross-Platform Commands

| Platform | Command                                   |
| -------- | ----------------------------------------- |
| OpenCode | Edit `~/.cursor/cli-config.json` directly |
| Cursor   | Use Settings UI or direct file edit       |
| Copilot  | Use `copilot config` commands             |

## Related Skills

- `update-cursor-settings` - For IDE settings
- `code-review` - For reviewing config changes
- `create-rule` - For creating persistent rules

## Notes

- Always validate JSON after editing
- Some settings require application restart
- Environment variables override config file
- Keep a backup of working configurations
