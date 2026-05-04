# Skill Evaluation Report: project-docs

## Summary

- **Total Score**: 58/120 (48%)
- **Grade**: **F** (Poor — needs fundamental redesign)
- **Pattern**: Hybrid of Navigation + Process (unclear)
- **Knowledge Ratio**: E:A:R = 25%:15%:60%
- **Verdict**: Task-oriented but lacks expert knowledge delta; 60% of content is redundant generic documentation standards that Claude already knows; critical gaps in progressive disclosure and practical decision frameworks.

---

## Dimension Scores

| Dimension                    | Score | Max | Grade | Status        |
| ---------------------------- | ----- | --- | ----- | ------------- |
| D1: Knowledge Delta          | 7     | 20  | 35%   | 🔴 CRITICAL   |
| D2: Mindset vs Mechanics     | 8     | 15  | 53%   | 🔴 CRITICAL   |
| D3: Anti-Pattern Quality     | 6     | 15  | 40%   | 🔴 CRITICAL   |
| D4: Specification Compliance | 11    | 15  | 73%   | 🟡 ACCEPTABLE |
| D5: Progressive Disclosure   | 4     | 15  | 27%   | 🔴 CRITICAL   |
| D6: Freedom Calibration      | 9     | 15  | 60%   | 🟡 WEAK       |
| D7: Pattern Recognition      | 6     | 10  | 60%   | 🟡 WEAK       |
| D8: Practical Usability      | 7     | 15  | 47%   | 🔴 CRITICAL   |

---

## Critical Issues

### 1. **Massive Token Waste (D1: 35%)**

**Problem:** ~60% of SKILL.md explains basics Claude already knows.

**Evidence:**

- "Core Documentation Files" section lists standard doc types (README, ARCHITECTURE, USER_GUIDE, DEVELOPER_GUIDE, CONTRIBUTING) — Claude knows these exist
- "Workflow: File Generation" describes standard ordering (README first) — generic procedural knowledge
- "Quality Checks" lists obvious best practices: "All code examples are runnable", "No placeholder text", "Use proper code fences"
- "Avoid" section contains vague warnings: "Generic placeholder text like 'TODO'"

**Impact:** 120 tokens of SKILL.md (out of ~200 total) deliver no genuine expert knowledge. This wastes context window.

**Example of redundant section:**

```markdown
### Quality Checks

Before finalizing, verify:

- All code examples are runnable and accurate
- Commands match detected language/tooling
- Cross-references between docs are correct
- No placeholder text remains
- Tone is consistent
```

Claude already knows all of this. Deleting this section saves tokens with zero knowledge loss.

---

### 2. **Missing Progressive Disclosure (D5: 27%)**

**Problem:** Skill references `references/templates.md` but never explicitly loads it.

**Evidence:**

- Mentions: "Read `references/templates.md` to select appropriate template variants"
- Missing: MANDATORY loading trigger, workflow integration, "Do NOT Load" guidance
- No clarification of WHEN templates are loaded or HOW they integrate into decision-making

**Current state (bad):**

```markdown
### 3. Content Adaptation

Read `references/templates.md` to select appropriate template variants based on detected context.
```

**Should be (good):**

```markdown
### 3. Content Adaptation

**MANDATORY - READ ENTIRE FILE**: Before proceeding, you MUST read [`references/templates.md`](references/templates.md) completely from start to finish. This file contains all 15+ template variants. **Do NOT load** any other reference files.
```

**Consequence:** Agent won't know when/how to load templates. The templates might sit unused.

---

### 3. **No Expert Thinking Frameworks (D2: 53%)**

**Problem:** Skill provides procedural steps but lacks expert decision-making patterns.

**Evidence:**

- "Ask user ONE question at a time" — procedural, not strategic
- "Context Detection" lists WHAT to detect but not HOW to think about documentation purpose
- Missing: framework for "Does this project NEED all 5 files? Should it skip DEVELOPER_GUIDE?"

**Missing expert question:**

