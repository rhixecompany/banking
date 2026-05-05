---
plan name: session-logger-hook
plan description: Integrate session-logger skill hooks
plan status: done
---

## Idea

Add a session start hook to log session details and user prompts for audit and analytics

## Implementation

- 1. Review session-logger skill files to understand existing hooks.json configuration
- 2. Resolve path discrepancy: hooks.json points to .github/hooks/session-logger/ but skill files are in .opencode/skills/session-logger/
- 3. Create the hook scripts directory at .github/hooks/session-logger/ and copy shell scripts from the skill
- 4. Update hooks.json with any necessary fixes (file paths, env vars)
- 5. Test the session logging: run npm install && npm run dev to trigger sessionStart hook
- 6. Verify logs appear in logs/opencode/session.log and logs/opencode/prompts.log
- 7. Add logs/ to .gitignore to prevent committing session data
- 8. Document the hook integration in a README under .opencode/skills/session-logger/HOOK-SETUP.md

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
