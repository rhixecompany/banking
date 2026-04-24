## Plan: Audit, Fix, and Enhance .opencode/skills/\*_/_.md Files

**TL;DR:** Systematically review all `.opencode/skills/**/*.md` files, identify inconsistencies with repo conventions (AGENTS.md, app structure, naming, validation, etc.), fix all issues, and enhance each skill for clarity, completeness, and repo alignment.

---

**Steps**

### 1. Discovery & Triage

- List all `.opencode/skills/**/*.md` files (SKILL.md, README.md).
- Categorize: core skills (validation, db, server-action, etc.), meta-skills (suggest, simplify), hooks (session-logger, auto-commit), and external/VS Code skills.
- For each, check:
  - Naming, frontmatter, and description consistency.
  - `applyTo` patterns match actual repo structure.
  - Last reviewed date and version alignment.
  - Usage examples and patterns match current repo code (e.g., Drizzle, Zod, shadcn/ui, Next.js 16).
  - Validation, lint, and test instructions are up-to-date.
  - References to deprecated files, tables, or patterns (e.g., `banks` vs. `wallets`).
  - Completeness: missing sections, empty files, or placeholder text.

### 2. Inconsistency & Issue Identification

- Note all mismatches:
  - Outdated or missing `applyTo` globs.
  - Incomplete or empty files (e.g., some README.md, SKILL.md).
  - Skills referencing deprecated patterns or missing new repo conventions.
  - Skills lacking repo-specific guidance (e.g., env handling, DAL-only DB access, Server Actions contract).
  - Skills missing verification steps or checklists.
  - Skills not referencing AGENTS.md or codemap.md for canonical rules.

### 3. Fixes & Enhancements

- For each skill:
  - Update frontmatter for accuracy and completeness.
  - Ensure all usage examples match current repo code and conventions.
  - Add/clarify verification steps (type-check, lint, test, etc.).
  - Add explicit references to AGENTS.md, codemap.md, and app-config.ts where relevant.
  - Remove or update references to deprecated files, tables, or patterns.
  - Fill in empty or placeholder files with meaningful content or remove if obsolete.
  - Add missing sections: overview, when to use, canonical patterns, validation, common issues.
  - For meta-skills (suggest, simplify), clarify their scope and how they interact with repo rules.
  - For hooks, ensure install/usage instructions are clear and reference logs/automation as used in this repo.

### 4. Verification

- Run `npm run lint:strict`, `npm run type-check`, and `npm run verify:rules` to ensure all skills are valid and referenced correctly.
- Manually review a sample of each skill's usage in the codebase to confirm alignment.
- Ensure all skills are discoverable and referenced in AGENTS.md or codemap.md as appropriate.

---

**Relevant files**

- `.opencode/skills/*/SKILL.md` — All skill definitions (update for accuracy, completeness, and repo alignment)
- `.opencode/skills/*/README.md` — Supplementary docs (fill in or remove if empty/obsolete)
- `AGENTS.md`, `codemap.md`, `app-config.ts` — Canonical repo rules and references

---

**Verification**

1. Run `npm run lint:strict` and `npm run type-check` to catch syntax and type issues in skills.
2. Run `npm run verify:rules` to ensure skills reference and enforce repo policies.
3. Manually check that each skill's examples and instructions match actual code usage.
4. Confirm all skills are referenced in AGENTS.md or codemap.md for discoverability.

---

**Decisions**

- All skills must be repo-specific, up-to-date, and reference canonical rules.
- Empty or placeholder files must be filled in or removed.
- Skills must not reference deprecated patterns or files.
- Verification steps must be explicit and actionable.

---

**Further Considerations**

1. If any skill is not actively used or referenced, recommend archiving or removing it.
2. Consider adding a summary table in codemap.md or AGENTS.md listing all available skills and their purpose.
3. For skills that are meta or external (e.g., suggest-awesome-github-copilot-instructions), clarify their integration points with the repo.

---

Would you like to review the detailed list of inconsistencies and proposed fixes for each skill before proceeding to implementation?
