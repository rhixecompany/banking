---
plan name: skills-markdown-consolidation
plan description: Skills markdown consolidation plan
plan status: done
---

## Idea

Create a comprehensive plan to list, triage, catalog, identify inconsistencies, fix issues, consolidate duplicates, verify, enhance, and format all markdown files in .opencode/skills/ directory to ensure they pass markdownlint validation and are consistent with repo standards.

## Implementation

- 1. List all markdown files in .opencode/skills/ directory using glob pattern to create a complete catalog of SKILL.md and referenced/\*.md files
- 2. Read .markdownlintrc.json configuration to understand current linting rules and ignored paths
- 3. Triage each markdown file for common issues: missing frontmatter, incorrect formatting, broken links, orphaned files
- 4. Identify inconsistencies with repo: check naming conventions, folder structure alignment with AGENTS.md and available_skills
- 5. Fix any issues found - broken links, missing frontmatter, formatting issues
- 6. Identify dead/duplicate markdown files or orphaned files outside skill directories
- 7. Consolidate duplicates and remove dead/orphaned markdown files
- 8. Run markdownlint validation on all remaining markdown files
- 9. Enhance formatting of markdown files if needed to ensure consistency
- 10. Update .markdownlintrc.json if .opencode/skills/\*.md files need to be excluded or included in linting

## Required Specs

<!-- SPECS_START -->

- frontmatter-check
- skills-catalog
<!-- SPECS_END -->
