# Plan: Install 12 OpenCode Plugins

## Goal

Install 12 OpenCode plugins into the Banking project at **project level only**. Plugins activate only for this repo, not globally. Install in batches by risk level (Low → Medium → Medium+ → High) to catch issues early. DCP is tuned to coexist with built-in compaction (already enabled). Git-backed plugins use local clone (Windows compatibility).

**Already wired (just add to plugin array):**
- `@openhax/codex` — provider already in opencode.json
- `@tarquinen/opencode-smart-title` — `smart-title.jsonc` already exists

**Skipped (overlap with kept plugins):**
- `micode` — redundant with superpowers + planning-toolkit
- `@zenobius/opencode-skillful` — redundant with built-in skill tool + superpowers

---

## Exit Criteria

- [ ] All 12 plugins load without errors on OpenCode restart
- [ ] Each phase validated before proceeding to next
- [ ] Phase 4 superpowers clones to `.opencode/plugin-src/superpowers/` and references via `file://`

---

## Phase 1: Low-Risk Plugins (4)

| # | Plugin | Package | Purpose | Config |
|---|-------|---------|---------|--------|
| 1 | opencode-handoff | `opencode-handoff` | Session handoff with `/handoff` command | None |
| 2 | opencode-smart-title | `@tarquinen/opencode-smart-title` | AI-generated session titles | Already: `.opencode/smart-title.jsonc` |
| 3 | opencode-optimal-model-temps | `opencode-optimal-model-temps` | Pin Gemini 3 Pro to temp 0.35 | None |
| 4 | subtask2 | `@spoons-and-mirrors/subtask2` | Enhanced `/command` handler with return/loop/parallel | Optional: `.opencode/subtask2.jsonc` |

**Steps:**
1. Read `.opencode/opencode.json` and `.opencode/tui.json`
2. Add these 4 to `"plugin"` array in both files
3. Create `.opencode/subtask2.jsonc`:
   ```jsonc
   {
     // Defaults work; uncomment to override:
     // "generic_return": "...",  // Override synthetic summary after subtask
     // "return_mode": "prompt"  // or "message"
   }
   ```
4. Back up both config files before editing
5. Validate JSON syntax
6. Restart OpenCode
7. Verify: `/handoff` works, session title auto-generates, `/subtask` works

---

## Phase 2: Medium-Risk Plugins (5)

| # | Plugin | Package | Purpose | Config |
|---|-------|---------|---------|--------|
| 5 | opencode-dcp | `@tarquinen/opencode-dcp` | Context pruning via compress tool | `.opencode/dcp.jsonc` — **TUNE TO COEXIST** |
| 6 | opencode-type-inject | `@nick-vi/opencode-type-inject` | Auto-inject TS/Svelte type signatures into reads | None |
| 7 | octto | `octto` | Interactive brainstorming via browser UI | Optional: `.opencode/octto.json` |
| 8 | planning-toolkit | `@howaboua/opencode-planning-toolkit` | `create_spec`, `create_plan`, `read_plan` tools | None |
| 9 | opencode-background | `@zenobius/opencode-background` | Background processes with `createBackgroundProcess` | None |

**DCP Coexistence Tuning:**
`compaction.auto: true` is already set in opencode.json. DCP uses its own compress system. Configure to avoid conflict:

