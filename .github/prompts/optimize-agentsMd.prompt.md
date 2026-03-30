## Plan: Comprehensive AGENTS.md for Agentic Coding in Banking Repo

**TL;DR:** I will analyze the codebase and existing documentation to produce a detailed, agent-focused `AGENTS.md` file. This file will serve as the canonical reference for all agentic contributors, covering build/lint/test commands (including single test execution), code style guidelines (imports, formatting, types, naming, error handling), and all Copilot/agent rules. I will ensure it is thorough (~2000 lines), up-to-date, and integrates all relevant rules from `.github/copilot-instructions.md` and any other agentic standards found.

---

**Steps**

### Phase 1: Discovery & Research

1. Review the current `AGENTS.md` in the workspace for structure, coverage, and gaps.
2. Analyze `.github/copilot-instructions.md` for Copilot/agent rules and patterns.
3. Search for any Cursor rules in `.cursor/rules/` or `.cursorrules` (if present).
4. Gather all build, lint, test, and single-test commands from `package.json` and related scripts.
5. Collect code style guidelines: imports, formatting, types, naming, error handling, etc., from all relevant docs and config files.
6. Identify any additional agentic or automation standards in the repo (e.g., in `README.md`, `CONTRIBUTING.md`, or other meta files).

### Phase 2: Alignment & Clarification

7. If ambiguities or missing info are found (e.g., Cursor rules not present), clarify with the user or note as "not present".
8. Validate that all agentic rules are up-to-date and not in conflict.

### Phase 3: Drafting the AGENTS.md

9. Structure the file for agentic consumption:
   - Introduction and purpose
   - Build/lint/test commands (with single test execution)
   - Code style guidelines (imports, formatting, types, naming, error handling)
   - Copilot/agent rules (from `.github/copilot-instructions.md`)
   - Cursor rules (if any)
   - Reference patterns and file locations
   - Contribution and PR requirements
   - Testing and verification requirements
   - Security and environment variable handling
   - Any additional agentic best practices
10. Integrate and improve upon the existing `AGENTS.md` content, ensuring clarity, completeness, and actionable detail.
11. Ensure the file is approximately 2000 lines, with comprehensive examples and explanations.

### Phase 4: Verification & Finalization

12. Cross-check the new `AGENTS.md` against all source files for accuracy.
13. Validate that all commands and patterns are correct and up-to-date.
14. Save the plan and present the structure and key sections to the user for review.

---

**Relevant files**

- `AGENTS.md` — Main agentic standards file (to be improved/rewritten)
- `.github/copilot-instructions.md` — Copilot/agent rules and patterns
- `.cursor/rules/`, `.cursorrules` — Cursor rules (if present)
- `package.json` — Scripts for build/lint/test commands
- `README.md`, `CONTRIBUTING.md` — Additional standards and patterns
- `tsconfig.json`, `eslint.config.mts`, `prettier` config — Formatting and type rules

---

**Verification**

1. Ensure all build/lint/test commands (including single test execution) are documented and correct.
2. Confirm code style guidelines are comprehensive and match project standards.
3. Validate that all Copilot/agent rules are included and up-to-date.
4. Check for the presence of Cursor rules and include if found.
5. Review the file for clarity, completeness, and actionable detail for agentic contributors.
6. Ensure the file is approximately 2000 lines and well-structured.

---

**Decisions**

- Will use `.github/copilot-instructions.md` as the primary source for agent rules.
- If Cursor rules are not present, will note their absence.
- Will prioritize actionable, example-driven documentation for agentic use.

---

**Further Considerations**

1. If the user has specific preferences for section order or additional topics, clarify before finalizing.
2. Recommend periodic review and update of `AGENTS.md` as project standards evolve.
3. Suggest linking to external docs (Next.js, Drizzle, etc.) for deeper dives where appropriate.

---

**Next Step:** Proceed to research and gather all required information from the codebase and documentation to begin drafting the improved `AGENTS.md`.
