# Skill Evaluation Report: file-organizer

## Summary

- **Total Score**: 42/120 (35%)
- **Grade**: F (Poor — needs fundamental redesign)
- **Pattern**: Attempted "Process" but degenerated into "Tutorial"
- **Knowledge Ratio**: E:A:R = 5:15:80
- **Verdict**: 80% of content is basic file operations Claude already knows; genuine expert knowledge delta is minimal, making this Skill mostly token waste.

---

## Dimension Scores

| Dimension | Score | Max | Justification |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 3 | 20 | ~80% redundant (basic bash, file types, folder structures). Almost everything Claude already knows. |
| D2: Mindset + Procedures | 6 | 15 | Procedures are all generic (mkdir, mv, find). No expert thinking patterns for _why_ to organize. |
| D3: Anti-Pattern Quality | 4 | 15 | Only 2 vague anti-patterns ("avoid version numbers", "hesitant to delete"). No expert NEVER list. |
| D4: Specification Compliance | 12 | 15 | Valid frontmatter. Description lacks WHEN triggers and keywords. Description doesn't mention specific tools/scenarios. |
| D5: Progressive Disclosure | 5 | 15 | 435 lines self-contained but bloated. No references or decision trees to offload. Should be <100 lines. |
| D6: Freedom Calibration | 3 | 15 | Over-rigid step-by-step procedures for a creative task. Creative work needs principles not checklists. |
| D7: Pattern Recognition | 2 | 10 | Doesn't follow any established pattern. Not Mindset (lacks thinking framework), not Tool (no specific format), hybrid mess. |
| D8: Practical Usability | 7 | 15 | Bash commands work. Examples are clear. But generic procedures don't capture real expert knowledge. |
| **TOTAL** | **42** | **120** | **35% — Below minimum viability threshold** |

---

## Critical Issues

### 1. **Catastrophic Knowledge Delta Failure** (D1 = 3/20)

The Skill is ~80% "teaching Claude how to organize files" when Claude already knows:

- Bash file operations (`mkdir`, `mv`, `find`, `du`)
- File type categorization
- Folder structure basics
- Standard naming conventions
- Duplicate detection logic

**Evidence**:

```markdown
# This entire section is redundant:

3. **Identify Organization Patterns** Based on the files, determine logical groupings: **By Type**: Documents (PDFs, DOCX, TXT), Images (JPG, PNG, SVG), Videos... **By Purpose**: Work vs. Personal, Active vs. Archive... **By Date**: Current year/month, Previous years...

# Claude already categorizes files this way. Not expert knowledge.

# This is redundant:

**By Type**: find [directory] -type f -exec md5 {} \; | sort | uniq -d find [directory] -type f -printf '%f\n' | sort | uniq -d

# Standard Unix commands Claude knows cold.
```

**Where is the expert knowledge?**

- No decision trees for ambiguous cases ("Is this an archive or a project?")
- No trade-offs ("Archive aggressively vs. keep everything")
- No edge cases from organizing real systems
- No anti-patterns specific to file organization
- No domain-specific thinking framework

**Verdict**: A Skill should answer "How do experts _think_ about organizing files?" This answers "Here's how to move files around," which Claude already knows.

### 2. **No Mindset Transfer** (D2 = 6/15)

The Skill is all procedures, zero thinking patterns.

**Problem**: It describes _what to do_ (create folder, move files) but not _how to think_ about organization decisions.

**Missing**:

```markdown
# WHAT SHOULD BE HERE:

## Expert Thinking: Organization Philosophy

Before organizing, ask yourself:

1. **What's the pain point?**
   - Can't find things? → Structure by how you search
   - Too many files? → Need clear active/archive boundary
   - Project management chaos? → Structure by workflow, not just type

2. **What's your search pattern?**
   - "I know roughly when I created it" → Organize by date
   - "I know what project it's part of" → Organize by project
   - "I know the file type" → Organize by type
   - **Structure should match how you search, not how files exist**

3. **When to break your own rules?**
   - Sometimes a project needs internal structure that breaks your global system
   - **Principle**: Let high-activity folders have their own structure
   - Archive the structure once the project is done

4. **The archive trap**
   - **NEVER** keep active and archived files in same folder
   - **NEVER** mix "might need this" with "definitely using this"
   - Clear boundary prevents decision fatigue
```

