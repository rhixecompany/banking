---
name: migrate-to-skills
description: Convert 'Applied intelligently' Cursor rules (.cursor/rules/*.mdc) and slash commands (.cursor/commands/*.md) to Agent Skills format (.cursor/skills/). Use when you want to migrate rules or commands to skills, convert .mdc rules to SKILL.md format, or consolidate commands into the skills directory.
lastReviewed: 2026-04-29
applyTo: "**/*"
platforms:
  - opencode
  - cursor
  - copilot
---

# Migrate to Skills

Convert legacy Cursor rules and commands to the Agent Skills format. This comprehensive guide covers migration patterns, tool mapping, and best practices across all AI agent platforms (OpenCode, Cursor, GitHub Copilot).

## When to Use This Skill

- Converting `.cursor/rules/*.mdc` files to `.cursor/skills/SKILL.md`
- Converting `.cursor/commands/*.md` files to skills
- Consolidating multiple rules into unified skills
- Migrating from legacy rule format to modern skill format

## Platform-Specific Considerations

### OpenCode

In OpenCode, skills are stored in `.opencode/skills/` directory:

- Skills use `SKILL.md` format
- Can include `scripts/`, `references/`, `assets/` subdirectories
- Use the native `skill` tool to load and use skills

### Cursor

In Cursor IDE:

- Skills go in `.cursor/skills/` directory
- Use the `Skill` tool to invoke skills
- Skills can include code snippets and examples

### GitHub Copilot

In Copilot CLI or VS Code:

- Skills are loaded via the skill system
- Use Copilot Chat to discover and use skills
- Skills provide persistent guidance

## 1. Discover Legacy Rules

Find all existing Cursor rules and commands in the project:

```bash
# Find all .mdc rule files
find .cursor/rules -name "*.mdc" 2>/dev/null

# Find all .md command files
find .cursor/commands -name "*.md" 2>/dev/null

# List all rule files with content summary
ls -la .cursor/rules/
ls -la .cursor/commands/
```

### OpenCode Tool Usage

```typescript
// Use glob to find rule files
glob({ pattern: ".cursor/rules/**/*.mdc" });
glob({ pattern: ".cursor/commands/**/*.md" });

// Use grep to find specific patterns
grep({ pattern: "Applied intelligently", include: "*.mdc" });
```

### Cursor Tool Usage

```typescript
// Use file system tools to find rules
await glob("**/*.mdc");
await glob("**/*.md");
```

## 2. Analyze Each Rule

For each rule or command, extract:

1. **Trigger**: What activates this rule (file patterns, commands, keywords)
2. **Content**: The actual guidance or instructions
3. **Purpose**: What the rule is trying to achieve
4. **Dependencies**: Any referenced files or external resources

### Rule Analysis Template

```markdown
## Original Rule Analysis

### File: .cursor/rules/typescript.mdc

**Trigger Patterns:**

- File matches: `*.ts`, `*.tsx`
- Context: TypeScript files

**Content Summary:**

- Enforces strict TypeScript
- Requires JSDoc comments
- Enforces naming conventions

**Purpose:**

- Maintain code quality
- Ensure consistent TypeScript patterns

**Dependencies:**

- None
```

## 3. Convert to SKILL.md Format

Transform legacy rules into proper SKILL.md format:

### SKILL.md Frontmatter

```yaml
---
name: typescript-guidance
description: >-
  TypeScript coding standards and best practices for this project. Use when writing TypeScript code, creating type definitions, or working with TypeScript files.


metadata:
  surfaces:
    - cli
    - ide
    - chat
  triggers:
    - pattern: "*.ts"
    - pattern: "*.tsx"
    - context: "typescript"
---
```

### SKILL.md Content Structure

````markdown
# TypeScript Guidance

## Purpose

This skill provides TypeScript coding standards and best practices for the Banking application. Use when writing any TypeScript code.

## When to Use

- Creating new TypeScript files
- Adding type definitions
- Working with TypeScript components
- Writing TypeScript utilities

## Core Principles

### 1. Strict Mode

Always use strict TypeScript settings:

```typescript
// ✅ Good - Explicit types
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Bad - Implicit any
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```
````

### 2. Type Safety

Prefer explicit types over inference for function parameters and return types.

### 3. JSDoc for Complex Logic

Document complex functions with JSDoc comments.

## Platform-Specific Examples

### OpenCode

```typescript
// Use bash tool for TypeScript checking
bash({
  command: "npx tsc --noEmit",
  description: "Type check TypeScript"
});
```

### Cursor

```typescript
// Use terminal for type checking
await terminal.exec("npx tsc --noEmit");
```

### Copilot

```typescript
// Use chat to explain TypeScript concepts
// Ask: "Explain strict mode in TypeScript"
```

## Validation Commands

```bash
# Type check entire project
npm run type-check

# Type check specific file
npx tsc --noEmit src/utils/helper.ts

# Run strict type checking
npm run lint:strict
```

## Related Skills

- `code-review` - For reviewing TypeScript code
- `create-skill` - For creating new skills
- `validation-skill` - For TypeScript validation patterns

````

## 4. Migration Patterns

### Pattern 1: Simple Rule Conversion

Convert a basic rule with triggers and content:

**Before (.cursor/rules/formatting.mdc):**
```markdown
Applied intelligently: Format code using Prettier
When: *.ts, *.tsx, *.js files
````

**After (.cursor/skills/formatting/SKILL.md):**

```yaml
---
name: formatting
description: >-
  Code formatting standards using Prettier. Use when formatting TypeScript, JavaScript, or other supported file types.


---
```

### Pattern 2: Complex Rule with Examples

Convert a rule with multiple examples and exceptions:

**Before (.cursor/rules/testing.mdc):**

```markdown
Applied intelligently: Write tests before code (TDD) When: _.test.ts, _.spec.ts files Includes: Unit tests, integration tests
```

**After (.cursor/skills/test-driven-development/SKILL.md):**

```yaml
---
name: test-driven-development
description: >-
  Test-driven development workflow. Use when implementing features or fixing bugs to ensure test coverage.


---
```

### Pattern 3: Command Conversion

Convert slash commands to skills:

**Before (.cursor/commands/refactor.md):**

```markdown
# Refactor Command

Usage: /refactor [file]

Refactors the selected code using best practices.
```

**After (.cursor/skills/refactor/SKILL.md):**

```yaml
---
name: refactor
description: >-
  Code refactoring guidance. Use when improving code structure without changing behavior.


triggers:
  - command: "/refactor"
---
```

## 5. Consolidate Related Rules

When multiple rules serve a similar purpose, combine them:

### Consolidation Example

**Before:**

- `.cursor/rules/ts-basics.mdc`
- `.cursor/rules/ts-advanced.mdc`
- `.cursor/rules/ts-types.mdc`

**After:**

- `.cursor/skills/typescript/SKILL.md` (unified)

### Consolidation Criteria

- Same domain (e.g., all TypeScript)
- Similar trigger patterns
- Complementary purposes

## 6. Test the Migration

After converting, verify the skill works:

### Verification Checklist

- [ ] Skill loads without errors
- [ ] Triggers activate correctly
- [ ] Content is accessible
- [ ] Examples work as shown
- [ ] Cross-references are valid

### Testing Commands

```bash
# List available skills
skill --list

# Load a specific skill
skill load typescript-guidance

# Verify skill format
cat .cursor/skills/typescript/SKILL.md | head -20
```

## 7. Update Project Configuration

After migration, update project files:

### Update .cursorrules

```markdown
# .cursorrules

## Skills

Skills are the primary way to get guidance in this project. Use the Skill tool to load skills from .cursor/skills/

## Deprecated

The following are deprecated - use skills instead:

- .cursor/rules/\*.mdc (converted to .cursor/skills/)
- .cursor/commands/\*.md (converted to .cursor/skills/)
```

### Update AGENTS.md

```markdown
## Skills

This project uses Agent Skills for persistent AI guidance.

### Migration Status

- Converted: 15 rules → 5 skills
- Remaining: 3 rules (pending)
- Commands converted: 8 commands → 4 skills

### Using Skills

Use the Skill tool to load skills:

- `skill load typescript-guidance`
- `skill load testing-patterns`
- `skill load code-review`
```

## Advanced Migration Techniques

### Technique 1: Preserve History

Keep track of original rule files for reference:

```bash
# Create archive directory
mkdir -p .cursor/rules-archive/$(date +%Y-%m-%d)

# Move old rules to archive
mv .cursor/rules/*.mdc .cursor/rules-archive/$(date +%Y-%m-%d)/
```

### Technique 2: Add Metadata

Enhance skills with rich metadata:

```yaml
---
name: typescript-guidance
description: >-
  TypeScript coding standards and best practices.


metadata:
  surfaces:
    - cli
    - ide
    - chat
  triggers:
    - pattern: "*.ts"
    - pattern: "*.tsx"
  related_skills:
    - code-review
    - testing-skill
  version: "1.0.0"
  author: "migration-tool"
  created: "2026-04-29"
---
```

### Technique 3: Cross-Reference Skills

Link related skills for better discovery:

```markdown
## Related Skills

- `code-review` - For reviewing TypeScript code
- `create-skill` - For creating new skills
- `validation-skill` - For validation patterns
```

## Common Migration Issues

### Issue: Rule has no clear trigger

**Solution**: Use broad triggers and let the user decide when to activate.

### Issue: Rule content is too specific to one file

**Solution**: Extract the underlying principle, not the specific guidance.

### Issue: Multiple rules have overlapping content

**Solution**: Consolidate into one skill with sections for each original rule.

### Issue: Rule references other rules

**Solution**: Convert to skill cross-references.

## Validation Commands

After migration, run these commands:

```bash
# Verify all skills are valid YAML
find .cursor/skills -name "SKILL.md" -exec python3 -c "import yaml; yaml.safe_load(open('{}').read())" \;

# Check for broken cross-references
grep -r "related_skills" .cursor/skills/ | grep -v "\.md:"

# List all skills
ls -la .cursor/skills/
```

## Best Practices

1. **Start with high-value rules** - Migrate rules that are frequently used
2. **Test each migration** - Verify the skill works before moving on
3. **Preserve documentation** - Keep the original rule content as reference
4. **Use consistent naming** - Follow skill naming conventions
5. **Add cross-references** - Link related skills for discoverability
6. **Version your skills** - Track changes and updates
7. **Validate regularly** - Ensure skills remain valid over time

## Tool Mapping

| Legacy Tool             | Skill Equivalent            |
| ----------------------- | --------------------------- |
| `.cursor/rules/*.mdc`   | `.cursor/skills/*/SKILL.md` |
| `.cursor/commands/*.md` | `.cursor/skills/*/SKILL.md` |
| `Skill` tool            | Native skill loading        |
| Rule triggers           | Skill metadata triggers     |

## Related Skills

- `create-skill` - For creating new skills from scratch
- `create-rule` - For creating new Cursor rules
- `make-skill-template` - For creating skill templates
- `code-review` - For reviewing migrated skills

## Notes

- Always backup original files before migration
- Test skills in a development environment first
- Document any manual adjustments needed
- Keep a changelog of migration decisions
