---
name: prd
description: Generate high-quality Product Requirements Documents (PRDs) including user stories, technical specs, and risk analysis.
license: MIT
lastReviewed: 2026-04-29
applyTo: "docs/**"
platforms:
  - opencode
  - cursor
  - copilot
---

# Product Requirements Document (PRD)

## Overview

Design comprehensive, production-grade Product Requirements Documents (PRDs) that bridge the gap between business vision and technical execution. This skill works for modern software systems, ensuring that requirements are clearly defined.

## When to Use

Use this skill when:

- Starting a new product or feature development cycle
- Translating a vague idea into a concrete technical specification
- Defining requirements for AI-powered features
- Stakeholders need a unified "source of truth" for project scope
- User asks to "write a PRD", "document requirements", or "plan a feature"

---

## Operational Workflow

### Phase 1: Discovery (The Interview)

Before writing a single line of the PRD, you **MUST** interrogate the user to fill knowledge gaps. Do not assume context.

**Ask about:**

- **The Core Problem**: Why are we building this now?
- **Success Metrics**: How do we know it worked?
- **Constraints**: Budget, tech stack, or deadline?

### Phase 2: Analysis & Scoping

Synthesize the user's input. Identify dependencies and hidden complexities.

- Map out the **User Flow**.
- Define **Non-Goals** to protect the timeline.

### Phase 3: Technical Drafting

Generate the document using the **Strict PRD Schema** below.

---

## PRD Quality Standards

### Requirements Quality

Use concrete, measurable criteria. Avoid "fast", "easy", or "intuitive".

```diff
# Vague (BAD)
- The search should be fast and return relevant results.
- The UI must look modern and be easy to use.

# Concrete (GOOD)
+ The search must return results within 200ms for a 10k record dataset.
+ The search algorithm must achieve >= 85% Precision@10 in benchmark evals.
+ The UI must follow the 'Vercel/Next.js' design system and achieve 100% Lighthouse Accessibility score.
```

---

## Strict PRD Schema

You **MUST** follow this exact structure for the output:

### 1. Executive Summary

- **Problem Statement**: 1-2 sentences on the pain point.
- **Proposed Solution**: 1-2 sentences on the fix.
- **Success Criteria**: 3-5 measurable KPIs.

### 2. User Experience & Functionality

- **User Personas**: Who is this for?
- **User Stories**: `As a [user], I want to [action] so that [benefit].`
- **Acceptance Criteria**: Bulleted list of "Done" definitions for each story.
- **Non-Goals**: What are we NOT building?

### 3. AI System Requirements (If Applicable)

- **Tool Requirements**: What tools and APIs are needed?
- **Evaluation Strategy**: How to measure output quality and accuracy.

### 4. Technical Specifications

- **Architecture Overview**: Data flow and component interaction.
- **Integration Points**: APIs, DBs, and Auth.
- **Security & Privacy**: Data handling and compliance.

### 5. Risks & Roadmap

- **Phased Rollout**: MVP -> v1.1 -> v2.0.
- **Technical Risks**: Latency, cost, or dependency failures.

---

## Implementation Guidelines

### DO (Always)

- **Define Testing**: For AI systems, specify how to test and validate output quality.
- **Iterate**: Present a draft and ask for feedback on specific sections.

### DON'T (Avoid)

- **Skip Discovery**: Never write a PRD without asking at least 2 clarifying questions first.
- **Hallucinate Constraints**: If the user didn't specify a tech stack, ask or label it as `TBD`.

---

## Example: Intelligent Search System

### 1. Executive Summary

**Problem**: Users struggle to find specific documentation snippets in massive repositories. **Solution**: An intelligent search system that provides direct answers with source citations. **Success**:

- Reduce search time by 50%.
- Citation accuracy >= 95%.

### 2. User Stories

- **Story**: As a developer, I want to ask natural language questions so I don't have to guess keywords.
- **AC**:
  - Supports multi-turn clarification.
  - Returns code blocks with "Copy" button.

### 3. AI System Architecture

- **Tools Required**: `codesearch`, `grep`, `webfetch`.

### 4. Evaluation

- **Benchmark**: Test with 50 common developer questions.
- **Pass Rate**: 90% must match expected citations.

---

## Multi-Agent Support

### OpenCode

In OpenCode, use the PRD skill when:

- Creating documentation for new features
- Planning technical implementations
- Defining acceptance criteria for complex features

```bash
# Example: Ask OpenCode to generate a PRD
Create a PRD for a new payment processing feature that integrates with Stripe.
Include user stories, technical requirements, and success metrics.
```

### Cursor

In Cursor IDE:

- Use with `.cursorrules` for project-specific requirements
- Integrate with code generation for feature planning
- Link PRDs to implementation tasks

```json
// .cursorrules - PRD integration
{
  "features": {
    "requirePRD": true,
    "prdTemplate": "strict"
  }
}
```

### GitHub Copilot

In Copilot CLI or Copilot Chat:

- Reference PRDs for context-aware code generation
- Use user stories to guide implementation suggestions

```bash
# Example: Copilot prompt
Based on the PRD for the checkout feature, generate the API endpoints
for processing payments and handling webhooks.
```

---

## Cross-References

This skill works well with:

| Related Skill | Use Case |
| --- | --- |
| `meeting-minutes` | Capture requirements from stakeholder meetings |
| `refactor` | Improve PRD-specified features during implementation |
| `validation-skill` | Validate acceptance criteria are testable |
| `testing-skill` | Plan test strategies based on PRD requirements |

---

## Troubleshooting

| Issue | Solution |
| --- | --- |
| User provides vague requirements | Ask clarifying questions: "What problem does this solve?", "Who are the users?", "What defines success?" |
| Scope creep in PRD | Clearly define Non-Goals section; use MoSCoW method (Must/Should/Could/Won't) |
| Technical details missing | Mark as `TBD` and suggest specific technical investigations |
| Success metrics undefined | Work backward from business goals: "How do we know this succeeded?" |
| PRD too long | Focus on MVP first; defer v2.0 details to separate documents |

---

## Best Practices

### Writing Effective PRDs

1. **Start with the problem, not the solution** - Understand why you're building something before defining what to build.

2. **Make metrics measurable** - "Improve user experience" is not a metric. "Reduce checkout abandonment by 15%" is.

3. **Keep user stories independent** - Each story should deliver value without depending on other stories.

4. **Define acceptance criteria as tests** - Write AC that can be verified automatically or manually.

5. **Review with stakeholders** - PRD is a contract between business and engineering; both must agree.

### PRD Review Checklist

- [ ] Problem statement is clear and specific
- [ ] Success criteria are measurable (numeric thresholds)
- [ ] User personas are defined and realistic
- [ ] User stories follow the template: As a... I want... So that...
- [ ] Acceptance criteria are testable
- [ ] Non-Goals explicitly exclude out-of-scope items
- [ ] Technical requirements are feasible
- [ ] Risks are identified with mitigation plans
- [ ] Roadmap has clear phases with milestones
- [ ] Dependencies are documented

---

## Notes

- PRDs should be living documents - update as understanding evolves
- For AI features, always include evaluation criteria
- Link PRDs to implementation plans and test strategies
- Store PRDs in version control alongside code
