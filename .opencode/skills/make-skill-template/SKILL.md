---
name: make-skill-template
description: 'Create new Agent Skills for GitHub Copilot from prompts or by duplicating this template. Use when asked to "create a skill", "make a new skill", "scaffold a skill", or when building specialized AI capabilities with bundled resources. Generates SKILL.md files with proper frontmatter, directory structure, and optional scripts/references/assets folders.'
lastReviewed: 2026-04-29
applyTo: "**/*"
platforms:
  - opencode
  - cursor
  - copilot
---

## Agent Support

| Agent | Integration | Usage |
| --- | --- | --- |
| **OpenCode** | Native `skill` tool | `skill load make-skill-template` |
| **Cursor** | @mention or `.cursorrules` | `@make-skill-template create new skill` |
| **Copilot** | `/make-skill` command | `/make-skill create workflow-skill` |

## When to Use This Skill

# Make Skill Template

A meta-skill for creating new Agent Skills. Use this skill when you need to scaffold a new skill folder, generate a SKILL.md file, or help users understand the Agent Skills specification.

## When to Use This Skill

- User asks to "create a skill", "make a new skill", or "scaffold a skill"
- User wants to add a specialized capability to their GitHub Copilot setup
- User needs help structuring a skill with bundled resources
- User wants to duplicate this template as a starting point

## Prerequisites

- Understanding of what the skill should accomplish
- A clear, keyword-rich description of capabilities and triggers
- Knowledge of any bundled resources needed (scripts, references, assets, templates)

## Creating a New Skill

### Step 1: Create the Skill Directory

Create a new folder with a lowercase, hyphenated name:

```
skills/<skill-name>/
└── SKILL.md          # Required
```

### Step 2: Generate SKILL.md with Frontmatter

Every skill requires YAML frontmatter with `name` and `description`:

```yaml
---
name: <skill-name>
description: "<What it does>. Use when <specific triggers, scenarios, keywords users might say>."
---
```

#### Frontmatter Field Requirements

| Field | Required | Constraints |
| --- | --- | --- |
| `name` | **Yes** | 1-64 chars, lowercase letters/numbers/hyphens only, must match folder name |
| `description` | **Yes** | 1-1024 chars, must describe WHAT it does AND WHEN to use it |
| `license` | No | License name or reference to bundled LICENSE.txt |
| `compatibility` | No | 1-500 chars, environment requirements if needed |
| `metadata` | No | Key-value pairs for additional properties |
| `allowed-tools` | No | Space-delimited list of pre-approved tools (experimental) |

#### Description Best Practices

**CRITICAL**: The `description` is the PRIMARY mechanism for automatic skill discovery. Include:

1. **WHAT** the skill does (capabilities)
2. **WHEN** to use it (triggers, scenarios, file types)
3. **Keywords** users might mention in prompts

**Good example:**

```yaml
description: "Toolkit for testing local web applications using Playwright. Use when asked to verify frontend functionality, debug UI behavior, capture browser screenshots, or view browser console logs. Supports Chrome, Firefox, and WebKit."
```

**Poor example:**

```yaml
description: "Web testing helpers"
```

### Step 3: Write the Skill Body

After the frontmatter, add markdown instructions. Recommended sections:

| Section                     | Purpose                         |
| --------------------------- | ------------------------------- |
| `# Title`                   | Brief overview                  |
| `## When to Use This Skill` | Reinforces description triggers |
| `## Prerequisites`          | Required tools, dependencies    |
| `## Step-by-Step Workflows` | Numbered steps for tasks        |
| `## Troubleshooting`        | Common issues and solutions     |
| `## References`             | Links to bundled docs           |

### Step 4: Add Optional Directories (If Needed)

| Folder | Purpose | When to Use |
| --- | --- | --- |
| `scripts/` | Executable code (Python, Bash, JS) | Automation that performs operations |
| `references/` | Documentation agent reads | API references, schemas, guides |
| `assets/` | Static files used AS-IS | Images, fonts, templates |
| `templates/` | Starter code agent modifies | Scaffolds to extend |

## Example: Complete Skill Structure

