---
category: planning
source: github-prompts
tags: [project-management, breakdown, agile, features]
date: 2026-05-03
---

# Feature Breakdown & Planning Prompt

Use this prompt to break down features into actionable plans.

## When to Use

- Starting a new feature or epic
- Need to break down complex work into manageable pieces
- Creating implementation plans for the Banking app

## Key Concepts

- **Epic**: Large capability spanning multiple features
- **Feature**: Deliverable user-facing functionality
- **Story**: User-focused requirement delivering value independently
- **Enabler**: Technical infrastructure supporting stories
- **INVEST Criteria**: Independent, Negotiable, Valuable, Estimable, Small, Testable

## Output Format

Create a structured breakdown with:

1. **Feature Summary**: Brief description and business value
2. **User Stories**: Breakdown using "As a [user], I want [goal] so that [benefit]"
3. **Technical Enablers**: Infrastructure or architectural work needed
4. **Dependencies**: What blocks what
5. **Estimates**: Story points (1, 2, 3, 5, 8, 13)
6. **Definition of Done**: Quality gates and completion criteria

## Priority Matrix

| Priority | Value | Criteria |
|----------|-------|----------|
| P0 | Critical | Blocking release |
| P1 | High | Core user-facing |
| P2 | Medium | Important but not blocking |
| P3 | Low | Nice to have, tech debt |

## Example Output Structure

```markdown
# Feature: {Feature Name}

## User Stories
- [ ] Story 1: As a user, I want to... (3 pts)
- [ ] Story 2: As a user, I want to... (5 pts)

## Technical Enablers
- Database schema changes
- API endpoint creation

## Dependencies
- Blocks: {other features}
- Blocked by: {prerequisites}
```

For detailed templates and GitHub automation, see the full prompt in `.github/prompts/breakdown-plan.prompt.md`