```markdown
Before generating ANY docs, ask yourself:

- **Who reads this?** (developers, end-users, ops, all?)
- **What decisions do they need to make?** (how to install, how to contribute, how to deploy?)
- **What will be stale fastest?** (API docs, setup instructions, architecture?)
- **What can't be wrong?** (security, configuration, deployment procedures)
```

These thinking patterns are expertise. Procedural steps are not.

---

### 4. **Vague Anti-Patterns (D3: 40%)**

**Problem:** "Avoid" section contains obvious warnings without expert-specific reasoning.

**Current anti-patterns:**

- "Generic placeholder text like 'TODO' or 'Coming soon'" — obvious
- "Outdated technology references" — obvious
- "Overly complex explanations without examples" — obvious
- "Duplicating content across multiple files" — obvious
- "Missing concrete code examples" — obvious

**Missing expert anti-patterns:**

- NEVER write docs that explain code instead of explaining INTENT
- NEVER skip the "why" for architectural decisions (docs without rationale are useless)
- NEVER assume the reader knows your project's constraints and trade-offs
- NEVER write API docs without showing the FAILURE case, only the success case
- NEVER create DEVELOPER_GUIDE that contradicts actual practice in the codebase
- NEVER skip documentation for "obvious" features (the most obvious things are often most confusing)

**Why this matters:** Expert anti-patterns come from real experience. Current list is generic.

---

### 5. **References Without Trigger Logic (D5 + D8)**

**Problem:** `references/templates.md` is mentioned but no conditional triggers exist.

**Missing logic:**

```
IF project_type == "AI_Agent":
  LOAD: agent-specific sections from templates.md
  SKIP: infrastructure sections

IF context == "internal":
  SKIP: badges, CODE_OF_CONDUCT
  LOAD: company-specific tooling sections

IF project_has_existing_docs:
  SHOW: diff/update guidance instead of full generation
```

Current skill doesn't handle these scenarios.

---

## Detailed Analysis

### D1: Knowledge Delta (7/20) — CRITICAL

**What's wrong:**

- 60% of content is "explaining documentation best practices" that Claude already knows
- Missing: Expert decision frameworks, trade-offs, edge cases
- Missing: Domain-specific knowledge about how doc structure drives user success

**What's redundant:**

```markdown
# Core Documentation Files

Always generate these five core files:

1. **README.md** - Project overview, quick start, badges
2. **ARCHITECTURE.md** - System design, components, data flow ...
```

Claude knows what these files are. This is activation, not expert knowledge.

**What's expert (but minimal):**

- Specific markers for language detection (`go.mod`, `pyproject.toml`, `requirements.txt`, `setup.py`)
- Context-specific adaptation rules (OpenSource vs internal; AI Agents vs Infrastructure vs Microservices)

**Fix:** Delete ~50% of procedural/generic sections. Expand expert frameworks:

- When should a project skip certain files?
- How do you balance completeness vs. maintainability?
- What makes documentation "alive" vs. "stale"?

---

### D2: Mindset vs. Mechanics (8/15) — WEAK

**Thinking patterns present (positive):**

- "Before generating docs, detect: Language, Project type, Existing docs..." — basic framework
- Language/context detection logic is sound

**Thinking patterns missing (negative):**

- No framework for "who reads this doc?" → "what decisions drive that reader's behavior?"
- No guidance on prioritization ("if you can only document 2 of 5 files, which 2?")
- No thinking about documentation lifecycle ("which docs become stale fastest?")
- No decision framework for "should this be in README or USER_GUIDE?"

**Procedures present:**

- File generation order is specified
- Language detection markers are specific
- Context detection is reasonable

**Procedures missing:**

- No workflow for updating docs (only "generate new docs")
- No guidance on monorepo documentation
- No handling for projects that are both library AND CLI
- No error handling (what if user's project doesn't fit standard pattern?)

**Verdict:** Decent procedures, weak thinking frameworks. Expert docs would flip this ratio.

---

### D3: Anti-Pattern Quality (6/15) — WEAK

**Current "Avoid" section:**

```markdown
## Avoid

- Generic placeholder text like "TODO" or "Coming soon"
- Outdated technology references
- Overly complex explanations without examples
- Duplicating content across multiple files
- Missing concrete code examples
```