**Current state**: Step 1, Step 2, Step 3, Step 4, Step 5, Step 6, Step 7 — robot procedures, not expert thinking.

### 3. **Weak Anti-Patterns** (D3 = 4/15)

Only 2 anti-patterns mentioned, both vague:

```markdown
# Current anti-patterns (weak):

- "Avoid spaces (use hyphens or underscores)" ← Everyone knows this
- "Avoid version numbers in names" ← Vague "why"
- "Archive files you're hesitant to delete" ← Not actually an anti-pattern
```

**What SHOULD be here**:

```markdown
## NEVER Do These (Hard-Won Experience)

**NEVER organize by tool/software** (Adobe/, Microsoft/, VSCode/)

- Why: Tools change. 2023 "Adobe/" is obsolete if you switch to Figma
- Exception: Keep "Archive/Adobe/" only for exported projects needing that tool

**NEVER use generic "Misc/" or "Other/" folders**

- Why: Creates gravity well — everything goes there, becomes unsearchable
- If it's "miscellaneous", it's not miscellaneous, it's just uncategorized
- Real fix: "Decide what it IS, then put it there"

**NEVER "clean up later"** (ToSort/ that never gets sorted)

- Why: Deferred decisions compound. 100 files → 1000 files → chaos
- Better: 10 min of organization decisions now > 2 hours later

**NEVER merge old naming with new naming** (mixing "proposal.pdf" and "2024-01-15-proposal.pdf")

- Why: Breaks sorting and searching
- Rename everything old to match new standard, or archive separately

**NEVER delete without archiving first** (especially for creative work)

- Why: Projects resurrect. Deleted = gone forever
- Better: Archive → 6 months → delete if not accessed
```

### 4. \*\*Poor Description (D4 = 12/15)

Current description:

```yaml
description: "Intelligently organizes your files and folders across your computer
by understanding context, finding duplicates, suggesting better structures, and
automating cleanup tasks. Reduces cognitive load and keeps your digital workspace
tidy without manual effort."
```

**Problems**:

- Missing WHEN triggers ("Use when your Downloads folder is a mess")
- Missing keywords (no "duplicates", "archive", "cleanup" in description)
- Vague "automating cleanup tasks" — doesn't say what that means
- No scenario specificity

**What it should be**:

```yaml
description: "Organize files and find duplicates across your computer. Use when:
your Downloads/Desktop is chaotic, you have duplicate files taking space, your
folder structure no longer makes sense, or you're cleaning up before archiving.
Provides decision trees for: what to archive vs keep, when to create subfolders,
active vs archive separation strategies, and duplicate resolution workflows."
```

Better because:

- WHEN: "When: chaotic Downloads, duplicates, no structure, pre-archive"
- WHAT: "Organize files, find duplicates, decision trees for archive"
- KEYWORDS: Downloads, chaotic, duplicates, archive, cleanup, structure

### 5. **Massive Bloat** (D5 = 5/15)

435 lines in a single SKILL.md file, almost all self-contained.

**Problems**:

- "How to Use" section is 50+ lines of generic instructions
- "Instructions" section is a 200+ line tutorial
- Examples are 60+ lines of formatted output
- "Common Organization Tasks" just rephrases earlier content

**What should happen**:

```markdown
# file-organizer [REFACTORED]

## Core Philosophy

[30 lines on HOW to think about organization]

## Decision Framework

[40 lines: Decision tree for when to archive, when to restructure, etc.]

## NEVER List

[30 lines of expert anti-patterns]

---

That's ~100 lines and contains all the expert knowledge.

For detailed procedures (bash commands, examples, templates): → Load `references/bash-commands.md` (decision point: "Need to find duplicates?") → Load `references/organization-templates.md` (decision point: "Don't know folder structure?")
```