```jsonc
// .opencode/dcp.jsonc
{
  "prune": {
    "mode": "toast",       // Notification style: "minimal" | "toast" | "detailed"
    "auto": false,         // DO NOT auto-prune; let built-in compaction handle it
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

**Steps:**
1. Read current `.opencode/opencode.json` and `.opencode/tui.json`
2. Add these 5 to `"plugin"` array in both files
3. Create `.opencode/dcp.jsonc` with coexistence config above
4. Create `.opencode/octto.json` (optional — defaults are fine):
   ```json
   {
     "port": 0
   }
   ```
5. Back up both config files
6. Validate JSON syntax
7. Restart OpenCode
8. Verify: `/dcp` commands work, TypeScript files show type injections, `/plan-feature` works, `createBackgroundProcess` works

---

## Phase 3: Medium+-Risk Plugins (2)

| # | Plugin | Package | Purpose | Config |
|---|-------|---------|---------|--------|
| 10 | opencode-froggy | `opencode-froggy` | Agents (architect, code-reviewer, rubber-duck, etc.), hooks, skills | Optional: `.opencode/opencode-froggy.json` |
| 11 | @openhax/codex | `@openhax/codex` | ChatGPT OAuth for Codex models | Already in provider config |

**Steps:**
1. Read current `.opencode/opencode.json` and `.opencode/tui.json`
2. Add these 2 to `"plugin"` array in both files
3. Validate JSON syntax
4. Restart OpenCode
5. Verify: `/review-pr`, `/commit-push`, `/tests-coverage` work, Codex OAuth login

---

## Phase 4: High-Risk Plugin (1) + smart-codebase (1)

| # | Plugin | Package | Purpose | Config |
|---|-------|---------|---------|--------|
| 12 | superpowers | Local clone | Skills framework (50+ skills) for agentic workflows | `.opencode/plugin-src/superpowers/` |
| 13 | smart-codebase | `smart-codebase` | AI learning/memory via `.opencode/skills/` SKILL files | `.opencode/smart-codebase.json` |

**Windows Git-Backed Plugin Workaround:**
OpenCode's `git+https://` plugin spec has upstream issues on Windows (git.exe path, Bun cache). Use local clone approach instead.

**Steps:**
1. Clone superpowers locally:
   ```powershell
   git clone https://github.com/obra/superpowers.git "C:\Users\Alexa\Desktop\SandBox\Banking\.opencode\plugin-src\superpowers"
   ```
2. Verify clone: confirm `.opencode/plugin-src/superpowers/.opencode/plugins/superpowers.js` exists
3. Add superpowers to `"plugin"` array as:
   ```
   "file:///C:/Users/Alexa/Desktop/SandBox/Banking/.opencode/plugin-src/superpowers"
   ```
4. Add smart-codebase to `"plugin"` array
5. Create `.opencode/smart-codebase.json`:
   ```jsonc
   {
     "enabled": true,
     "extractionModel": "openai/gpt-4o",
     "extractionMaxTokens": 16000
   }
   ```
6. Back up both config files
7. Validate JSON syntax
8. Restart OpenCode
9. Verify: `skill` tool lists superpowers skills, `/sc-init` creates `.opencode/skills/<project-name>/` SKILL files

---

## Final Plugin Array

After all 4 phases, `.opencode/opencode.json` `"plugin"` array:

```json
"plugin": [
  "opencode-handoff",
  "@tarquinen/opencode-dcp",
  "file:///C:/Users/Alexa/Desktop/SandBox/Banking/.opencode/plugin-src/superpowers",
  "@howaboua/opencode-planning-toolkit",
  "smart-codebase",
  "octto",
  "@nick-vi/opencode-type-inject",
  "@spoons-and-mirrors/subtask2",
  "@tarquinen/opencode-smart-title",
  "opencode-optimal-model-temps",
  "@openhax/codex",
  "opencode-froggy",
  "@zenobius/opencode-background",
  "opencode-mystatus",
  "@slkiser/opencode-quota"
]
```

Same array in `.opencode/tui.json` `"plugin"`.

---

## Config Files Created

| File | Phase | Notes |
|------|-------|-------|
| `.opencode/subtask2.jsonc` | 1 | Optional; defaults work |
| `.opencode/dcp.jsonc` | 2 | Critical — coexistence tuning |
| `.opencode/octto.json` | 2 | Optional; defaults work |
| `.opencode/plugin-src/superpowers/` | 4 | Local clone |
| `.opencode/smart-codebase.json` | 4 | Extraction model config |

---

## Rollback Per Phase

Each phase backs up configs before modification. To rollback after any phase:

1. Restore `.opencode/opencode.json` and `.opencode/tui.json` from `.bak`
2. Delete config files created in that phase
3. Delete `.opencode/plugin-src/superpowers/` (Phase 4 only)

---

## Verification Checklist Per Phase

| Phase | Verify |
|-------|--------|
| 1 | `/handoff` creates session handoff, session title auto-generates, `/subtask` works |
| 2 | `/dcp` context/stats/sweep commands, TS files show type injections, `/plan-feature` creates plans, `createBackgroundProcess` runs |
| 3 | `/review-pr`, `/commit-push`, `/tests-coverage`, Codex OAuth login flow |
| 4 | `skill` lists 50+ superpowers skills, `/sc-init` creates `.opencode/skills/` directory |