**Problem:** These are generic warnings that apply to ALL writing, not documentation-specific expertise.

**What expert anti-patterns should include:**

- ❌ NEVER write architecture docs that explain HOW code works instead of WHY decisions were made
- ❌ NEVER document APIs without showing error cases (success path is obvious)
- ❌ NEVER assume readers understand your project's constraints (write them explicitly)
- ❌ NEVER skip the "maintenance burden" for features (undocumented features become tech debt)
- ❌ NEVER make DEVELOPER_GUIDE a tutorial when it should be a reference
- ❌ NEVER duplicate setup instructions without at least a "see README §X"

**Why these matter:** They reflect real documentation failures that engineers hit repeatedly.

---

### D4: Specification Compliance (11/15) — ACCEPTABLE

**Valid:**

- ✓ YAML frontmatter is correct
- ✓ `name: project-docs` (lowercase, valid)
- ✓ Description answers WHAT (generate docs) and WHEN (when user requests)

**Weak:**

- Description could be more explicit about use cases: "for NEW projects needing docs from scratch" vs "for EXISTING projects needing docs overhaul"
- Doesn't emphasize that templates.md selection is a key decision point

**Current description:**

```yaml
description: Generate comprehensive, professional project documentation structures
including README, ARCHITECTURE, USER_GUIDE, DEVELOPER_GUIDE, and CONTRIBUTING files.
Use when the user requests project documentation creation, asks to "document a project",
needs standard documentation files, or wants to set up docs for a new repository.
Adapts to Python/Go projects and OpenSource/internal contexts.
```

**Could be stronger:**

```yaml
description: Generate complete documentation structures (README, ARCHITECTURE,
USER_GUIDE, DEVELOPER_GUIDE, CONTRIBUTING) tailored to project type and audience.
Detects project language (Python/Go), context (OpenSource/internal), and adapts
templates accordingly. Use when: (1) creating docs for new projects,
(2) auditing/restructuring existing docs, or (3) setting up docs for a repository
before launch.
```

---

### D5: Progressive Disclosure (4/15) — CRITICAL

**Current structure:**

- SKILL.md: ~200 lines (appropriate size)
- references/templates.md: Mentioned but never explicitly loaded

**Problem:** No three-layer architecture.

**What's missing:**

1. **Explicit loading triggers** — No "MANDATORY - READ ENTIRE FILE"
2. **Conditional loading** — No "SKIP if internal context"
3. **"Do NOT Load" guidance** — No prevention of over-loading

**Current reference mention:**

```markdown
### references/templates.md

Contains complete documentation templates for all five core files with variants for:

- Python vs Go projects
- OpenSource vs internal contexts ...

Claude should read this file to select appropriate templates before generating docs.
```

**Should be:**

```markdown
### Step 3: Template Selection

**MANDATORY - READ ENTIRE FILE**: Before generating ANY documentation, you MUST read [`references/templates.md`](references/templates.md) completely (~800 lines). This file contains all template variants.

**Conditional loading:**

- For AI Agents: sections 1-3 only
- For Infrastructure: sections 4-6 only
- For internal projects: SKIP OpenSource sections

**Do NOT load** any other reference files for this step.
```

**Impact:** Without explicit triggers, Agent won't know when/if to load templates.

---

### D6: Freedom Calibration (9/15) — WEAK