### 6. **Rigid Procedures for Creative Task** (D6 = 3/15)

Organization is creative (multiple valid approaches), but Skill is rigidly procedural.

**Current**: Step 1 → Step 2 → Step 3 → Step 4 ... (mechanical)

**Should be**: "Here's how experts think about this, then you execute"

```markdown
# BETTER CALIBRATION:

## Your Organization Personality

Before starting, know your own pattern:

**Type A: "I search by date"** → Structure: Year/Month/Project → Archive trigger: "Project finished, move to Archive/2024/"

**Type B: "I search by project"** → Structure: Project/Type (Documents, Assets, Archive) → Archive trigger: Entire project folder moves to Archive/

**Type C: "I search by file type"** → Structure: Documents/Images/Code/etc → Good for: Finding all PDFs quickly → Bad for: Project-level cleanup

**Type D: "I search by client/org"** → Structure: Client/Project/Assets → Common for: Freelancers, agencies

→ Your organization should MATCH your search pattern, not impose a pattern
```

Now Claude has freedom to choose the right structure.

### 7. **Pattern Recognition Failure** (D7 = 2/10)

The Skill doesn't follow any established pattern:

- **Not "Tool"**: No specific file format (it's generic file ops)
- **Not "Process"**: Tries to be, but collapse into tutorial
- **Not "Mindset"**: No expert thinking framework
- **Not "Philosophy"**: No coherent design aesthetic
- **Not "Navigation"**: Not routing to sub-files

It's a failed hybrid of "Tutorial" (what not to do) + "Process" (procedural steps).

---

## Critical Fixes Needed (Priority Order)

### **FIX 1: Eliminate 80% of Redundant Content** (D1, D5)

**Action**: Delete all basic bash explanations, standard file operations, obvious file types.

**What to keep**: Only expert knowledge (decision frameworks, anti-patterns, edge cases).

**Impact**: Reduce from 435 → 100 lines. Every remaining line must be knowledge Claude doesn't have.

### **FIX 2: Add Expert Thinking Framework** (D2, D6)

**Add a "Thinking Framework" section** (40 lines):

```markdown
## How Experts Think About Organization

1. **Ask FIRST: What's the pain?**
   - Can't find files? Structure by discovery path
   - Too much active work? Add clear archive boundary
   - Project chaos? Organize by workflow phase

2. **Match structure to search pattern**
   - If you search "when did I create this?" → Organize by date
   - If you search "what project?" → Organize by project
   - Structure should follow your brain, not impose on it

3. **Archive boundaries matter more than naming**
   - The single biggest difference between organized/chaos is clear active/archive split
   - Example: `/Projects/Active/` vs `/Projects/Archive/` = night and day
   - Without this boundary, every folder decision is ambiguous

4. **When to break your own rules**
   - High-activity projects can have internal structure
   - Archive the structure when project is done
   - Example: `/Projects/Active/client-x-2024/design/assets/` (complex) → `/Projects/Archive/2024/client-x/` (flat)
```

This transfers expert thinking. The procedures (bash commands) stay but subordinate.

### **FIX 3: Specific NEVER List** (D3)

**Add** (30 lines of anti-patterns with reasoning):

```markdown
## NEVER Do These

**NEVER use "Misc/" or "To-Sort/" permanently**

- These become gravity wells. Everything goes there because the structure is unclear
- If it's miscellaneous, it's not miscellaneous — you just haven't decided what it is

**NEVER organize by tool/software** (Adobe/, Office/, etc.)

- Tools change. Archive folders become obsolete
- Organize by what it IS (project, document type), not what created it

**NEVER defer decisions** ("I'll sort this later")

- Deferred decisions compound exponentially
- 10 files unsorted → 10 days later → 100 files unsorted
- Every file needs a decision WHEN YOU CREATE IT, not later

**NEVER mix naming conventions in same folder**

- Some files "report.pdf", others "2024-01-15-report.pdf"
- Kills sorting and searching
- Convert everything to one standard, or separate by era

**NEVER delete without archiving first**

- Especially creative work, projects, client deliverables
- Archive first, delete after 6 months untouched
- Resurrection is common
```

### **FIX 4: Better Description** (D4)

Change from vague to specific:

```yaml
description: "Create effective file organization with decision trees for archive
strategy, naming conventions, and active/archive boundaries. Use when: Downloads/
Desktop is chaotic, you have duplicates, or your structure no longer matches how
you search. Covers: when to archive vs delete, project structure that survives
tool changes, organizing by discovery pattern (date/project/type), and avoiding
common mistakes that lead to chaos."
```

Now it's:

- WHAT: decision trees, archive strategy, naming, structure
- WHEN: Downloads chaos, duplicates, misaligned structure
- KEYWORDS: archive, duplicates, decision trees, naming, discovery pattern

### **FIX 5: Progressive Disclosure** (D5)

Restructure as:

```
file-organizer/
├── SKILL.md (100 lines)
│   ├── Thinking Framework (40 lines)
│   ├── NEVER List (30 lines)
│   └── Decision Trees (30 lines)
└── references/
    ├── bash-commands.md (Load when: "help me find duplicates")
    ├── templates.md (Load when: "suggest a structure")
    └── examples.md (Load when: "show me organization examples")
```

This way: 100 lines of expert knowledge in SKILL.md, details loaded on-demand.

### **FIX 6: Reverse Freedom Calibration** (D6)

Change from rigid steps to principles:

```markdown
## How to Execute (Choose Your Own Approach)

You have several valid approaches. Pick one that matches your situation:

**Conservative**: Move slowly, confirm each decision, build confidence first **Comprehensive**: Commit to full restructure, archive everything old, start fresh **Hybrid**: Organize active projects first, archive old second, decide edge cases as you go

No "right" way — these are all valid expert approaches depending on your tolerance for disruption.
```

---

## Enhancement Actions Taken

None — This is an evaluation report, not a remediation. Recommendations provided above for the Skill author.

---

## Overall Assessment

**file-organizer** is a **failed Skill** that reads like a tutorial ("How to Organize Files") rather than knowledge externalization ("What Expert Organizers Know").

The core issue: It teaches Claude something Claude already knows (how to move files, categorize by type, use bash). Good Skills teach things Claude doesn't know (expert decision frameworks, real-world anti-patterns, domain-specific trade-offs).

**Why it fails**:

| Dimension | Why Failed | Fix Required |
| --- | --- | --- |
| D1 (Knowledge Delta) | 80% basic operations | Keep only expert knowledge; delete tutorials |
| D2 (Mindset) | Only procedures, no thinking | Add decision framework for how experts think |
| D3 (Anti-Patterns) | Vague warnings | Specific NEVER list with reasoning |
| D4 (Description) | Doesn't trigger appropriately | Add WHEN, KEYWORDS, specific scenarios |
| D5 (Disclosure) | Bloated 435 lines | Reduce to 100, move details to references/ |
| D6 (Freedom) | Rigid procedures | Convert to principles + let agent choose approach |
| D7 (Pattern) | Doesn't follow any pattern | Should follow "Mindset" pattern (50 lines) |
| D8 (Usability) | Technically works, no real value | Commands work but don't capture expert knowledge |

**Recommendation**:

This Skill needs fundamental redesign, not incremental fixes. It should be rebuilt from scratch around **expert decision frameworks** (how do professionals think about organization), not around **file operation procedures** (which Claude already knows).

Current approach: **Bottom-up** (procedures → decisions). Correct approach: **Top-down** (thinking patterns → procedures).

**Grade**: **F (35%)** — Below minimum viability. Do not deploy in current form.

---

Generated: 2026-05-04 | Evaluated against: skill-judge v2.1 (120 points)
