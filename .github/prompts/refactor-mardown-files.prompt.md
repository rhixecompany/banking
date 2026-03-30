---
agent: "Next.js Expert"
model: "Auto"
tools:
  [
    vscode,
    execute,
    read,
    agent,
    edit,
    search,
    web,
    "github/*",
    browser,
    vscode.mermaid-chat-features/renderMermaidDiagram,
    github.vscode-pull-request-github/issue_fetch,
    github.vscode-pull-request-github/labels_fetch,
    github.vscode-pull-request-github/notification_fetch,
    github.vscode-pull-request-github/doSearch,
    github.vscode-pull-request-github/activePullRequest,
    github.vscode-pull-request-github/pullRequestStatusChecks,
    github.vscode-pull-request-github/openPullRequest,
    todo
  ]
description: "Refactor and update Banking documentation files (`AGENTS.md` and `.github/copilot-instructions.md`) to maximize clarity, actionability, and AI agent productivity, following project conventions and Diátaxis principles."
---

## 1. Task Specification

Analyze, refactor, and update the `AGENTS.md`,`.cursorrules` and `.github/copilot-instructions.md` files in the Banking repository. Ensure all instructions are clear, actionable, and aligned with current project conventions, Diátaxis documentation principles, and markdown best practices. Remove outdated or redundant content, and structure the documentation for maximum utility by both humans and AI agents.

## 2. Context & Variable Requirements

- Project: Banking (Next.js 16, TypeScript, Drizzle ORM, PostgreSQL, NextAuth, shadcn/UI, Tailwind CSS v4)
- Documentation files: `AGENTS.md`,`.cursorrules`, `.github/copilot-instructions.md`,`docs/*.md`,`*.md`
- Reference files: `README.md`, blueprints, `.github/instructions/documentation.instructions.md`, and other instruction files
- All referenced commands, file paths, and code samples must exist and be up-to-date
- Diátaxis documentation structure and Banking-specific standards must be followed

## 3. Detailed Instructions & Standards

1. **Analyze the Target Documentation:**
   - Read the full content of `AGENTS.md`,`.cursorrules` and `.github/copilot-instructions.md`.
   - Identify outdated, redundant, or unclear sections.
   - Cross-reference with authoritative project sources (e.g., `README.md`, blueprints, instruction files).

2. **Refactor for Clarity and Actionability:**
   - Rewrite sections to be concise, actionable, and easy for both humans and AI agents to follow.
   - Use clear headings, bullet points, and code blocks for patterns, commands, and examples.
   - Remove or update any obsolete instructions, references, or links.

3. **Enforce Banking Project Conventions:**
   - Ensure all instructions align with current project architecture, naming conventions, and workflow patterns.
   - Reference file paths and section headings explicitly (e.g., “See `lib/dal/` for DAL patterns”).
   - Use Diátaxis documentation principles: separate how-to guides, reference, explanation, and tutorials.

4. **Optimize for AI Agent Productivity:**
   - Structure content so that AI agents can quickly extract actionable rules and patterns.
   - Highlight critical rules (e.g., “No `any` types”, “No N+1 queries”, “No raw `process.env`”).
   - Use callout blocks for warnings, tips, and critical requirements.

5. **Maintain Consistency and Quality:**
   - Use consistent markdown formatting, heading levels, and code block styles.
   - Ensure all code samples are up-to-date and match the current codebase.
   - Validate that all referenced files, commands, and patterns exist and are correct.

6. **Document Update Process:**
   - At the end of each file, add a “Last Updated” section with the date and a summary of major changes.
   - If major conventions change, update all related documentation and reference sections accordingly.

- **Standards:**
  - Follow the Banking documentation standards in `.github/instructions/documentation.instructions.md`.
  - Adhere to Diátaxis and markdown best practices.
  - Reference authoritative sources by path and section.
  - Prioritize actionable, concise, and context-rich instructions.

## 4. Output Requirements

- Produce fully rewritten versions of `AGENTS.md`,`.cursorrules` and `.github/copilot-instructions.md`, ready for direct commit.
- Use clear, hierarchical headings, bullet points, callout blocks, and code blocks.
- All instructions must be actionable, concise, and unambiguous.
- Add a “Last Updated” section with the current date and summary of major changes.
- Output must pass markdown linting and render correctly in GitHub and VS Code preview.
- All code samples must be syntactically correct and match the current codebase.
- All links and references must resolve to real files or sections.
- Deliver three markdown files: `AGENTS.md`,`.cursorrules` and `.github/copilot-instructions.md`.

## 5. Tool & Capability Requirements

- File system access to read/write `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md`, and reference files.
- Markdown linting and formatting tools (e.g., `markdownlint`).
- Codebase search tools to resolve file paths, section headings, and code samples.
- Date and metadata insertion for “Last Updated” sections.
- Diátaxis and documentation skills, referencing `.github/instructions/documentation.instructions.md`.
- AI agent capabilities for chunked processing, persona-driven prompting, and anti-rate-limiting.
- Optional: Use “documentation-writer” and “refactor” skills if available.

## 6. Technical Configuration

- Use GPT-4.1 or higher.
- Operate in “Documentation Refactorer” persona with Diátaxis expertise.
- Chunk large files for processing; checkpoint after each section.
- Back up original files before overwriting.
- Run `markdownlint`, `npm run validate` for validation.
- Load and apply `.github/instructions/documentation.instructions.md` and other relevant instructions.
- Output must be valid markdown, ready for direct commit.

## 7. Quality & Validation Criteria

- All instructions must be clear, concise, and actionable.
- All references must be accurate and up-to-date.
- Output must pass markdown linting and render correctly.
- All required sections must be present and fully populated.
- Run `npm run validate` to ensure no regressions.
- Adhere to Banking documentation standards and Diátaxis principles.
- Include “Last Updated” and, if needed, “Migration Notes” sections.
- Output must be peer-reviewed and approved before commit.
