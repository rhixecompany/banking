---
plan name: skill-review-fix
plan description: Review and fix skill files
plan status: done
---

## Idea

Systematically review and fix all .opencode/skills/\*.md files for npm→bun command inconsistencies, naming convention alignment, frontmatter completeness, then enhance each skill for clarity and completeness.

## Implementation

- 1. List all .opencode/skills/\*.md files to identify all skill files requiring review
- 2. Read each skill file and check for: npm→bun command inconsistencies, naming convention mismatches with AGENTS.md, missing/inconsistent frontmatter fields, outdated references
- 3. Fix npm→bun commands: Convert all 'npm run' to 'bun run' per AGENTS.md (Bun as package manager)
- 4. Fix naming/structure: Align with repo conventions (file paths, command references, tech stack)
- 5. Fix frontmatter: Ensure consistent 'name', 'description', 'lastReviewed' fields where needed
- 6. Verify all fixed skills align with AGENTS.md command references
- 7. Document any remaining issues or enhancements needed for each skill

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
