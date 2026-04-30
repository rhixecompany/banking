---
name: update-cursor-settings
description: Modify Cursor/VSCode user settings in settings.json. Use when you want to change editor settings, preferences, configuration, themes, font size, tab size, format on save, auto save, keybindings, or any settings.json values.
lastReviewed: 2026-04-29
applyTo: "**/*"
platforms:
  - opencode
  - cursor
  - copilot
---

# Updating Cursor Settings - Banking Project Guidelines

## Overview

This skill provides comprehensive guidelines for modifying Cursor/VSCode user settings. It covers settings file locations, common configurations, advanced options, and best practices for the Banking project.

## Multi-Agent Commands

### OpenCode

```bash
# Find settings file
ls -la ~/.cursor/settings.json

# Read current settings
cat ~/.cursor/settings.json
```

### Cursor

```
@update-cursor-settings
Change font size to 16
```

### Copilot

```
/settings update editor.fontSize 16
```

## Settings File Location

### By Operating System

| OS      | Path                                                    |
| ------- | ------------------------------------------------------- |
| macOS   | ~/Library/Application Support/Cursor/User/settings.json |
| Linux   | ~/.config/Cursor/User/settings.json                     |
| Windows | %APPDATA%\Cursor\User\settings.json                     |

### Workspace Settings

- Location: `.vscode/settings.json` in project root
- Applies only to current project
- Overrides user settings

## Before Modifying Settings

### Workflow

1. **Read existing settings** - Understand current configuration
2. **Preserve existing settings** - Only add/modify what user requested
3. **Validate JSON syntax** - Avoid breaking the editor
4. **Test changes** - Verify settings apply correctly

### Safety Checklist

- [ ] Backup settings before major changes
- [ ] Validate JSON after modifications
- [ ] Test one change at a time
- [ ] Document custom configurations

## Common Settings

### Editor Settings

| User Request | Setting | Example Value |
| --- | --- | --- |
| Bigger/smaller font | `editor.fontSize` | 16 |
| Change tab size | `editor.tabSize` | 2 |
| Format on save | `editor.formatOnSave` | true |
| Word wrap | `editor.wordWrap` | "on" |
| Hide minimap | `editor.minimap.enabled` | false |
| Line numbers | `editor.lineNumbers` | "on" |
| Bracket matching | `editor.bracketPairColorization.enabled` | true |
| Cursor style | `editor.cursorStyle` | "line" |
| Smooth scrolling | `editor.smoothScrolling` | true |
| Auto indent | `editor.autoIndent` | "full" |

### Workbench Settings

| User Request | Setting | Example Value |
| --- | --- | --- |
| Change theme | `workbench.colorTheme` | "Default Dark Modern" |
| Icon theme | `workbench.iconTheme` | "vs-seti" |
| Sidebar location | `workbench.sideBar.location` | "left" |
| Status bar visible | `workbench.statusBar.visible` | true |

### Files Settings

| User Request | Setting | Example Value |
| --- | --- | --- |
| Auto save | `files.autoSave` | "afterDelay" |
| Auto save delay | `files.autoSaveDelay` | 1000 |
| Exclude patterns | `files.exclude` | {"\*\*/node_modules": true} |
| File associations | `files.associations` | {"\*.json": "jsonc"} |

### Terminal Settings

| User Request | Setting | Example Value |
| --- | --- | --- |
| Font size | `terminal.integrated.fontSize` | 14 |
| Shell (macOS) | `terminal.integrated.shell.osx` | "/bin/zsh" |
| Shell (Linux) | `terminal.integrated.shell.linux` | "/bin/bash" |
| Shell (Windows) | `terminal.integrated.shell.windows` | "powershell.exe" |

### Cursor-Specific Settings

| Setting | Description | Example Value |
| --- | --- | --- |
| `cursor.agent.useMcp` | Enable MCP for agents | true |
| `cursor.agent.mcpServers` | Configure MCP servers | {...} |
| `aipopup.enabled` | Enable AI popup suggestions | true |
| `aipopup.autoSuggest` | Auto-suggest AI actions | true |

## Modifying Settings

### Step 1: Read Current Settings

```bash
# Find settings file based on OS
# macOS
cat ~/Library/Application\ Support/Cursor/User/settings.json

# Linux
cat ~/.config/Cursor/User/settings.json

# Windows
type %APPDATA%\Cursor\User\settings.json
```

### Step 2: Identify the Setting

Common setting categories:

- **Editor**: fontSize, tabSize, wordWrap, formatOnSave
- **Workbench**: colorTheme, iconTheme, sideBar.location
- **Files**: autoSave, exclude, associations
- **Terminal**: integrated.fontSize, integrated.shell.\*
- **Cursor-specific**: cursor._, aipopup._

### Step 3: Update the Setting

When modifying settings.json:

1. Parse existing JSON (handle comments)
2. Add or update requested setting
3. Preserve all other existing settings
4. Write back with 2-space indentation

### Example: Enable Format on Save

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

### Example: Change Theme

```json
{
  "workbench.colorTheme": "Default Dark Modern"
}
```

### Example: Configure TypeScript

```json
{
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  }
}
```

## Important Notes

### JSON with Comments

VSCode/Cursor settings.json supports comments:

- Line comments: `// comment`
- Block comments: `/* comment */`

When reading, be aware comments may exist. When writing, preserve comments if possible.