```
my-awesome-skill/
├── SKILL.md                    # Required instructions
├── LICENSE.txt                 # Optional license file
├── scripts/
│   └── helper.py               # Executable automation
├── references/
│   ├── api-reference.md        # Detailed docs
│   └── examples.md             # Usage examples
├── assets/
│   └── diagram.png             # Static resources
└── templates/
    └── starter.ts              # Code scaffold
```

## Quick Start: Duplicate This Template

1. Copy the `make-skill-template/` folder
2. Rename to your skill name (lowercase, hyphens)
3. Update `SKILL.md`:
   - Change `name:` to match folder name
   - Write a keyword-rich `description:`
   - Replace body content with your instructions
4. Add bundled resources as needed
5. Validate with `bun run skill:validate`

## Validation Checklist

- [ ] Folder name is lowercase with hyphens
- [ ] `name` field matches folder name exactly
- [ ] `description` is 10-1024 characters
- [ ] `description` explains WHAT and WHEN
- [ ] `description` is wrapped in single quotes
- [ ] Body content is under 500 lines
- [ ] Bundled assets are under 5MB each

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Skill not discovered | Improve description with more keywords and triggers |
| Validation fails on name | Ensure lowercase, no consecutive hyphens, matches folder |
| Description too short | Add capabilities, triggers, and keywords |
| Assets not found | Use relative paths from skill root |

## Advanced: Skill Categories

Skills can be categorized by their purpose:

### Category 1: Process Skills

Guide HOW to approach tasks (workflow enforcement):

- brainstorming, debugging, TDD, code-review
- Characteristics: Rigid, enforce specific workflows

### Category 2: Implementation Skills

Guide WHAT to build (domain-specific):

- frontend-philosophy, db-skill, auth-skill
- Characteristics: Flexible, adapt to context

### Category 3: Tool Skills

Provide access to external capabilities:

- agent-browser, shadcn, gh-cli
- Characteristics: Enable specific tool usage

### Category 4: Meta Skills

Create other skills or manage agent behavior:

- make-skill-template, create-rule, create-hook
- Characteristics: Recursive, build agent infrastructure

## Advanced: Frontmatter Field Deep Dive

### name Field

```yaml
name: my-awesome-skill
```

- Must match folder name exactly (case-sensitive)
- Used for skill discovery and invocation
- 1-64 characters: lowercase letters, numbers, hyphens
- No consecutive hyphens, no leading/trailing hyphens

### description Field

The most critical field for skill discovery. Structure:

```
"<What it does>. Use when <specific triggers, scenarios, keywords users might say>."
```

**Components:**

1. **What it does** (1-2 sentences): Core capability
2. **When to use** (1-3 sentences): Triggers, scenarios, keywords

**Trigger Patterns:**

- Direct requests: "Use when asked to..."
- Context triggers: "Use when working with..."
- File triggers: "Use when editing \*.tsx files"
- Command triggers: "Use with /command-name"

### allowed-tools Field (Experimental)

```yaml
allowed-tools: Bash(npm run *), Bash(git *), Read
```

- Space-delimited list of tool permissions
- Format: `ToolName(pattern)` or just `ToolName`
- Supports glob patterns for command matching

### metadata Field

```yaml
metadata:
  version: "1.0.0"
  author: "team@example.com"
  tags: [ui, component, frontend]
  requires-env:
    - NODE_VERSION
    - API_KEY
```

## Advanced: Writing Effective Skill Content

### Section: Title

```markdown
# Skill Name

Brief one-line description of what this skill provides.
```

### Section: When to Use This Skill

```markdown
## When to Use This Skill

Use this skill when:

- User asks to [specific action]
- Working with [specific file types/technologies]
- Need to [specific outcome]

Do NOT use when:

- [contrary scenarios]
```

### Section: Prerequisites

```markdown
## Prerequisites

Before using this skill, ensure:

- [ ] Tool X is installed
- [ ] Environment variables are configured
- [ ] Access to resource Y is available

Required knowledge:

- Basic understanding of [technology]
- Familiarity with [pattern]
```

### Section: Step-by-Step Workflows

````markdown
## Step-by-Step Workflows

### Workflow 1: [Name]

For [scenario], follow these steps:

**Step 1: [Action]** Description of what to do and why.

**Step 2: [Action]** Description with code example:

```typescript
// Example code here
```
````

**Verification:**

- [ ] Check that [expected outcome]
- [ ] Confirm [validation point]

