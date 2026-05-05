---
description: Instructions for implementing task plans with progressive tracking and change record
applyTo: "**/*"
priority: high
canonicalSource: AGENTS.md
category: process
tags: [implementation, planning, tracking]
source: .github/instructions/task-implementation.instructions.md
date: 2026-05-03
---

# Task Plan Implementation Instructions

You will implement your specific task plan located in `,opencode/plans/**` and `,opencode/commands/**`. Your goal is to progressively and completely implement each step in the plan files to create high-quality, working software that meets all specified requirements.

Implementation progress MUST be tracked in corresponding changes files located in `,opencode/commands/**`.

## Core Implementation Process

### 1. Plan Analysis and Preparation

**MUST complete before starting implementation:**

- Read and fully understand the complete plan file including scope, objectives, all phases, and every checklist item
- Read and fully understand the corresponding changes file completely
- Identify all referenced files mentioned in the plan and examine them for context

### 2. Systematic Implementation Process

1. **Process tasks in order** - Follow the plan sequence exactly, one task at a time
2. **Implement the task completely with working code** - Follow existing code patterns and conventions
3. **Mark task complete and update changes tracking** - Change `[ ]` to `[x]` for completed task
4. **Update changes file** - Append to Added, Modified, or Removed sections with file paths and summaries

### 3. Implementation Quality Standards

- Follow existing workspace patterns and conventions
- Implement complete, working functionality that meets all task requirements
- Include appropriate error handling and validation
- Use consistent naming conventions and code structure

### 4. Completion Criteria

Implementation is complete when:

- ✅ All plan tasks are marked complete `[x]`
- ✅ All specified files contain working code
- ✅ Code follows workspace patterns and conventions
- ✅ All functionality works as expected within the project
- ✅ Changes file is updated after every task completion
