---
description: Background process manager
applyTo: "**"
lastReviewed: 2026-04-14
---

# Background process manager

I need to run and monitor multiple background processes for a build pipeline:

1. Start a long-running build process tagged as ["build", "critical"] that runs: `npm run build`
2. Start a test runner tagged as ["test", "validation"] that runs: `npm run test`
3. Start a global process tagged as ["lint"] for linting: `npm run lint:fix:all` (should persist across sessions)
4. List all current processes and show me their statuses
5. List only the processes tagged with "critical" or "validation"
6. Kill the test runner process, then list remaining processes
7. Show all currently running processes one more time to verify

Walk me through each step so I can see how the plugin handles concurrent processes, filtering, and termination.
