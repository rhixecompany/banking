---
description: Code review standards for the Banking project
applyTo: "**/*"
priority: medium
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
category: process
tags: [code-review, standards]
source: .github/instructions/code-review.instructions.md
date: 2026-05-03
---

# Code Review Standards

- Focus on correctness, security, and high-risk logic (auth, payments, DB).
- Prefer small PRs with a single purpose.
- Ensure tests exist for new behaviors and CI passes.
- Leave actionable, specific comments and request changes for unclear logic.
- Maintain provenance: note files read and reason in PR body for automated changes.