**Task fragility:** Documentation generation is medium-fragility (wrong structure creates confusing docs, but doesn't corrupt files).

**Should balance:**

- Low freedom: File structure and required sections (these need consistency)
- Medium freedom: Template variants selection (requires judgment)
- High freedom: Tone, examples, specific wording (creative decisions)

**Current calibration issues:**

- "Ask user ONE question at a time" — unnecessarily rigid procedural rule
- "Select template variant" — should have decision tree, not free choice
- "Add context-appropriate sections" — too vague (high freedom where medium is needed)

**Example of better calibration:**

```markdown
### File Generation (LOW FREEDOM - exact order required)

1. README.md first
2. ARCHITECTURE.md second ... Do NOT reorder these.

### Template Variant Selection (MEDIUM FREEDOM - decision tree required)

- If audience is "developers only": Use Developer-focused variant
- If project is "both library AND CLI": Use Hybrid variant
- If context is "internal only": Use Internal variant

### Tone & Examples (HIGH FREEDOM - principles only)

Keep tone consistent with project's voice (formal, casual, technical, approachable). Write examples in the language your users speak.
```

---

### D7: Pattern Recognition (6/10) — WEAK

**Identified pattern:** Hybrid Navigation + Process (confused structure)

**If Navigation (~30 lines):**

- SKILL.md should be minimal routing to sub-files
- Current SKILL.md is ~200 lines (too long for Navigation)
- Would be appropriate IF templates.md contained all workflow logic

**If Process (~200 lines):**

- Should have clear workflow phases with checkpoints
- Current structure has steps but lacks decision gates
- Should have conditional branching (missing)

**Current state:** Uncomfortable middle ground — too long to be Navigation, not structured enough to be Process.

**Recommended fix:** Commit to **Process** pattern:

- Phase 1: Context Detection (with decision tree: "Is this Python or Go?")
- Phase 2: User Questioning (with decision tree: "Audience questions" → "Type detection")
- Phase 3: Template Selection (with decision tree: "OpenSource?" → "AI Agent?" → pick variant)
- Phase 4: File Generation (checkpoints after each file)

---

### D8: Practical Usability (7/15) — WEAK

**Decision trees:** None provided. "Ask ONE question at a time" is directive, not a tree.

**Example missing decision tree:**

```markdown
## Project Type Detection

1. Check for `Dockerfile` or `docker-compose.yml` → **Infrastructure/DevOps**
2. Check for `mcp/`, `prompts/`, MCP-related files → **AI Agent**
3. Check for `/api`, `main.go`, `server.ts`, REST patterns → **Microservice**
4. Check for `Makefile`, `setup.py`, `go mod` → **Library/CLI**
5. Default: **General Software Project**

This determines which template variant to load.
```

**Current state:** Just says "detect project type" without decision logic.

**Error handling:** None provided.

- What if project doesn't match standard patterns?
- What if user wants only 2 of 5 files?
- What if project already has partial docs?

**Edge cases not covered:**

- Monorepo (multiple projects in one repo)
- Polyglot projects (Python + Go + Node in same repo)
- Legacy projects with existing non-standard docs
- Projects that are both library AND CLI tool

**Example of edge case handling:**

```markdown
### Monorepo Projects

**Detected by:** `packages/`, `services/`, or `modules/` directories

**Approach:**

1. Create root `docs/README.md` (links to sub-projects)
2. Create `docs/ARCHITECTURE.md` (system-level diagram)
3. For each package, create `packages/{name}/docs/` with its own README
4. Do NOT duplicate documentation across packages

**Do NOT** create separate DEVELOPER_GUIDE for each package — merge into root guide.
```

---

## Top 3 Improvements (Priority Order)

### 1. **DELETE 60% of Generic Content (Target: Reduce from 200→80 lines)**

**Action:** Remove all explanations of documentation basics Claude already knows.

**Delete sections:**

- "Core Documentation Files" (lists what README is)
- Entire "Workflow: Quality Checks" (generic best practices)
- "Avoid" section (obvious warnings)
- Generic parts of "Quality Standards"

**Saves:** ~120 tokens

**Remaining after deletion:** Workflow steps 1-5 focusing on DECISION LOGIC not PROCEDURES.

---

### 2. **Add Progressive Disclosure with Explicit Loading (D5 Score: 4→13)**

**Action:** Embed MANDATORY loading triggers in workflow.

**Implement:**

```markdown
### Step 3: Content Adaptation (Template Selection)

**MANDATORY - READ ENTIRE FILE**: Before proceeding, read [`references/templates.md`](references/templates.md) completely (~800 lines). **NEVER set range limits when reading.**

**Do NOT load** unless:

- [ ] Context detected (step 1 complete)
- [ ] Questions answered (step 2 complete)
- [ ] Project type identified

**Conditional sections:**

- AI Agents: Read sections "Agent Templates" only
- Infrastructure: Read sections "Infra Templates" only
- OpenSource: Read sections "Community" + "Core"
- Internal: SKIP "Community" section
```

**Impact:** Templates become a real workflow step, not optional.

---

### 3. **Add Expert Decision Frameworks (D2 Score: 8→14)**

**Action:** Replace procedural steps with thinking patterns.

**Add sections:**

```markdown
## Before Generating ANY Docs, Ask Yourself

**Purpose Questions:**

- Who READS this documentation? (developers, end-users, ops, compliance, all?)
- What DECISIONS do they need to make?
- What will be STALE in 3 months? (setup instructions? API? architecture?)

**Scope Questions:**

- Does this project need ALL 5 files?
  - Microservices might skip USER_GUIDE
  - Internal tools might skip CONTRIBUTING
  - CLIs might skip ARCHITECTURE
- What's the MINIMUM viable doc set for this project?

**Quality Questions:**

- What CANNOT be wrong? (security, deployment, configuration)
- What CAN you leave TBD? (examples, edge cases)
- Who MAINTAINS these docs? (single person? team? community?)
```

**Impact:** Provides expert thinking framework, not just procedures.

---

## Additional Recommended Improvements (Priority 4-7)

### 4. **Add Specific Anti-Patterns (D3: 6→12)**

Replace vague "Avoid" section with expert anti-patterns:

- NEVER explain code; explain INTENT
- NEVER skip architectural trade-offs (document why decisions were made)
- NEVER assume readers understand constraints
- NEVER document only the happy path (show failures)

### 5. **Add Decision Trees (D8: 7→13)**

Implement actual decision trees:

- Language detection → Python/Go/Other markers
- Project type detection → check for Dockerfile, MCP, API patterns
- Context detection → OpenSource badges/internal tooling
- File selection → which files required for this project type?

### 6. **Add Edge Case Coverage (D8: 7→14)**

Handle non-standard scenarios:

- Monorepo documentation strategy
- Polyglot projects
- Legacy projects with existing partial docs
- Projects that are both library AND CLI
- High-velocity projects where docs go stale fast

### 7. **Commit to Process Pattern (D7: 6→9)**

Structure as clear workflow:

- Phase 1: Detect
- Phase 2: Question
- Phase 3: Template Selection
- Phase 4: Generate with checkpoints
- Phase 5: Validate

Add phase gates and conditional branching.

---

## Restructuring Recommendation

**Current SKILL.md flow:**

1. Core Files (generic)
2. Workflow 1-7 (procedural)
3. Resources (orphaned reference)
4. Special Considerations (edge cases)
5. Quality Standards (generic)
6. Avoid (vague)

**Recommended SKILL.md flow:**

1. **Philosophy** (~20 lines): Why documentation matters, expert mindset
2. **Decision Framework** (~30 lines): Questions to ask before generating anything
3. **Workflow** (~40 lines): 5-phase process with checkpoints
4. **Resources** (~10 lines): MANDATORY loading trigger for templates.md
5. **Anti-Patterns** (~20 lines): Expert-specific NEVER list
6. **Common Scenarios** (~30 lines): Monorepo, polyglot, legacy, edge cases

**Total: ~150 lines** (down from ~200, with much higher knowledge delta)

---

## Final Verdict

This Skill is **task-oriented but lacks expert knowledge**. It tells Claude "here's the process to generate docs" but doesn't convey why documentation structure matters or what decisions separate good docs from mediocre docs.

The biggest problem: **60% redundant content** (explaining what Claude already knows) + **missing progressive disclosure** (references that should be loaded but aren't).

**To move from F → C grade:**

1. Delete generic sections (saves tokens, improves knowledge delta)
2. Add explicit loading triggers for templates
3. Replace procedures with thinking frameworks
4. Add specific anti-patterns with expert reasoning

**Estimated effort:** ~2-3 hours of editing to reach B-grade level.

---

**Report Generated:** 2026-05-04  
**Evaluation Tool:** skill-judge  
**Base Score:** 58/120 (48% = F Grade)
