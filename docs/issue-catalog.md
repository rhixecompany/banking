# Issue Catalog

This file lists validation failures discovered during the validation step (produced after validation runs).

Format:

- Title: Short description
- Severity: Critical | High | Medium | Low
- Files: path:line
- Description: Details
- Suggested Fix: Recommendation
- Owner: Person/team

Example (auto-generated if needed):

- Title: TypeScript errors in src/components/foo.tsx
- Severity: High
- Files: src/components/foo.tsx:123
- Description: Missing return type and unexpected any
- Suggested Fix: Add explicit return type and remove any; use unknown + type guard
- Owner: @team
