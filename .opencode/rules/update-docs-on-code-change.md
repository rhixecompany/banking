---
description: Automatically update README.md and documentation files when application code changes require documentation updates
applyTo: "**/*.{md,js,mjs,cjs,ts,tsx,jsx,py,java,cs,go,rb,php,rs,cpp,c,h,hpp}"
category: documentation
tags: [docs, readme, maintenance]
source: .github/instructions/update-docs-on-code-change.instructions.md
date: 2026-05-03
---

# Update Documentation on Code Change

## When to Update Documentation

### Trigger Conditions

Automatically check if documentation updates are needed when:

- New features or functionality are added
- API endpoints, methods, or interfaces change
- Breaking changes are introduced
- Dependencies or requirements change
- Configuration options or environment variables are modified
- Installation or setup procedures change
- Command-line interfaces or scripts are updated
- Code examples in documentation become outdated

## Documentation Update Rules

### README.md Updates

**Always update README.md when:**

- Adding new features or capabilities
- Modifying installation or setup process
- Adding new CLI commands or options
- Changing configuration options

### Best Practices

- ✅ Update documentation in the same commit as code changes
- ✅ Include before/after examples for changes
- ✅ Test code examples before committing
- ✅ Use consistent formatting and terminology
- ✅ Document limitations and edge cases

- ❌ Commit code changes without updating documentation
- ❌ Leave outdated examples in documentation
- ❌ Document features that don't exist yet
