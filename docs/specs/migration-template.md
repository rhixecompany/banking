# Spec: migration-template

Scope: feature

# FEATURE Spec: GitHub to OpenCode Migration Template

## Overview
Reusable template for migrating files from `.github/` directories to `.opencode/` structure.

## Prerequisites
- Source: `.github/instructions/` or `.github/prompts/`
- Target: `.opencode/rules/` or `.opencode/commands/`

## Input Schema
- `source_path`: Source directory containing files to migrate
- `target_path`: Destination directory in `.opencode/`
- `filter_pattern`: Optional glob pattern to filter files
- `add_frontmatter`: Boolean to add metadata tags

## Migration Steps

### Phase 1: Discovery
1. List all files in source directory
2. Catalog metadata (size, date, count)
3. Identify file types and patterns

### Phase 2: Filtering (if selective)
1. Apply relevance filter based on project context
2. Exclude already-existing files in target
3. Document inclusion criteria

### Phase 3: Copy & Transform
1. Copy files to target directory
2. Add frontmatter with tags (category, source, tags)
3. Preserve original filename unless rename specified

### Phase 4: Merge (if applicable)
1. Read existing target files (e.g., memory-bank.md)
2. Extract key content from migrated files
3. Append/merge into existing target files

### Phase 5: Verification
1. Verify file counts match
2. Spot-check content integrity
3. Test functional load (if applicable)

## Output Schema
```yaml
migrated:
  count: number
  files: string[]
  categories: string[]
verification:
  file_count: boolean
  content_check: boolean
  functional_test: boolean
```

## Error Handling
- Source files not found: Log and skip
- Target directory missing: Create it
- Duplicate files: Skip with warning
- Frontmatter parse error: Log and continue without tags

## Example Usage
```
Input: .github/instructions/ -> .opencode/rules/
Filter: *.instructions.md
Tags: category=instruction, source=.github/instructions/
```

## Notes
- Always add frontmatter metadata for traceability
- Preserve content integrity during copy
- Verify after migration completes
- Document any merge decisions