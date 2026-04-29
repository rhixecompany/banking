---
name: create-rule
description: >-
  Create Cursor rules for persistent AI guidance. Use when you want to create a rule, add coding standards, set up project conventions, configure file-specific patterns, create RULE.md files, or asks about .cursor/rules/ or AGENTS.md.
lastReviewed: 2026-04-29
applyTo: "**/*.{ts,tsx,md}"
agents:
  - opencode
  - cursor
  - copilot
minLines: 300
---

# Creating Cursor Rules

## Agent Support

| Agent | Integration | Usage |
|-------|-------------|-------|
| **OpenCode** | Direct skill invocation | `skill("create-rule")` when creating rules |
| **Cursor** | `.cursorrules` reference | Add to project rules for rule config |
| **Copilot** | `.github/copilot-instructions.md` | Reference for rule patterns |

### OpenCode Usage
```
# When creating project rules
Use create-rule to structure .mdc files in .cursor/rules/.

# When setting file-specific patterns
Load create-rule for glob patterns and frontmatter.
```

### Cursor Integration
```json
// .cursorrules - Add rule patterns
{
  "rules": {
    "rulesDir": ".cursor/rules",
    "requireFrontmatter": true,
    "maxLines": 500
  }
}
```

### Copilot Integration
```markdown
<!-- .github/copilot-instructions.md -->
## Cursor Rules Patterns

When creating project rules:
- Format: .mdc files with YAML frontmatter
- Fields: description, globs, alwaysApply
- Globs: **/*.ts, **/*.tsx for file-specific rules
- Keep under 500 lines

See skills/create-rule for full format guide.
```

---

Create project rules in `.cursor/rules/` to provide persistent context for the AI agent.

## When to Use This Skill

- User asks to "create a rule" or "add a rule"
- Setting up coding standards for a project
- Configuring file-specific patterns
- Creating project conventions
- User asks about `.cursor/rules/` or AGENTS.md
- Need persistent AI guidance for specific file types

## Gather Requirements

Before creating a rule, determine:

1. **Purpose**: What should this rule enforce or teach?
2. **Scope**: Should it always apply, or only for specific files?
3. **File patterns**: If file-specific, which glob patterns?

### Inferring from Context

If you have previous conversation context, infer rules from what was discussed. You can create multiple rules if the conversation covers distinct topics or patterns. Don't ask redundant questions if the context already provides the answers.

### Required Questions

If the user hasn't specified scope, ask:

- "Should this rule always apply, or only when working with specific files?"

If they mentioned specific files and haven't provided concrete patterns, ask:

- "Which file patterns should this rule apply to?" (e.g., `**/*.ts`, `backend/**/*.py`)

It's very important that we get clarity on the file patterns.

Use the AskQuestion tool when available to gather this efficiently.

---

## Rule File Format

Rules are `.mdc` files in `.cursor/rules/` with YAML frontmatter:

```
.cursor/rules/
  typescript-standards.mdc
  react-patterns.mdc
  api-conventions.mdc
```

### File Structure

```markdown
---
description: Brief description of what this rule does
globs: **/*.ts  # File pattern for file-specific rules
alwaysApply: false  # Set to true if rule should always apply
---

# Rule Title

Your rule content here...
```

### Frontmatter Fields

| Field | Type | Description |
| --- | --- | --- |
| `description` | string | What the rule does (shown in rule picker) |
| `globs` | string | File pattern - rule applies when matching files are open |
| `alwaysApply` | boolean | If true, applies to every session |

### Glob Pattern Examples

| Pattern | Matches | Doesn't Match |
|---------|---------|---------------|
| `**/*.ts` | All TypeScript files | .js, .tsx files |
| `**/*.tsx` | React component files | Plain .ts files |
| `src/**/*.ts` | TypeScript in src folder | Files outside src |
| `**/components/**` | Files in any components folder | Files outside components |
| `*.config.ts` | Config files in root only | Config files in subfolders |

---

## Rule Configurations

### Always Apply

For universal standards that should apply to every conversation:

```yaml
---
description: Core coding standards for the project
alwaysApply: true
---
```

Use this for:
- General coding standards
- Git conventions
- Documentation requirements
- Security guidelines

### Apply to Specific Files

For rules that apply when working with certain file types:

```yaml
---
description: TypeScript conventions for this project
globs: **/*.ts
alwaysApply: false
---
```

Use this for:
- Language-specific standards
- Framework conventions
- File-type-specific patterns

### Multiple Globs

You can combine multiple patterns:

```yaml
---
description: Frontend best practices
globs: "**/*.{ts,tsx}"
alwaysApply: false
---
```

---

## Rule Content Best Practices

### Structure Your Content

Organize rule content logically:

```markdown
# Rule Title

## Overview
Brief description of what this rule covers.

## Key Principles
- Principle 1
- Principle 2
- Principle 3

## Examples

### Good Example
\`\`\`typescript
// Code here
\`\`\`

### Bad Example
\`\`\`typescript
// Code here
\`\`\`

## Common Mistakes
- Mistake 1
- Mistake 2
```

### Writing Effective Rules

**DO:**
- Keep content under 500 lines
- Use clear, actionable language
- Provide concrete examples
- Include before/after comparisons
- Focus on one concern per rule

**DON'T:**
- Write essays - be concise
- Include vague guidelines
- Skip examples
- Duplicate AGENTS.md content
- Make rules too complex

---

## Example Rules

### TypeScript Standards

