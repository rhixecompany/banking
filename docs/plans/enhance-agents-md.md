---
plan name: enhance-agents-md
plan description: Enhance AGENTS.md with plugins, skills, tools
plan status: active
---

## Idea

Read existing AGENTS.md and opencode-agents-context.md, enhance AGENTS.md with all available plugins, skills, and tools formatted with markdownlint

## Implementation

- Read current AGENTS.md to understand existing structure and content
- Read opencode-agents-context.md to get complete skills and tools listing
- List .opencode/plugins directory to identify all available plugins
- List .opencode/skills directory to identify project skills
- Verify all skills via get_available_skills tool
- Identify missing elements from AGENTS.md compared to opencode-agents-context.md
- Add plugin documentation section to AGENTS.md
- Add skills section with all project skills and plugin skills to AGENTS.md
- Add tools section organized by category to AGENTS.md
- Add plans section if available
- Run markdownlint to verify format compliance
- Fix any markdownlint violations

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
