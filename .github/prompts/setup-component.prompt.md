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
description: "Generate a new React/Next.js component."
---

Your goal is to generate a new React or Next.js component based on the project’s UI and coding standards. Ask for the component name, props, and usage context if not provided.

- Use shadcn/ui and Tailwind CSS for styling
- Use TypeScript and co-locate tests
- Follow project folder structure and naming conventions
