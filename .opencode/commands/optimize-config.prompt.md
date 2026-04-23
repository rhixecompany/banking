---
description: "`AGENTS.md`,`docs/personas-list.md`,`.opencode/instructions/00-default-rules.md`,`.cursorrules`,`.github/copilot-instructions.md`,`.opencode/instructions/\*.md`,`.github/instructions/\*.md`,`.cursor/rules/\*.mdc` — Full Accuracy Rewrite"
model: GPT-5 mini (copilot)
---

# Command: ./optimize-config.prompt

**Purpose:** Full replacement of `AGENTS.md`,`docs/personas-list.md`,`.opencode/instructions/00-default-rules.md`,`.cursorrules`,`.github/copilot-instructions.md`,`.opencode/instructions/\*.md`,`.github/instructions/\*.md`,`.cursor/rules/\*.mdc` with a corrected, canonical reference for all agentic coding agents (Copilot, Cursor, OpenCode) operating in this repository. Fixes all known inaccuracies and incorporates changes made since the last commit.

---

## Goals

- Produce a single authoritative `AGENTS.md`,`docs/personas-list.md`,`.opencode/instructions/00-default-rules.md`,`.cursorrules`,`.github/copilot-instructions.md`,`.opencode/instructions/\*.md`,`.github/instructions/\*.md`,`.cursor/rules/\*.mdc` that agents can rely on without cross-checking source
- Correct every inaccuracy identified during the discovery audit
- Document all changes made since the last commit (debt resolutions, rewrite)
- Add all eslint rules in the repo
- Include all skills, tools, plugins and mcp servers the agents can use
- Include all relevant context from repo
- Include all custom typescripts, bash scripts, powershell scripts, bat scripts in the repo

---

## Scope

Full replacement of `AGENTS.md`,`docs/personas-list.md`,`.opencode/instructions/00-default-rules.md`,`.cursorrules`,`.github/copilot-instructions.md`,`.opencode/instructions/\*.md`,`.github/instructions/\*.md`,`.cursor/rules/\*.mdc` No other files modified.

---

## Target Files

- `AGENTS.md`,`docs/personas-list.md`,`.opencode/instructions/00-default-rules.md`,`.cursorrules`,`.github/copilot-instructions.md`,`.opencode/instructions/\*.md`,`.github/instructions/\*.md`,`.cursor/rules/\*.mdc` — rewrite (only file changed)

---

## Extensively research the repo for all Planned Changes

---

## Validation

- [ ] `bash scripts/utils/run-ci-checks.sh --continue-on-fail` Read report file triage and fix all issues retry until not issues in the repo
- [ ] All debt items reflect current state from git diff
