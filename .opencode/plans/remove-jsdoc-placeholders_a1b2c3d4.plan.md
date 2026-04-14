# Plan: Remove placeholder JSDoc lines

Summary

- There are many generated placeholder JSDoc lines across scripts/, .opencode/, and tests/fixtures containing the literal text "Description placeholder" and repetitive "@author Adminbot" tags.
- These placeholders add noise, inflate diffs, and can trigger lint/type churn. We will remove placeholder-only lines while preserving meaningful annotations.

Scope

- Target directories: scripts/, .opencode/, tests/fixtures
- Match: lines containing exactly the phrase "Description placeholder" (including leading `* `) and immediately adjacent `* @author Adminbot` lines.
- Do NOT change other JSDoc tags that contain useful content (e.g., @param, @returns, @type with real types).

Proposed Changes

- For each JSDoc block, remove any lines that are exactly:
  - ` * Description placeholder`
  - ` * @author Adminbot` when it is adjacent to a placeholder and contains no other content.

Rationale

- Small, focused edits that reduce noise while preserving useful doc comments.
- Limits risk by only removing exact placeholder lines; we avoid altering real documentation or types.

Estimated Impact

- Number of matches found (preliminary): 1793 occurrences across the scoped directories.
- This will touch many files; per repo rules we must record the plan before performing the edits.

Next Steps

1. Review this plan.
2. If approved, I will apply the edits in a single patch that removes the exact placeholder lines.
3. After applying, run: `npm run format && npm run type-check && npm run lint:strict` and report any issues.

Example Patch (representative snippet) **_ Begin Example _** Update File: scripts/utils/io.ts @@ -/\*\*

- - Description placeholder
- - @author Adminbot
- -
- - @export
- - @interface IoOptions
- \*/ +/\*\*

* - IO helper options
* -
* - @export
* - @interface IoOptions
* \*/ \*\*\* End Example

If you'd like a more aggressive clean (remove other placeholder tokens like "TBD", "TODO", or single-word "Placeholder"), tell me and I'll expand the plan accordingly.
