---
name: skill-judge
description: Evaluate Agent Skill design quality against official specifications and best practices. Use when reviewing, auditing, or improving SKILL.md files and skill packages. Provides multi-dimensional scoring and actionable improvement suggestions.
---

# Skill Judge

Evaluate Agent Skills against official specifications and patterns derived from 17+ official examples.

---

## Core Philosophy

### What is a Skill?

A Skill is NOT a tutorial. A Skill is a **knowledge externalization mechanism**.

Traditional AI knowledge is locked in model parameters. To teach new capabilities:

```
Traditional: Collect data → GPU cluster → Train → Deploy new version
Cost: $10,000 - $1,000,000+
Timeline: Weeks to months
```

Skills change this:

```
Skill: Edit SKILL.md → Save → Takes effect on next invocation
Cost: $0
Timeline: Instant
```

This is the paradigm shift from "training AI" to "educating AI" — like a hot-swappable LoRA adapter that requires no training. You edit a Markdown file in natural language, and the model's behavior changes.

### The Core Formula

> **Good Skill = Expert-only Knowledge − What Claude Already Knows**

A Skill's value is measured by its **knowledge delta** — the gap between what it provides and what the model already knows.

- **Expert-only knowledge**: Decision trees, trade-offs, edge cases, anti-patterns, domain-specific thinking frameworks — things that take years of experience to accumulate
- **What Claude already knows**: Basic concepts, standard library usage, common programming patterns, general best practices

When a Skill explains "what is PDF" or "how to write a for-loop", it's compressing knowledge Claude already has. This is **token waste** — context window is a public resource shared with system prompts, conversation history, other Skills, and user requests.

### Tool vs Skill

| Concept | Essence | Function | Example |
| --- | --- | --- | --- |
| **Tool** | What model CAN do | Execute actions | bash, read_file, write_file, WebSearch |
| **Skill** | What model KNOWS how to do | Guide decisions | PDF processing, MCP building, frontend design |

Tools define capability boundaries — without bash tool, model can't execute commands. Skills inject knowledge — without frontend-design Skill, model produces generic UI.

**The equation**:

```
General Agent + Excellent Skill = Domain Expert Agent
```

Same Claude model, different Skills loaded, becomes different experts.

### Three Types of Knowledge in Skills

When evaluating, categorize each section:

| Type | Definition | Treatment |
| --- | --- | --- |
| **Expert** | Claude genuinely doesn't know this | Must keep — this is the Skill's value |
| **Activation** | Claude knows but may not think of | Keep if brief — serves as reminder |
| **Redundant** | Claude definitely knows this | Should delete — wastes tokens |

The art of Skill design is maximizing Expert content, using Activation sparingly, and eliminating Redundant ruthlessly.

---

## Evaluation Dimensions (120 points total)

### D1: Knowledge Delta (20 points) — THE CORE DIMENSION

The most important dimension. Does the Skill add genuine expert knowledge?

| Score | Criteria |
| --- | --- |
| 0-5 | Explains basics Claude knows (what is X, how to write code, standard library tutorials) |
| 6-10 | Mixed: some expert knowledge diluted by obvious content |
| 11-15 | Mostly expert knowledge with minimal redundancy |
| 16-20 | Pure knowledge delta — every paragraph earns its tokens |

**Red flags** (instant score ≤5):

- "What is [basic concept]" sections
- Step-by-step tutorials for standard operations
- Explaining how to use common libraries
- Generic best practices ("write clean code", "handle errors")
- Definitions of industry-standard terms

**Green flags** (indicators of high knowledge delta):

- Decision trees for non-obvious choices ("when X fails, try Y because Z")
- Trade-offs only an expert would know ("A is faster but B handles edge case C")
- Edge cases from real-world experience
- "NEVER do X because [non-obvious reason]"
- Domain-specific thinking frameworks

**Evaluation questions**:

1. For each section, ask: "Does Claude already know this?"
2. If explaining something, ask: "Is this explaining TO Claude or FOR Claude?"
3. Count paragraphs that are Expert vs Activation vs Redundant

---

### D2: Mindset + Appropriate Procedures (15 points)

Does the Skill transfer expert **thinking patterns** along with **necessary domain-specific procedures**?

The difference between experts and novices isn't "knowing how to operate" — it's "how to think about the problem." But thinking patterns alone aren't enough when Claude lacks domain-specific procedural knowledge.

**Key distinction**: | Type | Example | Value | |------|---------|-------| | **Thinking patterns** | "Before designing, ask: What makes this memorable?" | High — shapes decision-making | | **Domain-specific procedures** | "OOXML workflow: unpack → edit XML → validate → pack" | High — Claude may not know this | | **Generic procedures** | "Step 1: Open file, Step 2: Edit, Step 3: Save" | Low — Claude already knows |

| Score | Criteria |
| --- | --- |
| 0-3 | Only generic procedures Claude already knows |
| 4-7 | Has domain procedures but lacks thinking frameworks |
| 8-11 | Good balance: thinking patterns + domain-specific workflows |
| 12-15 | Expert-level: shapes thinking AND provides procedures Claude wouldn't know |

**What counts as valuable procedures**:

