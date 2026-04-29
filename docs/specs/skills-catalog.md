# Spec: skills-catalog

Scope: repo

## Skills Catalog Spec
### Name: skills-catalog
### Description
Create a SKILLS.md catalog file in `.opencode/skills/` that lists all skills with their names and descriptions. This provides a quick overview of all available skills.
### Implementation
1. Glob all `.opencode/skills/*/SKILL.md` files
2. Read each file and extract:
   - Skill directory name (e.g., `auth-skill` from `auth-credential/SKILL.md`)
   - Description from frontmatter `description` field (or first H1 heading)
   - Priority from frontmatter
3. Generate table format:
   ```
   | Skill | Description | Priority |
   | ----- | ----------- | --------- |
   | auth-credential | NextAuth v4 patterns... | high |
   ```
4. Write to `.opencode/skills/SKILLS.md`
### Standards
- Table with columns: Skill, Description, Priority
- Sorted alphabetically by skill name
- Links to individual SKILL.md files
- Keep under 500 lines
### Evidence
- AGENTS.md has Skills table as reference format