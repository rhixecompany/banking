# Spec: frontmatter-check

Scope: feature

## Frontmatter Check Spec

### Name: frontmatter-check

### Description

Ensure all SKILL.md files in `.opencode/skills/` have proper YAML frontmatter with fields:

- `description`: Brief description of the skill
- `priority`: Priority level (high, medium, low)
- `applyTo`: File pattern the skill applies to (e.g., `**/*.md`)
- `canonicalSource`: Reference to authoritative source (e.g., `AGENTS.md`)
- `lastReviewed`: Date of last review (format: YYYY-MM-DD)

### Scope

- All `.opencode/skills/*/SKILL.md` files
- NOT including: nested rules/_.md, references/_.md, README.md

### Implementation

1. Read first 20 lines of each SKILL.md to detect frontmatter block (between ---)
2. If missing frontmatter, add standard block at top of file
3. Extract description from first H1 heading if description missing
4. Use current date for lastReviewed if not present

### Standards

- Frontmatter MUST use YAML format with ---
- description: max 200 chars, sentence case
- priority: one of high | medium | low
- applyTo: Glob pattern or file path
- canonicalSource: Reference to source (AGENTS.md, package.json, etc.)
- lastReviewed: ISO date format (YYYY-MM-DD)

### Evidence

- .opencode/instructions/index.md - example instruction file format
- .opencode/instructions/00-default-rules.md - example with full frontmatter
