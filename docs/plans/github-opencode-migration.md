---
plan name: github-opencode-migration
plan description: Migrate instructions and prompts to opencode
plan status: active
---

## Idea
Migrate .github/instructions (11 files) and .github/prompts (~100+ relevant) to .opencode/rules and .opencode/commands with frontmatter tags and verification

## Implementation
- 1. List and catalog all 11 instruction files from .github/instructions/ with metadata (size, date, purpose)
- 2. List and catalog all 168 prompt files from .github/prompts/, filtering to Banking-relevant (~100 files)
- 3. Copy 11 instruction files to .opencode/rules/ with frontmatter tags (category, source, tags, date)
- 4. Copy Banking-relevant prompts to .opencode/commands/ with frontmatter tags (category, source, tags, language)
- 5. Read existing memory-bank.md and merge key rules from instruction files
- 6. Verify file counts: 11 instructions in .opencode/rules/, ~100 prompts in .opencode/commands/
- 7. Run functional test: verify migrated files load correctly in opencode
- 8. Spot-check 3-5 random files from each destination to confirm content integrity

## Required Specs
<!-- SPECS_START -->
- enhance-pages-spec
- enhance-pages-v2
- root-tests
- skills-catalog
<!-- SPECS_END -->