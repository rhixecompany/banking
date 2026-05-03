---
category: planning
source: github-prompts
tags: [implementation, planning, features]
date: 2026-05-03
---

# Create Implementation Plan

Use this to create detailed implementation plans for Banking app features.

## When to Use

- Starting feature implementation
- Creating technical implementation guide
- Planning database, API, and UI work

## Process

1. **Analyze Requirements**: Understand what needs to be built
2. **Identify Components**: Database, API, UI, tests
3. **Break Down Tasks**: Step-by-step implementation tasks
4. **Identify Dependencies**: What needs to happen first
5. **Define Success Criteria**: How to know it's done

## Template Structure

```markdown
# Implementation Plan: {Feature Name}

## Overview
{Brief description of what this feature does}

## Components

### Database
- Schema changes needed
- Migrations required

### API / Server Actions
- New actions or modified
- Input validation

### UI Components
- New components
- Modified components

### Tests
- Unit tests needed
- E2E tests needed

## Implementation Steps

1. Step 1: {description}
2. Step 2: {description}

## Dependencies
- Depends on: {other features}
- Blocks: {downstream work}

## Success Criteria
- [ ] Criteria 1
- [ ] Criteria 2
```

## Best Practices

- Use Server Actions for mutations (not API routes)
- Use DAL helpers for database access
- Follow the patterns in AGENTS.md
- Include validation with Zod

For full templates, see `.github/prompts/create-implementation-plan.prompt.md`