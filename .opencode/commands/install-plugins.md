---
category: setup
tags: [opencode, plugins, installation, setup]
date: 2026-05-07
---

# Install OpenCode Plugins

Execute `.opencode/specs/install-plugins-plan.md` to install 12 OpenCode plugins into the Banking project. Run one phase at a time. Validate each phase before proceeding.

## When to Use

- Installing new OpenCode plugins for this project
- Setting up the development environment with additional tooling

## Plugin List

| Phase | Plugins |
| --- | --- |
| 1 (Low) | opencode-handoff, opencode-smart-title, opencode-optimal-model-temps, subtask2 |
| 2 (Medium) | opencode-dcp, opencode-type-inject, octto, planning-toolkit, opencode-background |
| 3 (Medium+) | opencode-froggy, @openhax/codex |
| 4 (High) | superpowers (local clone), smart-codebase |

## Execution Steps

### Phase 1

1. Read `.opencode/specs/install-plugins-plan.md`
2. Read `.opencode/opencode.json` and `.opencode/tui.json`
3. Back up both files to `.opencode/opencode.json.bak` and `.opencode/tui.json.bak`
4. Add these 4 to the `"plugin"` array in **both** files:
   - `opencode-handoff`
   - `@tarquinen/opencode-dcp`
   - `@spoons-and-mirrors/subtask2`
   - `@tarquinen/opencode-smart-title`
   - `opencode-optimal-model-temps`
5. Create `.opencode/subtask2.jsonc` with empty `{}` or config
6. Validate JSON syntax of both files
7. Restart OpenCode
8. Verify: `/handoff`, session title, `/subtask` commands work
9. **Only proceed to Phase 2 after Phase 1 validates**

### Phase 2

1. Read current `.opencode/opencode.json` and `.opencode/tui.json`
2. Back up to `.opencode/opencode.json.bak` and `.opencode/tui.json.bak`
3. Add these 5 to the `"plugin"` array in **both** files:
   - `@tarquinen/opencode-dcp`
   - `@nick-vi/opencode-type-inject`
   - `octto`
   - `@howaboua/opencode-planning-toolkit`
   - `@zenobius/opencode-background`
4. Create `.opencode/dcp.jsonc` with coexistence config from the spec:
   ```jsonc
   {
     "prune": {
       "mode": "toast",
       "auto": false,
       "pruneInterval": 30
     },
     "commands": {
       "enabled": true,
       "dcpSweep": true
     },
     "turnProtection": {
       "minTurns": 5
     }
   }
   ```
5. Create `.opencode/octto.json` with `{}` or minimal config
6. Validate JSON syntax of all files
7. Restart OpenCode
8. Verify: `/dcp` context/stats/sweep, TypeScript type injection, `/plan-feature`, `createBackgroundProcess`
9. **Only proceed to Phase 3 after Phase 2 validates**

### Phase 3

1. Read current `.opencode/opencode.json` and `.opencode/tui.json`
2. Back up to `.opencode/opencode.json.bak` and `.opencode/tui.json.bak`
3. Add these 2 to the `"plugin"` array in **both** files:
   - `opencode-froggy`
   - `@openhax/codex`
4. Validate JSON syntax of both files
5. Restart OpenCode
6. Verify: `/review-pr`, `/commit-push`, `/tests-coverage`, Codex OAuth
7. **Only proceed to Phase 4 after Phase 3 validates**

### Phase 4

1. Read current `.opencode/opencode.json` and `.opencode/tui.json`
2. Back up to `.opencode/opencode.json.bak` and `.opencode/tui.json.bak`
3. Clone superpowers locally:
   ```
   git clone https://github.com/obra/superpowers.git "C:\Users\Alexa\Desktop\SandBox\Banking\.opencode\plugin-src\superpowers"
   ```
4. Verify clone: confirm `.opencode/plugin-src/superpowers/.opencode/plugins/superpowers.js` exists
5. Add to `"plugin"` array in **both** files:
   - `file:///C:/Users/Alexa/Desktop/SandBox/Banking/.opencode/plugin-src/superpowers`
   - `smart-codebase`
6. Create `.opencode/smart-codebase.json`:
   ```jsonc
   {
     "enabled": true,
     "extractionModel": "openai/gpt-4o",
     "extractionMaxTokens": 16000
   }
   ```
7. Validate JSON syntax of all files
8. Restart OpenCode
9. Verify: `skill` tool lists superpowers skills, `/sc-init` creates `.opencode/skills/` files

## Rollback

If any phase fails:

1. Restore `.opencode/opencode.json` and `.opencode/tui.json` from `.bak`
2. Delete config files created in the failed phase
3. Delete `.opencode/plugin-src/superpowers/` (Phase 4 rollback only)
4. Restart OpenCode

## Notes

- Add all plugins to **both** `.opencode/opencode.json` and `.opencode/tui.json` `"plugin"` arrays
- `@openhax/codex` and `@tarquinen/opencode-smart-title` are already wired in provider/config — just add to plugin arrays
- DCP `auto: false` is critical — prevents conflict with built-in compaction (already enabled)
- Windows git URLs use `file:///` prefix with forward slashes
