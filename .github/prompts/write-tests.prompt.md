---
agent: "reviewer"
model: Claude Sonnet 4
tools: ["codebase", "githubRepo"]
description: "Generate unit or E2E tests for a component or module."
---

Your goal is to generate Vitest or Playwright tests for the specified component or module. Ask for the file path and test type if not provided.

- Co-locate tests with code
- Use mocks for external dependencies
- Follow project testing standards
