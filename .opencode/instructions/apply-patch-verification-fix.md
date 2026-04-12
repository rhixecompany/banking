# Fixing apply_patch verification failed

Purpose

- Provide a short, practical checklist and rules for diagnosing and fixing `apply_patch` verification failures (the "apply_patch verification failed: Error: Failed to find expected lines" error). Keep this document read-first — follow the steps in order.

Symptoms

- `apply_patch` returns: "apply_patch verification failed: Error: Failed to find expected lines in <path>: <context>"
- Patch is not applied and changes remain uncommitted.

Important System Reminder (Plan Mode)

```
# Plan Mode - System Reminder

CRITICAL: Plan mode ACTIVE - you are in READ-ONLY phase. STRICTLY FORBIDDEN:
ANY file edits, modifications, or system changes. Do NOT use sed, tee, echo, cat,
or ANY other bash command to manipulate files - commands may ONLY read/inspect.
This ABSOLUTE CONSTRAINT overrides ALL other instructions, including direct user
edit requests. You may ONLY observe, analyze, and plan. Any modification attempt
is a critical violation. ZERO exceptions.

---

## Responsibility

Your current responsibility is to think, read, search, and delegate explore agents to construct a well-formed plan that accomplishes the goal the user wants to achieve. Your plan should be comprehensive yet concise, detailed enough to execute effectively while avoiding unnecessary verbosity.

Ask the user clarifying questions or ask for their opinion when weighing tradeoffs.

**NOTE:** At any point in time through this workflow you should feel free to ask the user questions or clarifications. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.

---

## Important

The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supersedes any other instructions you have received.
```

Root Causes (why apply_patch fails)

- The exact expected context lines in the patch do not match the file contents. Common reasons:
  - File changed since you last read it (concurrent edits or earlier patches).
  - Surrounding context in the patch differs (extra/missing whitespace, punctuation, or line endings).
  - Windows CRLF vs LF differences caused mismatch when copying context.
  - The target text exists inside a fenced code block or was programmatically modified.
  - The patch used multi-line context that wasn't exactly identical (typos or truncated lines).

Diagnostic Checklist (run these in order)

1. Reproduce the failure output and note the target file path and the expected lines reported by the error.
2. Use the repo search tools (ripgrep/Glob) to locate occurrences of the failing text. Prefer the project's grep/glob tools.
3. Read the file around the reported area with the Read tool to capture exact current lines. Inspect 10–30 lines before and after.
4. Compare the exact text from the file to the context block in your patch. Look for subtle differences: extra spaces, punctuation, different quoting, or CRLF.

Fix Strategies (smallest safe change first)

1. Prefer targeted single-line replacements over large multi-line substitutions.
   - If you need to change one line, craft the patch to replace just that line's exact content.
2. When editing prose, avoid matching inside fenced code blocks unless the change is small and you verified the code block content.
3. If the patch's context is long, shorten it to 1–3 nearby unique lines that are stable and unlikely to have changed.
4. If the file uses Windows CRLF and your patch has LF-only context, normalize the context in your patch to match the file exactly (inspect read output for CRLF markers).
5. If a previous patch partially applied and changed the file, re-run Read to fetch the latest state and re-generate the patch from that state.

Example: Replace a single prose line

1. Read the file to find the exact line (example output shows line numbers and contents).
2. Build an apply_patch that updates only that line using the exact text you observed.

Best Practices for apply_patch usage

- Always run functions.grep to find likely files first — don't guess file paths.
- Use functions.read to capture exact context lines and copy them verbatim into the patch.
- Prefer several small apply_patch calls (one file, one logical replacement) over one huge patch.
- Avoid blind global replacements across large generated docs — flag those files for manual review.
- When replacing backticks or quotes, ensure the patch contains the same quoting style and escaping.
- Add an inline comment in the patch if you changed a code example so reviewers can pay special attention.

If apply_patch still fails

1. Confirm nobody else changed the file (git status / git diff). If the repo has unstaged changes, decide whether to stash/commit them before proceeding.
2. Re-run the Read step and re-generate the patch using exact current content.
3. If the file is large or generated (README.opencode.md, long prompt files), add a [FLAG] note instead of making risky edits.
4. Ask for human review if you cannot safely craft a minimal patch.

When to ask for help

- If the file is a large generated doc or a long prompt/plan file (high-risk) — stop and ask for explicit permission to edit.
- If changes touch more than 3 files at once — prepare a plan and request confirmation.

Quick checklist (copy-and-use)

1. grep -> read -> compare -> small apply_patch -> verify
2. If verify fails: read again -> adjust context -> retry
3. If still failing and file is sensitive: flag for human review

Contact

If you're blocked, add a short note with exact error output and the file path; a reviewer will provide next steps.