````

### Section: Troubleshooting
```markdown
## Troubleshooting

### Issue: [Problem Description]

**Symptoms:** What user sees
**Cause:** Why it happens
**Solution:** How to fix it

### Issue: [Another Problem]

**Symptoms:** ...
**Cause:** ...
**Solution:** ...
````

### Section: References

```markdown
## References

- [Related Skill](./other-skill)
- [API Documentation](./references/api-docs.md)
- [External Resource](https://example.com)
```

## Advanced: Skill Composition Patterns

### Pattern 1: Skill Chaining

One skill invokes another:

```markdown
This skill builds on [other-skill]. After completing Step 3, use the other-skill for additional processing.
```

### Pattern 2: Skill Delegation

Skill defers to specialized skill:

```markdown
For [edge case], use [specialized-skill] instead.
```

### Pattern 3: Skill Prerequisites

Skill requires another skill to be loaded first:

```markdown
Prerequisite: Load [prerequisite-skill] for core functionality. This skill extends it with [specific capability].
```

## Advanced: Validation and Testing

### Local Validation

```bash
# Validate skill structure
bun run skill:validate

# Check description keyword density
grep -o "when\|use\|asked\|working" SKILL.md | wc -l
```

### Testing a New Skill

1. Create minimal SKILL.md
2. Test with: `skill load <skill-name>`
3. Verify triggers work
4. Add bundled resources incrementally
5. Document in references/

### Common Validation Errors

| Error | Cause | Fix |
| --- | --- | --- |
| "name must match folder" | Mismatch between folder and name field | Ensure exact match |
| "description too short" | Less than 10 characters | Add more triggers/keywords |
| "invalid frontmatter" | YAML syntax error | Validate YAML structure |
| "missing required section" | Body lacks required sections | Add missing sections |

## Advanced: Bundled Resources

### scripts/ Directory

Executables that the skill can run:

```
scripts/
├── setup.sh           # Initialization script
├── helper.py          # Python automation
└── generate.js       # Code generation
```

**Requirements:**

- Must be executable (chmod +x on Unix)
- Should have proper shebang
- Return meaningful exit codes

### references/ Directory

Documentation for the agent to read:

```
references/
├── api-reference.md   # API documentation
├── patterns.md        # Pattern catalog
└── examples.md        # Usage examples
```

**Guidelines:**

- Use clear headings and code blocks
- Include real examples from project
- Keep under 10,000 lines per file

### assets/ Directory

Static files used as-is:

```
assets/
├── diagram.png        # Architecture diagram
├── template.svg       # SVG template
└── config.json       # Default configuration
```

**Guidelines:**

- Keep files under 5MB each
- Use standard formats (PNG, SVG, JSON)
- Reference with relative paths

### templates/ Directory

Starter code that gets modified:

```
templates/
├── component.tsx     # React component scaffold
├── test.spec.ts      # Test template
└── config.yaml       # Config template
```

**Guidelines:**

- Include placeholder comments `[TODO: fill in]`
- Provide sensible defaults
- Document required modifications

## Best Practices

1. **Description is King**: Invest time in crafting a keyword-rich description
2. **Consistent Naming**: Use lowercase, hyphens, descriptive names
3. **Comprehensive Triggers**: Include all scenarios where skill should activate
4. **Test Edge Cases**: Document what NOT to use the skill for
5. **Version Your Skills**: Use semantic versioning in metadata
6. **Document Dependencies**: Clearly state prerequisite skills
7. **Provide Examples**: Real code examples beat abstract descriptions
8. **Keep It Focused**: One skill = one capability, avoid scope creep
9. **Iterate Based on Usage**: Track which triggers work, refine over time

## Anti-Patterns to Avoid

1. **Generic descriptions**: "Helper for tasks" - too vague
2. **Missing triggers**: No keywords for discovery
3. **Overlapping scopes**: Two skills doing similar things
4. **No prerequisites**: Assuming user knows what to do
5. **No troubleshooting**: Leaving users stuck on errors
6. **Outdated content**: Not updating when tools/patterns change

## References

- Agent Skills official spec: <https://agentskills.io/specification>
- Example skills: See `.opencode/skills/` directory
- create-skill: For writing comprehensive skill content
