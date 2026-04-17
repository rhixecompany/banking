Plan: Canonical Agent Rules & Instructions Rewrite (Full Accuracy, All Data)

TL;DR: Produce a single, exhaustive, and up-to-date canonical reference for all agentic coding agents (Copilot, Cursor, OpenCode) in the Banking repo. This file will be duplicated verbatim to all target instruction files, replacing legacy content. It will include all current features, detailed persona/agent roles, all custom scripts (with code, invocation, and output examples), all custom types, all skills/tools/plugins/MCP servers (with full docs and usage), a complete ESLint rule list, validation steps, and a detailed change log (with file/line references and historical summary). No legacy/deprecated rules unless still in use.

---

### Steps

#### Phase 1: Discovery & Audit

1. **Inventory All Target Files**
   - List all files matching: `AGENTS.md`, `docs/personas-list.md`, `.opencode/instructions/00-default-rules.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.opencode/instructions/*.md`, `.github/instructions/*.md`, `.cursor/rules/*.mdc`.
   - List all custom scripts (TypeScript, Bash, PowerShell, BAT) with paths.
   - List all custom TypeScript types.
   - List all skills, tools, plugins, and MCP servers (even if unused).
   - List all SKILL.md files.

2. **Extract Current Content & Rules**
   - For each file, extract:
     - Agent rules, coding standards, workflow instructions.
     - Persona/agent role definitions (full text).
     - All referenced and available skills, tools, plugins, MCP endpoints.
     - All custom scripts: code, invocation, and example outputs.
     - All custom types.
     - All ESLint rules (full list, including extends).
     - Validation and verification steps.
     - Any mapping of personas/agents to skills/tools/scripts.

3. **Audit for Debt & Recent Changes**
   - Review git history and diffs for all files since last commit.
   - Identify all debt items, TODOs, and recent changes not reflected in documentation.

#### Phase 2: Synthesis & Correction

4. **Resolve Inaccuracies and Debt**
   - For each identified inaccuracy or debt item, determine the correct, current rule or instruction.
   - Remove or update deprecated, conflicting, or ambiguous guidance.

5. **Consolidate into Canonical Reference**
   - Merge all relevant content into a single, well-structured document.
   - Structure:
     - **Introduction & Scope**
     - **Persona/Agent Roles** (detailed, with mapping table)
     - **Agentic Coding Standards & PR Rules**
     - **Skills, Tools, Plugins, MCP Servers** (full docs, config, usage)
     - **Custom Scripts** (code, invocation, output)
     - **Custom TypeScript Types** (comprehensive list)
     - **ESLint Rules** (full list, with explanations)
     - **Validation & Verification Steps** (all manual and automated)
     - **Change Log** (detailed table with file/line/rationale, plus historical summary)
   - Ensure all agent types (Copilot, Cursor, OpenCode) are addressed.
   - Include all required details per your answers above.

6. **Document All Changes**
   - At the end of the document, include a detailed change log table (file/line/rationale) and a summary of major historical changes.

#### Phase 3: Validation & Handoff

7. **Validation**
   - Run `bash scripts/utils/run-ci-checks.sh --continue-on-fail` and triage all issues.
   - Ensure all issues are resolved and documentation reflects the current repo state.
   - Confirm that the new canonical file is self-sufficient (no cross-referencing required).

8. **Prepare for Handoff**
   - Save the new canonical reference to all target files (as specified), verbatim.
   - Ensure no other files are modified.
   - Provide a summary for reviewers, including validation steps and change log.

---

### Relevant Files

- `AGENTS.md`
- `docs/personas-list.md`
- `.opencode/instructions/00-default-rules.md`
- `.cursorrules`
- `.github/copilot-instructions.md`
- `.opencode/instructions/*.md`
- `.github/instructions/*.md`
- `.cursor/rules/*.mdc`
- `eslint.config.mts`
- All custom scripts: `scripts/`, `*.ts`, `*.sh`, `*.ps1`, `*.bat`
- All SKILL.md files
- Skills, tools, plugins, MCP servers (from config and codebase)
- All custom TypeScript types

---

### Verification

1. Run `bash scripts/utils/run-ci-checks.sh --continue-on-fail` until all issues are resolved.
2. Confirm all debt items and recent changes are reflected in the new canonical file.
3. Ensure all agentic instructions are accurate, non-duplicative, and up-to-date.
4. Validate that all referenced skills, tools, plugins, scripts, and types are included and described.
5. Confirm that the canonical file is present in all target locations and no other files are changed.

---

### Decisions & Preferences Incorporated

- **Only current features** (no legacy/deprecated rules unless still in use)
- **Full code listings** for all custom scripts, with invocation and output examples
- **Full list of ESLint rules** (including extends)
- **All available skills/tools/plugins/MCP servers** (even if unused), with full docs and usage/config
- **Detailed persona/agent role descriptions** (full text), with mapping table to skills/tools/scripts
- **All custom types** (comprehensive list)
- **Validation section** includes all manual and automated checks
- **Verbatim duplication** to all target files (identical content)
- **Full text of each SKILL.md** included
- **Detailed change log** (table with file/line/rationale, plus historical summary)

---

### Further Considerations

1. Update the canonical reference immediately when new skills, tools, scripts, or types are added.
2. Consider automating duplication to all target files.
3. Periodically audit for drift between documentation and repo state.

---

**This plan is ready for execution. Please confirm or request further adjustments.**
