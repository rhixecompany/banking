---
name: session-auto-commit
description: Automatically commits changes at session end via GitHub hooks. Triggers on sessionEnd to run auto-commit.sh for automated versioning.
lastReviewed: 2026-04-30
applyTo: "**"
canonicalSource: .opencode/skills/session-auto-commit/hooks.json
---

# Session Auto-Commit

## Overview

This skill auto-commits changes at session end using GitHub hooks. It triggers on sessionEnd to run the auto-commit script for automated versioning.

## Hooks Configuration

### sessionEnd Hook

```json
{
  "hooks": {
    "sessionEnd": [
      {
        "type": "command",
        "bash": ".github/hooks/session-auto-commit/auto-commit.sh",
        "timeoutSec": 30
      }
    ]
  }
}
```

## Usage

- Triggers automatically when a session ends
- Runs `auto-commit.sh` to stage and commit changes
- Timeout: 30 seconds max
