## Plan: Enhance Core Instruction and Reference Files

This plan details a comprehensive enhancement of all core instruction, standards, and reference files listed in the opencode.json "instructions" array. The goal is to ensure these files are up-to-date, exhaustive, DRY, and fully aligned with the current architecture, agentic workflows, and best practices for the Banking repository.

**Steps**

### Phase 1: Audit and Triage

1. List and categorize all files in the "instructions" array by type: agentic, standards, patterns, documentation, and reference.
2. For each file, review current content for:
   - Outdated or missing information
   - Redundancy or overlap with other files
   - Gaps in coverage (e.g., new flows, tools, or patterns not documented)
   - Consistency with AGENTS.md and copilot-instructions.md

### Phase 2: Enhancement and DRY Refactor

3. For each file:
   - Update to reflect current architecture, tools, and workflows
   - Remove redundant or obsolete sections, consolidating where possible
   - Add missing sections for new features, flows, or agentic tools
   - Cross-reference related files for DRYness (e.g., link to exemplars, folder-structure, tech-stack)
   - Standardize formatting, terminology, and section structure
   - Ensure all agentic and developer flows are clearly documented and actionable

4. For files with overlapping content (e.g., AGENTS.md vs. copilot-instructions.md):
   - Merge or cross-link to avoid duplication
   - Clarify the canonical source for each type of guidance

### Phase 3: Verification and Sync

5. Validate that all files:
   - Are internally consistent and up-to-date
   - Cover all current repo features, tools, and agentic workflows
   - Are referenced correctly in opencode.json and other config files

6. Update or create a checklist in .opencode/commands/init-enhanced.md for ongoing documentation sync and verification.

**Relevant files**

- AGENTS.md — Master agentic instruction set
- .github/copilot-instructions.md — Copilot/agent-specific rules
- .cursorrules, .opencode/instructions/\*.md — Core standards, patterns, and flows
- .opencode/tools/philosophy.md — Philosophy and guiding principles
- .github/instructions/_.md, .cursor/rules/_.mdc — Additional rules and instructions
- architecture.md, tech-stack.md, coding-standards.md, folder-structure.md, exemplars.md — Reference and standards

**Verification**

1. Review each file for completeness, DRYness, and accuracy
2. Confirm all new/updated flows and tools are documented
3. Validate cross-references and canonical sources
4. Run documentation lint/format checks if available

**Decisions**

- All instruction and reference files must be exhaustive, DRY, and up-to-date
- Canonical sources for each type of guidance will be clarified and cross-linked
- Ongoing sync checklist will be maintained for future updates

**Further Considerations**

1. If new agentic tools or flows are added, update documentation immediately
2. If major architectural changes occur, prioritize updating AGENTS.md and copilot-instructions.md first
3. Consider automating documentation linting and sync checks in CI

Would you like to review the current state of a specific file or proceed with a particular phase?