- Workflows Claude hasn't been trained on (new tools, proprietary systems)
- Correct ordering that's non-obvious (e.g., "validate BEFORE packing, not after")
- Critical steps that are easy to miss (e.g., "MUST recalculate formulas after editing")
- Domain-specific sequences (e.g., MCP server's 4-phase development process)

**What counts as redundant procedures**:

- Generic file operations (open, read, write, save)
- Standard programming patterns (loops, conditionals, error handling)
- Common library usage that's well-documented

**Expert thinking patterns look like**:

```markdown
Before [action], ask yourself:

- **Purpose**: What problem does this solve? Who uses it?
- **Constraints**: What are the hidden requirements?
- **Differentiation**: What makes this solution memorable?
```

**Valuable domain procedures look like**:

```markdown
### Redlining Workflow (Claude wouldn't know this sequence)

1. Convert to markdown: `pandoc --track-changes=all`
2. Map text to XML: grep for text in document.xml
3. Implement changes in batches of 3-10
4. Pack and verify: check ALL changes were applied
```

**Redundant generic procedures look like**:

```markdown
Step 1: Open the file Step 2: Find the section Step 3: Make the change Step 4: Save and test
```

**The test**:

1. Does it tell Claude WHAT to think about? (thinking patterns)
2. Does it tell Claude HOW to do things it wouldn't know? (domain procedures)

A good Skill provides both when needed.

---

**Domain vs Generic Procedure Classification Guide**:

When evaluating procedures in a Skill, ask: "Is this specific to this domain, or general programming/operations knowledge?"

| Procedure Type | Example | Keep? | Why |
| --- | --- | --- | --- |
| **Domain-Specific** | "Validate OOXML schema BEFORE packing, not after" | ✓ YES | Non-obvious ordering that prevents data loss; domain expertise |
| **Domain-Specific** | "MCP tools must validate inputs against declared schema" | ✓ YES | MCP-specific requirement; Claude may not know this constraint |
| **Domain-Specific** | "PDF fonts embed differently depending on export settings" | ✓ YES | Format-specific behavior; requires domain experience |
| **Generic** | "Use try/catch blocks for error handling" | ✗ DELETE | Standard programming pattern; Claude knows |
| **Generic** | "Write clean code with meaningful variable names" | ✗ DELETE | Generic best practice; universal knowledge |
| **Generic** | "Step 1: Open file, Step 2: Edit, Step 3: Save" | ✗ DELETE | Standard file operations; Claude knows |
| **Mixed** | "Step 1: Open JSON file, Step 2: Edit values, Step 3: Validate against schema, Step 4: Save" | ⚠️ FILTER | Keep Step 3 (domain-specific validation), delete Step 1, 2, 4 (generic) |

---

---

### D3: Anti-Pattern Quality (15 points)

Does the Skill have effective NEVER lists?

**Why this matters**: Half of expert knowledge is knowing what NOT to do. A senior designer sees purple gradient on white background and instinctively cringes — "too AI-generated." This intuition for "what absolutely not to do" comes from stepping on countless landmines.

Claude hasn't stepped on these landmines. It doesn't know Inter font is overused, doesn't know purple gradients are the signature of AI-generated content. Good Skills must explicitly state these "absolute don'ts."

| Score | Criteria |
| --- | --- |
| 0-3 | No anti-patterns mentioned |
| 4-7 | Generic warnings ("avoid errors", "be careful", "consider edge cases") |
| 8-11 | Specific NEVER list with some reasoning |
| 12-15 | Expert-grade anti-patterns with WHY — things only experience teaches |

**Expert anti-patterns** (specific + reason):

```markdown
NEVER use generic AI-generated aesthetics like:

- Overused font families (Inter, Roboto, Arial)
- Cliched color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Default border-radius on everything
```

**Weak anti-patterns** (vague, no reasoning):

```markdown
Avoid making mistakes. Be careful with edge cases. Don't write bad code.
```

**The test**: Would an expert read the anti-pattern list and say "yes, I learned this the hard way"? Or would they say "this is obvious to everyone"?

---

### D4: Specification Compliance — Especially Description (15 points)

Does the Skill follow official format requirements? **Special focus on description quality.**

| Score | Criteria |
| --- | --- |
| 0-5 | Missing frontmatter or invalid format |
| 6-10 | Has frontmatter but description is vague or incomplete |
| 11-13 | Valid frontmatter, description has WHAT but weak on WHEN |
| 14-15 | Perfect: comprehensive description with WHAT, WHEN, and trigger keywords |

**Frontmatter requirements**:

- `name`: lowercase, alphanumeric + hyphens only, ≤64 characters
- `description`: **THE MOST CRITICAL FIELD** — determines if skill gets used at all

---

**Why description is THE MOST IMPORTANT field**:

```
┌─────────────────────────────────────────────────────────────────────┐
│  SKILL ACTIVATION FLOW                                              │
│                                                                     │
│  User Request → Agent sees ALL skill descriptions → Decides which  │
│                 (only descriptions, not bodies!)     to activate    │
│                                                                     │
│  If description doesn't match → Skill NEVER gets loaded            │
│  If description is vague → Skill might not trigger when it should  │
│  If description lacks keywords → Skill is invisible to the Agent   │
└─────────────────────────────────────────────────────────────────────┘
```

**The brutal truth**: A Skill with perfect content but poor description is **useless** — it will never be activated. The description is the **only chance** to tell the Agent "use me in these situations."

---

**Description must answer THREE questions**:

1. **WHAT**: What does this Skill do? (functionality)
2. **WHEN**: In what situations should it be used? (trigger scenarios)
3. **KEYWORDS**: What terms should trigger this Skill? (searchable terms)

**Excellent description** (all three elements):

```yaml
description: "Comprehensive document creation, editing, and analysis with support
for tracked changes, comments, formatting preservation, and text extraction.
When Claude needs to work with professional documents (.docx files) for:
(1) Creating new documents, (2) Modifying or editing content,
(3) Working with tracked changes, (4) Adding comments, or any other document tasks"
```

Analysis:

- WHAT: creation, editing, analysis, tracked changes, comments
- WHEN: "When Claude needs to work with... for: (1)... (2)... (3)..."
- KEYWORDS: .docx files, tracked changes, professional documents

**Poor description** (missing elements):

```yaml
description: "Handles document-related features"
```

Problems:

- WHAT: vague ("document-related features" — what specifically?)
- WHEN: missing (when should Agent use this?)
- KEYWORDS: missing (no ".docx", no specific scenarios)

**Another poor example**:

```yaml
description: "A helpful skill for various tasks"
```

This is useless — Agent has no idea when to activate it.

---

**Description quality checklist**:

- [ ] Lists specific capabilities (not just "helps with X")
- [ ] Includes explicit trigger scenarios ("Use when...", "When user asks for...")
- [ ] Contains searchable keywords (file extensions, domain terms, action verbs)
- [ ] Specific enough that Agent knows EXACTLY when to use it
- [ ] Includes scenarios where this skill MUST be used (not just "can be used")

---

### D5: Progressive Disclosure (15 points)

Does the Skill implement proper content layering?

Skill loading has three layers:

```
Layer 1: Metadata (always in memory)
         Only name + description
         ~100 tokens per skill

Layer 2: SKILL.md Body (loaded after triggering)
         Detailed guidelines, code examples, decision trees
         Ideal: < 500 lines

Layer 3: Resources (loaded on demand)
         scripts/, references/, assets/
         No limit
```

| Score | Criteria |
| --- | --- |
| 0-5 | Everything dumped in SKILL.md (>500 lines, no structure) |
| 6-10 | Has references but unclear when to load them |
| 11-13 | Good layering with MANDATORY triggers present |
| 14-15 | Perfect: decision trees + explicit triggers + "Do NOT Load" guidance |

**For Skills WITH references directory**, check Loading Trigger Quality:

| Trigger Quality | Characteristics |
| --- | --- |
| Poor | References listed at end, no loading guidance |
| Mediocre | Some triggers but not embedded in workflow |
| Good | MANDATORY triggers in workflow steps |
| Excellent | Scenario detection + conditional triggers + "Do NOT Load" |

**The loading problem**:

```
Loading too little ◄─────────────────────────────────► Loading too much
- References sit unused                    - Wastes context space
- Agent doesn't know when to load          - Irrelevant info dilutes key content
- Knowledge is there but never accessed    - Unnecessary token overhead
```

**Good loading trigger** (embedded in workflow):

```markdown
### Creating New Document

**MANDATORY - READ ENTIRE FILE**: Before proceeding, you MUST read [`docx-js.md`](docx-js.md) (~500 lines) completely from start to finish. **NEVER set any range limits when reading this file.**

**Do NOT load** `ooxml.md` or `redlining.md` for this task.
```

**Bad loading trigger** (just listed):

```markdown
## References

- docx-js.md - for creating documents
- ooxml.md - for editing
- redlining.md - for tracking changes
```

**For simple Skills** (no references, <100 lines): Score based on conciseness and self-containment.

---

### D6: Freedom Calibration (15 points)

Is the level of specificity appropriate for the task's fragility?

Different tasks need different levels of constraint. This is about matching freedom to fragility.

| Score | Criteria |
| --- | --- |
| 0-5 | Severely mismatched (rigid scripts for creative tasks, vague for fragile ops) |
| 6-10 | Partially appropriate, some mismatches |
| 11-13 | Good calibration for most scenarios |
| 14-15 | Perfect freedom calibration throughout |

**The freedom spectrum**:

| Task Type | Should Have | Why | Example Skill |
| --- | --- | --- | --- |
| Creative/Design | High freedom | Multiple valid approaches, differentiation is value | frontend-design |
| Code review | Medium freedom | Principles exist but judgment required | code-review |
| File format operations | Low freedom | One wrong byte corrupts file, consistency critical | docx, xlsx, pdf |

**High freedom** (text-based instructions):

```markdown
Commit to a BOLD aesthetic direction. Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic natural...
```

**Medium freedom** (pseudocode or parameterized):

```markdown
Review priority:

1. Security vulnerabilities (must fix)
2. Logic errors (must fix)
3. Performance issues (should fix)
4. Maintainability (optional)
```

**Low freedom** (specific scripts, exact steps):

```markdown
**MANDATORY**: Use exact script in `scripts/create-doc.py` Parameters: --title "X" --author "Y" Do NOT modify the script.
```

**The test**: Ask "if Agent makes a mistake, what's the consequence?"

- High consequence → Low freedom
- Low consequence → High freedom

---

### D7: Pattern Recognition (10 points)

Does the Skill follow an established official pattern?

Through analyzing 17 official Skills, we identified 5 main design patterns:

| Pattern | ~Lines | Key Characteristics | Example | When to Use |
| --- | --- | --- | --- | --- |
| **Mindset** | ~50 | Thinking > technique, strong NEVER list, high freedom | frontend-design | Creative tasks requiring taste |
| **Navigation** | ~30 | Minimal SKILL.md, routes to sub-files | internal-comms | Multiple distinct scenarios |
| **Philosophy** | ~150 | Two-step: Philosophy → Express, emphasizes craft | canvas-design | Art/creation requiring originality |
| **Process** | ~200 | Phased workflow, checkpoints, medium freedom | mcp-builder | Complex multi-step projects |
| **Tool** | ~300 | Decision trees, code examples, low freedom | docx, pdf, xlsx | Precise operations on specific formats |

| Score | Criteria                                                |
| ----- | ------------------------------------------------------- |
| 0-3   | No recognizable pattern, chaotic structure              |
| 4-6   | Partially follows a pattern with significant deviations |
| 7-8   | Clear pattern with minor deviations                     |
| 9-10  | Masterful application of appropriate pattern            |

**Pattern selection guide**:

| Your Task Characteristics             | Recommended Pattern     |
| ------------------------------------- | ----------------------- |
| Needs taste and creativity            | Mindset (~50 lines)     |
| Needs originality and craft quality   | Philosophy (~150 lines) |
| Has multiple distinct sub-scenarios   | Navigation (~30 lines)  |
| Complex multi-step project            | Process (~200 lines)    |
| Precise operations on specific format | Tool (~300 lines)       |

---

### D8: Practical Usability (15 points)

Can an Agent actually use this Skill effectively?

| Score | Criteria |
| --- | --- |
| 0-5 | Confusing, incomplete, contradictory, or untested guidance |
| 6-10 | Usable but with noticeable gaps |
| 11-13 | Clear guidance for common cases |
| 14-15 | Comprehensive coverage including edge cases and error handling |

**Check for**:

- **Decision trees**: For multi-path scenarios, is there clear guidance on which path to take?
- **Code examples**: Do they actually work? Or are they pseudocode that breaks?
- **Error handling**: What if the main approach fails? Are fallbacks provided?
- **Edge cases**: Are unusual but realistic scenarios covered?
- **Actionability**: Can Agent immediately act, or needs to figure things out?

**Good usability** (decision tree + fallback):

```markdown
| Task           | Primary Tool | Fallback  | When to Use Fallback |
| -------------- | ------------ | --------- | -------------------- |
| Read text      | pdftotext    | PyMuPDF   | Need layout info     |
| Extract tables | camelot-py   | tabula-py | camelot fails        |

**Common issues**:

- Scanned PDF: pdftotext returns blank → Use OCR first
- Encrypted PDF: Permission error → Use PyMuPDF with password
```

**Poor usability** (vague):

```markdown
Use appropriate tools for PDF processing. Handle errors properly. Consider edge cases.
```

---

## NEVER Do When Evaluating

- **NEVER** give high scores just because it "looks professional" or is well-formatted
- **NEVER** ignore token waste — every redundant paragraph should result in deduction
- **NEVER** let length impress you — a 43-line Skill can outperform a 500-line Skill
- **NEVER** skip mentally testing the decision trees — do they actually lead to correct choices?
- **NEVER** forgive explaining basics with "but it provides helpful context"
- **NEVER** overlook missing anti-patterns — if there's no NEVER list, that's a significant gap
- **NEVER** assume all procedures are valuable — distinguish domain-specific from generic
- **NEVER** undervalue the description field — poor description = skill never gets used
- **NEVER** put "when to use" info only in the body — Agent only sees description before loading

---

## Evaluation Protocol

### Step 1: First Pass — Knowledge Delta Scan

Read SKILL.md completely and for each section ask:

> "Does Claude already know this?"

Mark each section as:

- **[E] Expert**: Claude genuinely doesn't know this — value-add
- **[A] Activation**: Claude knows but brief reminder is useful — acceptable
- **[R] Redundant**: Claude definitely knows this — should be deleted

Calculate rough ratio: E:A:R

- Good Skill: >70% Expert, <20% Activation, <10% Redundant
- Mediocre Skill: 40-70% Expert, high Activation
- Bad Skill: <40% Expert, high Redundant

### Step 2: Structure Analysis

```
[ ] Check frontmatter validity
[ ] Count total lines in SKILL.md
[ ] List all reference files and their sizes
[ ] Identify which pattern the Skill follows
[ ] Check for loading triggers (if references exist)
```

### Step 3: Score Each Dimension

For each of the 8 dimensions:

1. Find specific evidence (quote relevant lines)
2. Assign score with one-line justification
3. Note specific improvements if score < max

### Step 4: Calculate Total & Grade

```
Total = D1 + D2 + D3 + D4 + D5 + D6 + D7 + D8
Max = 120 points
```

**Grade Scale** (percentage-based): | Grade | Percentage | Meaning | |-------|------------|---------| | A | 90%+ (108+) | Excellent — production-ready expert Skill | | B | 80-89% (96-107) | Good — minor improvements needed | | C | 70-79% (84-95) | Adequate — clear improvement path | | D | 60-69% (72-83) | Below Average — significant issues | | F | <60% (<72) | Poor — needs fundamental redesign |

### Step 5: Generate Report

```markdown
# Skill Evaluation Report: [Skill Name]

## Summary

- **Total Score**: X/120 (X%)
- **Grade**: [A/B/C/D/F]
- **Pattern**: [Mindset/Navigation/Philosophy/Process/Tool]
- **Knowledge Ratio**: E:A:R = X:Y:Z
- **Verdict**: [One sentence assessment]

## Dimension Scores

| Dimension                    | Score | Max | Notes |
| ---------------------------- | ----- | --- | ----- |
| D1: Knowledge Delta          | X     | 20  |       |
| D2: Mindset vs Mechanics     | X     | 15  |       |
| D3: Anti-Pattern Quality     | X     | 15  |       |
| D4: Specification Compliance | X     | 15  |       |
| D5: Progressive Disclosure   | X     | 15  |       |
| D6: Freedom Calibration      | X     | 15  |       |
| D7: Pattern Recognition      | X     | 10  |       |
| D8: Practical Usability      | X     | 15  |       |

## Critical Issues

[List must-fix problems that significantly impact the Skill's effectiveness]

## Top 3 Improvements

1. [Highest impact improvement with specific guidance]
2. [Second priority improvement]
3. [Third priority improvement]

## Detailed Analysis

[For each dimension scoring below 80%, provide:

- What's missing or problematic
- Specific examples from the Skill
- Concrete suggestions for improvement]
```

---

## Common Failure Patterns

### Pattern 1: The Tutorial

```
Symptom: Explains what PDF is, how Python works, basic library usage
Root cause: Author assumes Skill should "teach" the model
Fix: Claude already knows this. Delete all basic explanations.
     Focus on expert decisions, trade-offs, and anti-patterns.
```

### Pattern 2: The Dump

```
Symptom: SKILL.md is 800+ lines with everything included
Root cause: No progressive disclosure design
Fix: Core routing and decision trees in SKILL.md (<300 lines ideal)
     Detailed content in references/, loaded on-demand
```

### Pattern 3: The Orphan References

```
Symptom: References directory exists but files are never loaded
Root cause: No explicit loading triggers
Fix: Add "MANDATORY - READ ENTIRE FILE" at workflow decision points
     Add "Do NOT Load" to prevent over-loading
```

### Pattern 4: The Checkbox Procedure

```
Symptom: Step 1, Step 2, Step 3... mechanical procedures
Root cause: Author thinks in procedures, not thinking frameworks
Fix: Transform into "Before doing X, ask yourself..."
     Focus on decision principles, not operation sequences
```

### Pattern 5: The Vague Warning

```
Symptom: "Be careful", "avoid errors", "consider edge cases"
Root cause: Author knows things can go wrong but hasn't articulated specifics
Fix: Specific NEVER list with concrete examples and non-obvious reasons
     "NEVER use X because [specific problem that takes experience to learn]"
```

### Pattern 6: The Invisible Skill

```
Symptom: Great content but skill rarely gets activated
Root cause: Description is vague, missing keywords, or lacks trigger scenarios
Fix: Description must answer WHAT, WHEN, and include KEYWORDS
     "Use when..." + specific scenarios + searchable terms

Example fix:
BAD:  "Helps with document tasks"
GOOD: "Create, edit, and analyze .docx files. Use when working with
       Word documents, tracked changes, or professional document formatting."
```

### Pattern 7: The Wrong Location

```
Symptom: "When to use this Skill" section in body, not in description
Root cause: Misunderstanding of three-layer loading
Fix: Move all triggering information to description field
     Body is only loaded AFTER triggering decision is made
```

### Pattern 8: The Over-Engineered

```
Symptom: README.md, CHANGELOG.md, INSTALLATION_GUIDE.md, CONTRIBUTING.md
Root cause: Treating Skill like a software project
Fix: Delete all auxiliary files. Only include what Agent needs for the task.
     No documentation about the Skill itself.
```

### Pattern 9: The Freedom Mismatch

```
Symptom: Rigid scripts for creative tasks, vague guidance for fragile operations
Root cause: Not considering task fragility
Fix: High freedom for creative (principles, not steps)
     Low freedom for fragile (exact scripts, no parameters)
```

---

## Quick Reference Checklist

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SKILL EVALUATION QUICK CHECK                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  KNOWLEDGE DELTA (most important):                                      │
│    [ ] No "What is X" explanations for basic concepts                   │
│    [ ] No step-by-step tutorials for standard operations                │
│    [ ] Has decision trees for non-obvious choices                       │
│    [ ] Has trade-offs only experts would know                           │
│    [ ] Has edge cases from real-world experience                        │
│                                                                         │
│  MINDSET + PROCEDURES:                                                  │
│    [ ] Transfers thinking patterns (how to think about problems)        │
│    [ ] Has "Before doing X, ask yourself..." frameworks                 │
│    [ ] Includes domain-specific procedures Claude wouldn't know         │
│    [ ] Distinguishes valuable procedures from generic ones              │
│                                                                         │
│  ANTI-PATTERNS:                                                         │
│    [ ] Has explicit NEVER list                                          │
│    [ ] Anti-patterns are specific, not vague                            │
│    [ ] Includes WHY (non-obvious reasons)                               │
│                                                                         │
│  SPECIFICATION (description is critical!):                              │
│    [ ] Valid YAML frontmatter                                           │
│    [ ] name: lowercase, ≤64 chars                                       │
│    [ ] description answers: WHAT does it do?                            │
│    [ ] description answers: WHEN should it be used?                     │
│    [ ] description contains trigger KEYWORDS                            │
│    [ ] description is specific enough for Agent to know when to use     │
│                                                                         │
│  STRUCTURE:                                                             │
│    [ ] SKILL.md < 500 lines (ideal < 300)                               │
│    [ ] Heavy content in references/                                     │
│    [ ] Loading triggers embedded in workflow                            │
│    [ ] Has "Do NOT Load" for preventing over-loading                    │
│                                                                         │
│  FREEDOM:                                                               │
│    [ ] Creative tasks → High freedom (principles)                       │
│    [ ] Fragile operations → Low freedom (exact scripts)                 │
│                                                                         │
│  USABILITY:                                                             │
│    [ ] Decision trees for multi-path scenarios                          │
│    [ ] Working code examples                                            │
│    [ ] Error handling and fallbacks                                     │
│    [ ] Edge cases covered                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## The Meta-Question

When evaluating any Skill, always return to this fundamental question:

> **"Would an expert in this domain, looking at this Skill, say:** **'Yes, this captures knowledge that took me years to learn'?"**

If the answer is yes → the Skill has genuine value. If the answer is no → it's compressing what Claude already knows.

The best Skills are **compressed expert brains** — they take a designer's 10 years of aesthetic accumulation and compress it into 43 lines, or a document expert's operational experience into a 200-line decision tree.

What gets compressed must be things Claude doesn't have. Otherwise, it's garbage compression.

---

## Self-Evaluation Note

This Skill (skill-judge) should itself pass evaluation:

- **Knowledge Delta**: Provides specific evaluation criteria Claude wouldn't generate on its own
- **Mindset**: Shapes how to think about Skill quality, not just checklist items
- **Anti-Patterns**: "NEVER Do When Evaluating" section with specific don'ts
- **Specification**: Valid frontmatter with comprehensive description
- **Progressive Disclosure**: Self-contained, no external references needed
- **Freedom**: Medium freedom appropriate for evaluation task
- **Pattern**: Follows Tool pattern with decision frameworks
- **Usability**: Clear protocol, report template, quick reference

Evaluate this Skill against itself as a calibration exercise.

---

## Complete Worked Evaluation Example

This section demonstrates the full evaluation protocol applied to a real, moderately complex Skill: **mcp-builder**.

### Context

**Skill Being Evaluated**: mcp-builder (Model Context Protocol builder guidance)  
**Pattern**: Process  
**Approximate lines**: 450  
**References**: Yes, includes `/scripts` and `/examples`

### Step 1: Knowledge Delta Scan

Reading `mcp-builder` SKILL.md, mark each major section:

```
[E] "MCP Server Patterns" section (lines 45-120)
    - Claude doesn't know proprietary MCP design patterns
    - Shows when to use each phase (requirements, scaffolding, etc)
    - Worth keeping

[E] "4-Phase Development Workflow" (lines 130-280)
    - Specific ordering: SDK choice → schema design → implementation → testing
    - Non-obvious that testing comes AFTER implementation
    - Expert knowledge about phase dependencies

[A] "What is MCP?" intro (lines 1-20)
    - Claude knows basic concepts
    - Brief, useful as activation reminder
    - Acceptable activation content

[E] "Common Pitfalls" section (lines 340-410)
    - "NEVER expose database passwords in tool schemas"
    - "NEVER skip input validation in tools"
    - These are things developers step on
    - Worth keeping

[R] "How to use JSON" subsection (lines 200-210)
    - Claude definitely knows JSON syntax
    - Should be deleted or shortened to 2 lines

[R] "Best practices for error handling" (lines 260-275)
    - Generic error handling advice
    - Not MCP-specific
    - Should be cut or moved to references
```

**Knowledge Delta Calculation**:

- Expert sections: ~350 lines (77%)
- Activation sections: ~25 lines (6%)
- Redundant sections: ~75 lines (17%)

**E:A:R Ratio**: 77:6:17 → **Passes threshold** (>70% Expert)

### Step 2: Structure Analysis

```
Frontmatter:
  name: mcp-builder ✓ (lowercase, ≤64 chars)
  description: "Build Model Context Protocol servers with best practices..." ✓

SKILL.md size: 450 lines (within Process pattern range of ~200 lines, on longer side)

References directory structure:
  /scripts/setup-mcp.sh (utility script)
  /scripts/test-mcp.ts (test harness)
  /examples/simple-weather-server/ (worked example)
  /examples/advanced-db-server/ (advanced example)

Pattern identified: Process (phased workflow, multiple checkpoints)

Loading triggers check:
  Line 210: "MANDATORY - READ ENTIRE FILE: examples/simple-weather-server"
  Line 285: "Do NOT Load advanced-db-server unless building production tool"
  ✓ Triggers are explicit and conditional
```

### Step 3: Score Each Dimension

| Dimension | Score | Justification |
| --- | --- | --- |
| **D1: Knowledge Delta** | 18/20 | E:A:R ratio is 77:6:17 (excellent). Minor redundancy in JSON section could be eliminated. |
| **D2: Mindset + Procedures** | 13/15 | Strong thinking frameworks ("Before choosing SDK, consider..."). Domain procedures are MCP-specific (4 phases, schema validation). Missing conditional branching for edge cases like "what if you need custom transport?" |
| **D3: Anti-Patterns** | 14/15 | "NEVER expose secrets", "NEVER skip validation" are specific and experience-based. Could add 1-2 more patterns about common architecture mistakes. |
| **D4: Specification** | 15/15 | Valid frontmatter, description has WHAT (build MCP servers), WHEN (protocol integration), KEYWORDS (Model Context Protocol, server setup). Perfect. |
| **D5: Progressive Disclosure** | 13/15 | SKILL.md is 450 lines (acceptable for Process pattern). References are loaded conditionally. Could benefit from "Do NOT Load" guidance for advanced examples in simple workflows. |
| **D6: Freedom Calibration** | 14/15 | Process pattern = medium freedom. "4-Phase Workflow" is prescriptive but allows variation within phases. One section (validation) could be higher freedom for edge cases. |
| **D7: Pattern Recognition** | 9/10 | Exemplifies Process pattern well (phased, checkpoints, medium freedom). Minor deviation: some procedural steps could be more thinking-focused. |
| **D8: Practical Usability** | 11/15 | Clear protocol and examples. Missing: edge case handling for "what if SDK choice fails?", fallback testing strategies, troubleshooting common MCP errors. |

**Total Score**: 18 + 13 + 14 + 15 + 13 + 14 + 9 + 11 = **107/120**  
**Percentage**: 89.2%  
**Grade**: B (Good — minor improvements needed)

### Step 4: Calculate Grade

```
Total = 107 points
Max = 120 points
Percentage = 89.2%
Grade = B (Good)
```

Interpretation: This is a solid, production-ready Skill with clear room for improvement. The knowledge delta is strong (Expert content dominates), but practical usability could be strengthened with edge case coverage.

### Step 5: Critical Issues Report

#### Issue 1: Missing Edge Case Handling (D8) — Medium Impact

**Problem**: The 4-Phase Workflow is linear. What if SDK choice fails?

**Evidence**:

- Lines 140-180: Phase 1 assumes SDK selection will succeed
- No fallback guidance if chosen SDK doesn't support required features
- No troubleshooting for common SDK problems

**Impact**: Agent may get stuck if real-world constraints force SDK re-evaluation mid-workflow.

**Fix**: Add decision tree:

```markdown
## Phase 1 Troubleshooting

IF SDK fails requirements check: → Consider alternative SDKs (list provided) → May need to restart Phase 1 → NEVER force wrong SDK just to avoid restart
```

#### Issue 2: Redundant JSON Section (D1) — Low Impact

**Problem**: 10-line JSON explanation wastes tokens.

**Evidence**:

- Lines 200-210: Explains JSON syntax with examples
- Claude absolutely knows JSON already

**Impact**: ~10 token waste, not critical but violates principle.

**Fix**: Delete entirely or reduce to 1-line reference: "All tool schemas use JSON format; see [external JSON reference]"

#### Issue 3: Incomplete Anti-Pattern Coverage (D3) — Low Impact

**Problem**: Missing architecture-level pitfall.

**Evidence**:

- "NEVER expose secrets" is good
- Missing: "NEVER design tools that require 10+ API calls" (performance pitfall)
- Missing: "NEVER skip input validation" (already there) vs "NEVER validate too late" (missing nuance)

**Impact**: Advanced users might create inefficient tool designs.

**Fix**: Add architecture pitfalls section with 2-3 new patterns about performance and design.

### Final Report Template

```markdown
# Skill Evaluation Report: mcp-builder

## Summary

- **Total Score**: 107/120 (89.2%)
- **Grade**: B
- **Pattern**: Process (phased workflow, medium freedom)
- **Knowledge Ratio**: E:A:R = 77:6:17
- **Verdict**: Strong foundational Skill with expert MCP knowledge. Minor gaps in edge case handling and D1 optimization reduce score from A to B.

## Dimension Scores

[Table showing 107/120 with breakdown]

## Critical Issues

1. Missing edge case handling (Phase 1 SDK failures) — Medium impact
2. Redundant JSON explanation (10 lines) — Low impact
3. Incomplete anti-pattern coverage (architecture pitfalls) — Low impact

## Top 3 Improvements

1. Add Phase 1 fallback guidance when SDK selection fails
2. Remove redundant JSON section (10-line waste)
3. Add 2-3 architecture pitfalls to anti-pattern list

## Recommendation

**Status**: APPROVED FOR PRODUCTION (Grade B)

This Skill is ready for use. The three recommended improvements would raise score to 110-112/120 (A grade), but not required for production use.
```

### Key Takeaways from This Example

1. **Mark sections E/A/R** — This gives you concrete ratio calculation, not subjective judgment
2. **Quote line numbers** — Reviewers can verify your scoring
3. **Show trade-offs** — "This section isn't ideal, but it's acceptable because..."
4. **Distinguish minor from critical** — Not all issues carry equal weight
5. **Provide concrete fixes** — Not just "this needs work" but "here's what to add"

This example demonstrates that:

- Even good Skills (Grade B, 89%) have improvement paths
- Scoring isn't binary (perfect vs terrible) — most real Skills fall in B-A range
- Edge case handling is a common gap (especially D8)
- Redundancy is the silent score killer — small cutouts add up

---

## Procedure Classification Quiz

To properly evaluate D2 (Mindset + Procedures), you must distinguish between:

- **Domain-Specific Procedures** (Claude wouldn't know) ✓ Keep
- **Generic Procedures** (Claude already knows) ✗ Delete

This quiz calibrates your judgment.

### 10 Examples: Domain-Specific or Generic?

**Example 1**: "Step 1: Open file, Step 2: Find XML namespace, Step 3: Validate schema, Step 4: Apply transform"

**Answer**: MIXED

- Open file = GENERIC (Claude knows)
- Find XML namespace = DOMAIN-SPECIFIC (Office document expert knowledge)
- Validate schema = DOMAIN-SPECIFIC (OOXML-specific requirement)
- Apply transform = GENERIC (standard operation)

**Fix**: Keep "validate schema before transform" (why it's ordered), delete "open file" step.

---

**Example 2**: "Before designing a component, ask yourself: (1) What problem does this solve? (2) Who are the users? (3) What constraints exist?"

**Answer**: GENERIC

- These are universal design thinking questions
- Claude already knows this framework
- This is activation content at best

**Fix**: Delete unless specific to this domain (e.g., "For fintech components, also ask: What compliance requirements apply?")

---

**Example 3**: "OOXML files are ZIP archives. To edit, you must: (1) Unzip, (2) Locate document.xml, (3) Edit XML, (4) Revalidate relationships, (5) Rezip"

**Answer**: DOMAIN-SPECIFIC

- Not obvious that Office documents are zipped XML
- The validation step is non-obvious (easy to miss)
- The ordered sequence is experience-based

**Fix**: Keep entire section. This is expert knowledge.

---

**Example 4**: "Use a loop to iterate through items. Check each item for conditions. Update as needed."

**Answer**: GENERIC

- Standard programming pattern
- Claude knows loops, conditionals, updates
- Zero domain-specific value

**Fix**: Delete entirely.

---

**Example 5**: "MCP tools require input validation. Check that provided parameters match the schema. Return error if validation fails."

**Answer**: MOSTLY GENERIC with DOMAIN elements

- Input validation = GENERIC (standard security practice)
- Validation against MCP schema specifically = DOMAIN-SPECIFIC
- "Return error if fails" = GENERIC

**Fix**: Keep only the domain part: "Input must validate against the tool's declared schema. Validation happens BEFORE tool execution, not after."

---

**Example 6**: "Handle errors gracefully. Don't let exceptions crash the system. Log errors for debugging."

**Answer**: GENERIC

- Error handling = standard software practice
- Graceful degradation = standard pattern
- Logging = standard pattern

**Fix**: Delete unless domain-specific twist exists (e.g., "MCP errors must include error code that client can parse").

---

**Example 7**: "Redlining workflow: Convert Word → Markdown with tracked changes flag. Edit Markdown. Re-import changes back into Word with change markers preserved."

**Answer**: DOMAIN-SPECIFIC

- Non-obvious that Word tracked changes can survive Markdown conversion
- The exact ordering (convert → edit → re-import) is domain expertise
- Claude wouldn't naturally think of this approach

**Fix**: Keep. This is expert workflow knowledge.

---

**Example 8**: "Use try/catch blocks to handle exceptions. Write a catch block for each exception type you expect."

**Answer**: GENERIC

- try/catch = basic programming knowledge
- Exception handling = standard practice

**Fix**: Delete entirely.

---

**Example 9**: "When exporting PDF, check: (1) Are embedded fonts readable post-export? (2) Are vector graphics preserved or rasterized? (3) Is metadata stripped correctly?"

**Answer**: DOMAIN-SPECIFIC

- "Embedded fonts readable post-export" = specific PDF knowledge
- Vector vs raster trade-off = expert consideration
- Metadata stripping = format-specific requirement

**Fix**: Keep. Each checkpoint prevents a real gotcha.

---

**Example 10**: "Write clean code. Use meaningful variable names. Add comments. Test thoroughly."

**Answer**: GENERIC

- All standard software best practices
- Generic advice that applies to everything
- Claude already knows this

**Fix**: Delete entirely.

---

### Scoring Practice

For D2 (Mindset + Procedures), count:

- **Domain-specific procedures kept**: +2 points each
- **Generic procedures deleted**: +1 point each
- **Thinking frameworks present**: +3-5 points
- **Procedures missing when needed**: -2 points
- **Redundant procedures kept**: -1 point each

If a Skill has 10 domain procedures kept and 5 generic ones deleted with strong thinking frameworks = likely 13-15 score.  
If a Skill has 5 domain procedures but 8 generic ones kept = likely 8-11 score.

---

## Evaluating Edge Cases

Real-world evaluation often encounters situations that don't fit neatly. Here's guidance.

### Edge Case 1: Conflicting Dimensions

**Scenario**: Skill scores very high on D1 (20/20 excellent knowledge) but very low on D4 (4/15 vague description).

**Problem**: Good content, terrible discoverability. The Skill won't be used because Agent won't activate it.

**How to score**:

- Score both honestly; don't adjust D1 down just because D4 is weak
- Note in "Critical Issues": "Excellent knowledge delta but poor description means this Skill will rarely be activated"
- Recommendation: "Keep content, rewrite description entirely"
- Overall grade: B (not A) because discoverability failure affects practical value

**Total score impact**: Good D1 (20) can't compensate for bad D4 (4). Total might be 95/120 = B grade.

---

### Edge Case 2: Skill Is Evolving Over Time

**Scenario**: Skill is v1.2, known to be incomplete. Author plans major update in 2 weeks.

**How to handle**:

- Evaluate current state as-is (v1.2)
- Note in report: "Evaluation of v1.2 (dated 2026-05-04). Author indicated v2.0 overhaul planned for 2026-05-18."
- Score what exists now, don't speculate on future versions
- Optional: Suggest "Re-evaluate after v2.0 release"

**Example report note**:

```
## Version Note

This evaluation covers mcp-builder v1.2 (2026-05-04).
The author indicated a major v2.0 redesign is planned for late May 2026.
This evaluation should not be considered final; recommend re-evaluation after v2.0 release.
```

---

### Edge Case 3: Skill Doesn't Match Any Standard Pattern

**Scenario**: Evaluated Skill is hybrid — partly Mindset, partly Process, doesn't fit neatly.

**How to handle**:

1. Identify which pattern dominates (>50% of content)
2. Score D7 (Pattern Recognition) honestly for the mismatch
3. Note in Critical Issues: "Skill mixes Mindset and Process patterns; consider splitting into two Skills"

**Example**:

- Skill is 60% philosophy/thinking frameworks = Mindset pattern
- Skill is 40% phased workflow = Process pattern
- Verdict: "Primarily Mindset pattern with Process elements; consider extracting Process content into separate Skill"
- D7 score: 6/10 (clear pattern with significant deviation)

---

### Edge Case 4: Skill Relies on External Tool/Service That May Become Unavailable

**Scenario**: Skill teaches "how to build with API X" but API X is proprietary and might be discontinued.

**How to handle**:

- Evaluate current utility (it's useful now)
- Note in report: "Skill depends on [external service]. Usefulness may degrade if service changes."
- Don't penalize harshly; many valuable Skills depend on external tools
- Suggestion: "Consider adding section on 'If API X becomes unavailable, alternatives are [Y, Z]'"

---

### Edge Case 5: Skill Is Intentionally Opinionated/Controversial

**Scenario**: Skill teaches "always use Vim, never use IDE for serious coding" — a strong opinion.

**How to handle**:

- Don't penalize for being opinionated; expert knowledge often includes strong views
- D6 (Freedom) should be lower (high specificity appropriate to opinionated stance)
- D3 (Anti-Patterns) may include "NEVER use IDE for [specific reason]"
- Score based on whether the opinion is supported with expert reasoning
- Note: "Skill takes strong stance on tool choice with detailed justification. Valid expert opinion."

---

### Summary of Edge Cases

| Edge Case | Key Principle | How to Score |
| --- | --- | --- |
| Conflicting dimensions | Score both honestly; overall grade reflects practical impact | Don't hide weak scores in strong ones |
| Evolving Skill | Evaluate version as-is; note timeline | Set expectation for re-evaluation |
| Non-standard pattern | Identify dominant pattern; score mismatch in D7 | Point out hybrid nature as improvement area |
| External dependency | Useful now, note risk; don't penalize heavily | Suggest mitigation (alternatives, fallbacks) |
| Opinionated stance | Don't penalize; check if reasoned | Higher freedom typically appropriate for opinions |

The goal is **honest evaluation** that acknowledges real-world complexity without letting edge cases excuse weak fundamentals.
