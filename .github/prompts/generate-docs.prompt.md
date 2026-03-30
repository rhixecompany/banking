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
description: "Generate documentation for code or APIs."
---

Your goal is to generate Markdown documentation for the specified code, component, or API. Ask for the file path and documentation scope if not provided.

- Follow project documentation standards