### Restart Requirements

| Setting Type        | Restart Needed |
| ------------------- | -------------- |
| Theme               | No             |
| Font size           | No             |
| Tab size            | No             |
| Shell configuration | Yes            |
| Extension settings  | Yes            |

### Workspace vs User Settings

- **User settings**: Apply globally to all projects
- **Workspace settings** (`.vscode/settings.json`): Apply only to current project

### Attribution Settings

When user asks about commit attribution:

- **CLI agent**: Modify `~/.cursor/cli-config.json`
- **IDE agent**: Configure from UI at **Cursor Settings > Agent > Attribution**

## Advanced Settings

### Performance Settings

```json
{
  "editor.acceptSuggestionOnEnter": "on",
  "editor.inlineSuggest.enabled": true,
  "editor.quickSuggestions": true,
  "editor.suggest.preview": true,
  "editor.suggestOnTriggerCharacters": true
}
```

### AI/Agent Settings

```json
{
  "aipopup.autoSuggest": true,
  "aipopup.enabled": true,
  "aipopup.maxTokens": 4000,
  "cursor.agent.autoApprove": false,
  "cursor.agent.useMcp": true
}
```

### Debugging Settings

```json
{
  "debug.console.fontSize": 14,
  "debug.inlineValues": true,
  "debug.openDebug": "openOnDebugBreak",
  "debug.showBreakpointsInOverviewRuler": true
}
```

### Banking Project Settings

```json
{
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "javascript.updateImportsOnFileRename.enabled": "always",
  "typescript.updateImportsOnFileRename.enabled": "always"
}
```

### Keybinding Settings

```json
{
  "keybindings": [
    {
      "key": "cmd+shift+f",
      "command": "editor.action.formatDocument",
      "when": "editorTextFocus"
    }
  ]
}
```

## Language-Specific Settings

### TypeScript/JavaScript

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  }
}
```

### Python

```json
{
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.tabSize": 4,
    "editor.indentationSize": "tabSize"
  }
}
```

### JSON

```json
{
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  }
}
```

## Multi-Folder Workspace

For workspaces with multiple folders:

```json
{
  "folders": [
    { "path": "/project/client" },
    { "path": "/project/server" },
    { "path": "/project/shared" }
  ],
  "settings": {
    "editor.fontSize": 14
  },
  "settingsByFolder": {
    "/project/client": {
      "editor.tabSize": 2,
      "typescript.preferences.includePackageJsonAutoImports": "on"
    },
    "/project/server": {
      "editor.tabSize": 4,
      "python.linting.enabled": true
    }
  }
}
```

## Validation Commands

```bash
# Validate JSON syntax
cat ~/.cursor/settings.json | python3 -m json.tool

# Check specific setting
jq '.editor.fontSize' ~/.cursor/settings.json

# List all editor settings
jq '.editor' ~/.cursor/settings.json
```

## Troubleshooting

### Settings Not Applying

**Problem**: Changes don't take effect

**Solutions**:

1. Check JSON syntax - invalid JSON prevents all settings
2. Restart Cursor - some settings require restart
3. Check workspace settings - `.vscode/settings.json` may override
4. Check remote settings - if using remote development

### Settings Reset

**Problem**: Settings revert unexpectedly

**Solutions**:

1. Check for extensions that modify settings
2. Look for workspace settings overriding user settings
3. Verify file wasn't corrupted
4. Check for sync issues if using settings sync

### JSON Parse Errors

**Problem**: Invalid JSON syntax

**Solutions**:

1. Remove comments if causing issues
2. Check for trailing commas
3. Verify all brackets are matched
4. Use JSON validator

### Theme Not Loading

**Problem**: Theme doesn't apply

**Solutions**:

1. Verify theme is installed
2. Check theme name is correct
3. Restart Cursor
4. Check for theme extension issues

## Best Practices

### 1. Backup Before Changes

```bash
# Create backup
cp ~/.cursor/settings.json ~/.cursor/settings.json.bak

# Restore if needed
cp ~/.cursor/settings.json.bak ~/.cursor/settings.json
```

### 2. Test One Change at a Time

```json
// Good: Single change
{
  "editor.fontSize": 16
}

// Avoid: Multiple changes at once
{
  "editor.fontSize": 16,
  "editor.tabSize": 4,
  "workbench.colorTheme": "Dark"
}
```

### 3. Use Workspace Settings for Projects

```bash
# Project-specific settings
.vscode/settings.json
```

### 4. Document Custom Configurations

```json
{
  // Banking project settings
  // Added 2026-04-29 for consistent formatting
  "editor.formatOnSave": true
}
```

### 5. Use Consistent Formatting

```json
{
  "editor.fontSize": 14,
  "editor.formatOnSave": true,
  "editor.tabSize": 2
}
```

## Cross-References

- **update-cli-config**: For CLI configuration
- **create-rule**: For creating persistent rules
- **code-review**: For reviewing configuration changes
- **validation-skill**: For JSON validation patterns

## Performance Tips

1. Disable unused extensions to speed up Cursor
2. Use workspace settings for project-specific configs
3. Limit number of language-specific settings
4. Use "quiet" mode for fewer suggestions

## Notes

- Some settings require Cursor restart
- JSON with comments is supported
- Workspace settings override user settings
- Keep backup of working configurations
- Test changes in development first
