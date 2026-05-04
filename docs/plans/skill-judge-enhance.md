---
plan name: skill-judge-enhance
plan description: Judge and enhance all 23 local skills
plan status: done
---

## Idea

Use the skill-judge rubric (D1–D8, 120 points) to evaluate all 23 local skills under `.opencode/skills/`, starting with the banking skill (including its 3 reference files), then proceeding in batches of 6. After each batch is judged, immediately enhance all skills in that batch. Within each batch, judge all 6 skills in parallel (subagents), then enhance all 6 in parallel. Save one evaluation report per skill to `.opencode/reports/skill-evaluations/[skill-name].md`. Finish with a master SCORECARD.md showing before/after deltas. Target: all 23 skills at grade B or above after enhancement. The banking skill is first because it is the most critical to this repository's domain and its reference files (validations.md, testing.md, dal-patterns.md) must also be judged and enhanced. The skill-judge skill is evaluated last as a meta-evaluation (it judges itself by its own criteria).

## Implementation

- Setup: Create .opencode/reports/skill-evaluations/ directory; verify skill-judge rubric (D1-D8) is accessible; confirm all 23 skill paths exist under .opencode/skills/
- Phase 0 — Judge banking (parallel): Score banking/SKILL.md, banking/reference/validations.md, banking/reference/testing.md, and banking/reference/dal-patterns.md independently against all 8 dimensions; save 4 evaluation reports
- Phase 0 — Enhance banking: Apply all findings from 4 reports; fix description triggers, purge redundant tech-stack content, add NEVER lists, strengthen loading triggers for reference files, add thinking frameworks; update all 4 files
- Batch 1 — Judge (parallel, 6 subagents): Evaluate asdf, caveman, caveman-commit, caveman-compress, caveman-review, code-docs against D1-D8; save 6 evaluation reports to .opencode/reports/skill-evaluations/
- Batch 1 — Enhance (parallel): Apply enhancement checklist from skill-quality-standards spec to all 6 Batch 1 skills simultaneously; fix descriptions, purge tutorials, add anti-patterns, calibrate freedom
- Batch 2 — Judge (parallel, 6 subagents): Evaluate content-research-writer, datadog, file-organizer, glab, httpie, humanizer against D1-D8; save 6 evaluation reports
- Batch 2 — Enhance (parallel): Apply enhancement checklist to all 6 Batch 2 skills; file-organizer and datadog expected to need significant D1 purges; humanizer may need progressive disclosure fixes
- Batch 3 — Judge (parallel, 6 subagents): Evaluate jira, marp-slide, mcp-builder, meeting-insights-analyzer, mermaid-diagrams, project-docs against D1-D8; save 6 evaluation reports
- Batch 3 — Enhance (parallel): Apply enhancement checklist to all 6 Batch 3 skills; mcp-builder Phase 1 section likely needs D2 pruning; mermaid-diagrams reference loading triggers need audit
- Batch 4 — Judge (parallel, 4 subagents): Evaluate skill-judge (self-evaluation), work-on-ticket, worktrunk, writing-clearly-and-concisely against D1-D8; save 4 evaluation reports; skill-judge passes its own test or gets revised
- Batch 4 — Enhance (parallel): Apply enhancement checklist to all 4 Batch 4 skills; skill-judge enhancement is a meta-edit — any fixes must maintain internal consistency of the rubric
- Final — Master Scorecard: Compile .opencode/reports/skill-evaluations/SCORECARD.md with before/after score table for all 23 skills, batch summaries, total delta, and grade distribution chart; run bun run format && bun run verify:rules to confirm no policy violations introduced

## Required Specs

<!-- SPECS_START -->

- skill-quality-standards
- encryption-tests
- enhance-pages-spec
- enhance-pages-v2
- plan-ensure-tests
- skill-judge-targets
- settings-content-tests
- root-tests
- skills-catalog
- user-dal-tests
<!-- SPECS_END -->