```markdown
---
description: TypeScript coding standards
globs: **/*.ts
alwaysApply: false
---

# TypeScript Standards

## Error Handling

Always include context in error messages:

\`\`\`typescript
// ❌ BAD
try {
  await fetchData();
} catch (e) {
  throw new Error("Failed");
}

// ✅ GOOD
try {
  await fetchData();
} catch (e) {
  throw new Error(\`Failed to fetch user data: \${e.message}\`, { cause: e });
}
\`\`\`

## Type Safety

Avoid `any` - use proper types:

\`\`\`typescript
// ❌ BAD
function process(data: any): any { ... }

// ✅ GOOD
interface UserData {
  id: string;
  name: string;
}
function process(data: UserData): string { ... }
\`\`\`
```

### React Patterns

```markdown
---
description: React component patterns
globs: **/*.tsx
alwaysApply: false
---

# React Patterns

## Component Structure

Use functional components with explicit prop types:

\`\`\`typescript
// ✅ GOOD
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button className={variant}>{label}</button>;
}
\`\`\`

## State Management

Prefer useState for simple state, useReducer for complex state:

\`\`\`typescript
// Simple state - useState
const [count, setCount] = useState(0);

// Complex state - useReducer
const [state, dispatch] = useReducer(reducer, initialState);
\`\`\`

## Custom Hooks

Extract reusable logic into custom hooks:

\`\`\`typescript
// ✅ GOOD
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  return user;
}
\`\`\`
```

### API Conventions

```markdown
---
description: API endpoint conventions
globs: "**/api/**/*.ts"
alwaysApply: false
---

# API Conventions

## Response Format

Always return consistent response structure:

\`\`\`typescript
// ✅ GOOD
function json<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

function error(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}
\`\`\`

## Error Handling

Don't leak internal details in errors:

\`\`\`typescript
// ❌ BAD - exposes internal details
catch (e) {
  return error(e.stack);  // Security risk!
}

// ✅ GOOD - user-friendly message
catch (e) {
  console.error(e);  // Log internally
  return error("An unexpected error occurred");
}
\`\`\`
```

---

## Advanced Patterns

### Rule Dependencies

Rules can reference each other:

```markdown
---
description: Testing patterns
globs: "**/*.test.ts"
alwaysApply: false
---

# Testing Patterns

This rule complements the TypeScript standards rule.
When writing tests, follow both this rule and the TypeScript standards.
```

### Combining with AGENTS.md

Rules should complement, not duplicate AGENTS.md:

- AGENTS.md = project-wide conventions
- Rules = specific patterns for file types

```markdown
---
description: Component testing patterns
globs: "**/*.test.tsx"
alwaysApply: false
---

# Component Testing

This rule supplements AGENTS.md with React Testing Library patterns.
See AGENTS.md for general testing requirements.
```

---

## Multi-Agent Support

### OpenCode

When using OpenCode, rules from `.cursor/rules/` are automatically loaded when editing matching files. OpenCode respects the rule patterns and provides context-aware suggestions.

### Cursor

Cursor IDE provides:
- Rule picker in the AI panel
- Automatic rule loading based on file type
- Real-time rule suggestions

### Copilot

GitHub Copilot respects project rules when:
- Editing files that match glob patterns
- Generating code that follows rule conventions
- Providing context-aware suggestions

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Rule not loading | Check file is `.mdc` format in `.cursor/rules/` |
| Rule not applying | Verify glob pattern matches the file |
| Rule conflicting with another | Split into separate rules or adjust scope |
| Rule too long | Split into multiple focused rules |
| Multi-agent not working | Ensure `agents` field in frontmatter includes target agent |

### Common Issues

#### 1. Rule not showing in picker

**Problem:** Created rule doesn't appear in Cursor rule picker.

**Solution:**
- Verify file extension is `.mdc` not `.md`
- Check frontmatter has valid `description` field
- Ensure file is in `.cursor/rules/` directory

#### 2. Glob pattern not matching

**Problem:** Rule doesn't apply to expected files.

**Solution:**
- Test glob pattern with online glob tester
- Ensure pattern uses forward slashes
- Check for typos in pattern

#### 3. Rule conflicts with another

**Problem:** Two rules provide conflicting guidance.

**Solution:**
- Merge into single comprehensive rule
- Adjust scope/globs to avoid overlap
- Use `alwaysApply: false` for more specific rules

#### 4. Content too long

**Problem:** Rule exceeds 500 lines, hard to maintain.

**Solution:**
- Split into multiple focused rules
- Use references to external documentation
- Focus on most important patterns only

---

## Checklist

- [ ] File is `.mdc` format in `.cursor/rules/`
- [ ] Frontmatter configured correctly (description, globs, alwaysApply)
- [ ] Content under 500 lines
- [ ] Includes concrete examples
- [ ] Doesn't duplicate AGENTS.md content
- [ ] Glob pattern correctly matches target files
- [ ] Multi-agent support configured (agents field in frontmatter)
- [ ] Cross-references to related skills included

---

## Related Skills

- [create-hook](./create-hook) - For event-based automation
- [AGENTS.md](../AGENTS.md) - Project-wide conventions
- [make-skill-template](./make-skill-template) - For creating new skills
- [create-skill](./create-skill) - For creating comprehensive skills
- [create-subagent](./create-subagent) - For custom subagent creation

## Validation

Run: `bun run format` to ensure markdown is properly formatted.

Verify rules load correctly by opening matching files in Cursor.