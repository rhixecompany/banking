---
plan name: instruction-files-enhancement
plan description: Enhance instruction files
plan status: active
---

## Idea
Enhance instruction files in .opencode/instructions/, .cursorrules, and .github/instructions/ by adding frontmatter with canonicalSource, applyTo filters, priority levels, and proper metadata for better discoverability and enforcement.

## Implementation
- 1. Add YAML frontmatter with proper metadata fields (canonicalSource, applyTo, priority, lastReviewed) to all .opencode/instructions/*.md files
- 2. Add YAML frontmatter to all .github/instructions/*.md files with same metadata structure
- 3. Add redirectFrom field to deprecated files pointing to their replacements
- 4. Create unified index file that lists all instruction files with their purposes and priorities
- 5. Run verify:rules to ensure changes don't break repository validation

## Required Specs
<!-- SPECS_START -->
<!-- SPECS_END -->