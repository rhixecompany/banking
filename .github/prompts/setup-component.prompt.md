---
agent: "architect"
model: Claude Sonnet 4
tools: ["codebase", "githubRepo"]
description: "Generate a new React/Next.js component."
---

Your goal is to generate a new React or Next.js component based on the project’s UI and coding standards. Ask for the component name, props, and usage context if not provided.

- Use shadcn/ui and Tailwind CSS for styling
- Use TypeScript and co-locate tests
- Follow project folder structure and naming conventions
