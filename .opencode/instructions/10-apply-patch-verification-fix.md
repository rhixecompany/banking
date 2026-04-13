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

## Opencode‑AI Guidance

This repository is agent-enabled. The following rules and workflow are required when an automated agent (opencode‑ai or similar) diagnoses or repairs an apply_patch verification failure.

1. Always obey Plan Mode. If Plan Mode is active the agent must NOT edit files. Produce a plan and await human confirmation before writing files.
2. Prefer the repository's high-level tools — functions.grep and functions.read — instead of running shell grep/cat. These tools capture repository-safe context and avoid leaking secrets.
3. When reading multiple files in parallel, use multi_tool_use.parallel to speed discovery and reduce upstream rate-limits.
4. Do not use sed/awk/echo/cat for file manipulation. Use functions.apply_patch for modifications and functions.read to capture exact lines to include in the patch.
5. Use the centralized IO helper approach (scripts/utils/io.ts) for scripts changes — the doc describes the same safe dry-run semantics agents should follow.

## Tool Usage & Sequence (Recommended)

1. Reproduce the error message from apply_patch and record the target file path and the expected context block reported by the tool.
2. Use functions.grep to search the repo for the reported context (pattern or unique nearby lines).
3. Use functions.read to capture the file content around the reported area (read a 30–80 line window to ensure you have exact lines).
4. Compare the exact lines from the file to the context in the failing patch. Look for subtle differences (trailing spaces, CRLF vs LF, different quoting).
5. If multiple files must be inspected, call multi_tool_use.parallel with multiple functions.read calls.
6. Prepare a minimized apply_patch that replaces only the exact non-matching lines (1–3 lines) rather than a large multi-line replace.
7. Run apply_patch. If it fails again, repeat steps 2–6 using the freshly read file state.

## Concrete Recovery Steps (Opencode‑AI checklist)

1. Re-run functions.read on the target file to ensure it hasn't changed since the patch was prepared. Use offset to fetch the exact reported region.
2. Normalize line endings mentally: if the repo uses LF and the working environment uses CRLF (Windows), ensure the patch context matches the file’s actual line endings. Prefer copying exact lines returned by functions.read into the patch.
3. Reduce the context block: shorten the surrounding context to 1–3 highly unique lines when possible. Less context reduces mismatch probability.
4. If the file is large or generated, prefer a single-line replacement or add a small comment rather than rewriting big blocks.
5. If a previous partial patch may have partially applied, re-run functions.read and regenerate the patch from that live state.
6. If you cannot craft a safe minimal patch and the change touches >3 files or a large prompt/plan file, prepare a plan in .opencode/plans/ and request human approval.

## Example — Minimal repair of a mismatched line

1. Use functions.read to capture exact lines around the error:

- read -> shows (example): 102: const componentsDir = path.resolve(getComponentsDir(options)); 103: 104: - if (!fs.existsSync(componentsDir)) { 105: - fs.mkdirSync(componentsDir, { recursive: true }); 106: - } 107:

2. Create an apply_patch that replaces exactly those three lines with the new single line using the exact verbatim text returned by functions.read. Example patch fragment:

**_ Begin Patch _** Update File: scripts/generate/component.ts @@

- if (!fs.existsSync(componentsDir)) {
- fs.mkdirSync(componentsDir, { recursive: true });
- }

* if (!fs.existsSync(componentsDir)) {
* await io.mkdirp(componentsDir, { dryRun: (globalThis as any).\_\_SCRIPTS_DRY_RUN ?? undefined });
* } \*\*\* End Patch

Notes:

- Copy the lines exactly as reported by functions.read — do not reformat whitespace or change quotes.
- If functions.read shows CRLF markers or trailing spaces, include them verbatim in the patch context.

## When to escalate to a human

1. Patch touches more than 3 files.
2. Patch modifies large prompt/plan/skilled SKILL.md files or other agent-instruction files.
3. The file contains sensitive content that might be inadvertently exposed (secrets or long tokens).
4. The apply_patch failures persist after 3 iterative small attempts.

When escalating, include:

- The failing apply_patch error output (copy verbatim).
- The functions.grep results (file:line matches).
- functions.read output for the 30–80 line context the agent used.
- The proposed minimal patch.

## Short Troubleshooting Cheat‑sheet

1. apply_patch verification failed -> functions.grep -> functions.read -> craft minimal apply_patch -> retry.
2. If failure mentions CRLF/LF, copy exact read output and include in patch.
3. If file changed during attempts, re-read and regenerate the patch from the new state.
4. For large, sensitive, or multi-file edits: create a plan in .opencode/plans/ and wait for human approval.
