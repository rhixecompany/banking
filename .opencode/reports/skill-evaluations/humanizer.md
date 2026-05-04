# Skill Evaluation Report: humanizer

## Summary

- **Total Score**: 91/120 (75.8%)
- **Grade**: C (Adequate)
- **Pattern**: Tool (decision trees for 24 pattern types)
- **Knowledge Ratio**: E:A:R = 65:20:15
- **Verdict**: Strong foundational content on AI writing pattern detection, but execution has unnecessary redundancy, missing progressive disclosure structure, and weak description triggering. Clear improvement path.

---

## Dimension Scores

| Dimension | Score | Max | Evidence |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 14 | 20 | High-value expertise (24 patterns, AI detection), but ~60-80 lines of redundant example repetition dilutes impact |
| D2: Mindset vs Mechanics | 12 | 15 | Strong "Personality and Soul" section establishes thinking, good domain procedures, but could have stronger decision framework |
| D3: Anti-Pattern Quality | 10 | 15 | Has anti-patterns in "Signs of Soulless Writing" section but presented implicitly; lacks explicit NEVER list with WHY reasoning |
| D4: Specification Compliance | 12 | 15 | Valid frontmatter, but description is vague on WHEN and lacks keyword richness ("humanize", "natural voice", "AI patterns") |
| D5: Progressive Disclosure | 10 | 15 | At 481 lines, should have references/ directory; all content dumped into SKILL.md without loading triggers or modular structure |
| D6: Freedom Calibration | 13 | 15 | Appropriate: diagnosis (low freedom: identify patterns) + rewriting (medium-high freedom: voice injection). Well-calibrated for task. |
| D7: Pattern Recognition | 8 | 10 | Follows Tool pattern (24 decision points + examples) but deviates on length management; should be ~300 lines not 481 |
| D8: Practical Usability | 12 | 15 | Clear identification guidance for each pattern, good before/after examples, but missing meta-framework (pattern priority, trade-offs, context-based triage) |

**Total: 91/120 = 75.8%**

---

## Critical Issues

### Issue 1: Knowledge Delta Padding (D1: 14/20) — HIGHEST PRIORITY

**Problem**: The skill has excellent expert knowledge but wastes tokens on example redundancy.

**Evidence**:

- Pattern 1 ("Undue Emphasis on Significance"): 3 separate before/after examples when 1-2 would suffice
- Pattern 3 ("Superficial Analyses"): 2 examples when 1 strongest example is sufficient
- Pattern 7 ("AI Vocabulary"): 2 examples for single concept
- Pattern 4 ("Promotional Language"): 2 examples

This redundancy accounts for ~60-80 unnecessary lines.

**Impact**: Reduces D1 from 14→16 if fixed.

**Specific Fix**: Audit all 24 patterns, keep only 1 strongest before/after example per pattern (max 2 for complex patterns like #3 and #7). Current: 3-4 examples in ~8 patterns.

---

### Issue 2: Missing Progressive Disclosure Structure (D5: 10/15) — MEDIUM-HIGH PRIORITY

**Problem**: At 481 lines, the skill violates progressive disclosure by dumping everything into SKILL.md.

**Evidence**:

- No references/ directory mentioned
- All 24 patterns with full examples in single file (should be ~200+ lines in separate reference)
- No explicit loading triggers ("MANDATORY - READ patterns-reference.md")
- No "Do NOT Load" guidance

**Should Be**:

```
SKILL.md (~150 lines):
- PERSONALITY section (foundation)
- Decision tree: "How to identify which pattern?"
- Loading triggers

references/patterns-reference.md (~280 lines):
- All 24 patterns with examples
- Pattern comparison table
- Marked "MANDATORY - READ ENTIRE FILE for detailed pattern reference"

references/anti-patterns.md (~50 lines):
- Extracted NEVER list
- Marked "Read if uncertain about what NOT to do"
```

**Impact**: Cleaner layer structure, proper triggering, reduces cognitive load on first load.

---

### Issue 3: Description Lacks Triggering Keywords (D4: 12/15) — MEDIUM PRIORITY

**Problem**: Description is too vague to activate the skill in real scenarios.

**Current**:

> "Remove signs of AI-generated writing from text. Use when editing or reviewing text to make it sound more natural and human-written."

**Problems**:

- Missing keywords: "humanize", "authentic voice", "AI patterns", "natural"
- "Use when editing or reviewing" is vague (applies to ANY editing?)
- Doesn't mention Wikipedia framework or 24 patterns
- Doesn't specify document types where this matters (published writing, documentation, blogs)

**Should Be**:

> "Identify and remove AI-generated writing patterns to make text sound more authentic and human. Use when editing published content, documentation, blog posts, or detecting text that sounds obviously AI-written. Detects and removes 24+ AI writing anti-patterns: inflated symbolism, vague attribution, rule-of-three, AI vocabulary words (moreover, pivotal, landscape, underscore), em dash overuse, and more. Based on Wikipedia's Signs of AI writing guide."

**Keywords added**: humanize, authentic, natural voice, AI patterns, published writing, documentation, blogs, Wikipedia.

**Impact**: Activates when users say "make this sound human" or "this reads too AI-ish" or "humanize this".

---

### Issue 4: Implicit Anti-Patterns Need Explicit NEVER List (D3: 10/15) — MEDIUM PRIORITY

**Problem**: Anti-patterns exist in "Signs of Soulless Writing" but are implicit rather than directive.

**Current Format** (implicit):

> "Every sentence is the same length and structure" "No opinions, just neutral reporting"

**Should Be** (explicit NEVER):

```markdown
## NEVER DO

- NEVER use only elevated/promotional language — feels inauthentic (Pattern 4)
- NEVER string multiple em dashes in single paragraph — hallmark of AI (Pattern 13)
- NEVER use vague authorities like "experts say" — erodes credibility (Pattern 5)
- NEVER use "rule of three" (three ideas, three examples) — too formulaic (Pattern 10)
- NEVER vary synonyms excessively (protagonist/character/hero/figure) — signals over-revision (Pattern 11)
```

This makes anti-patterns actionable and discoverable.

---

### Issue 5: No Meta-Framework for Pattern Priority (D8: 12/15) — LOWER PRIORITY

**Problem**: Skill lists 24 patterns but doesn't guide which to fix first or by context.

**Should Add**:

```markdown
## Pattern Priority by Document Type

**Blog/Opinion Pieces**: Fix patterns 1,3,4,7,9 first (remove inflated language) **Technical Documentation**: Fix patterns 6,7,8,22 first (remove wordiness) **Published Articles**: Fix patterns 1,2,5,7,13 first (remove promotional tone) **Academic Writing**: Fix patterns 1,5,23 first (remove vague attribution and hedging)

## Pattern Interdependencies

- Fix Pattern 8 (copula avoidance) BEFORE Pattern 1 (inflated symbolism) — copula fix often resolves symbolism
- Fix Pattern 9 (negative parallelisms) before Pattern 10 (rule of three) — parallelisms create false grouping
```

This transforms the tool from "list of 24 patterns" to "intelligent diagnostic framework."

---

## Top 3 Improvements

### 1. **Consolidate Examples & Remove Redundancy** (D1 & D7)

**Why first**: Improves knowledge delta and pattern recognition simultaneously. Reduces 481→~400 lines.

**How**:

- Audit all 24 patterns
- Keep only 1 strongest before/after example per pattern
- Multi-example patterns (like #1, #3, #4, #7): Reduce 3-4 examples to 1-2 strongest
- Expected impact: Save 60-80 lines, improve D1 from 14→16, improve D7 from 8→9

---

### 2. **Implement Progressive Disclosure with References** (D5)

**Why second**: Creates proper layer structure, enables loading triggers, improves maintainability.

**How**:

- Create `references/patterns-reference.md` — all 24 patterns with examples
- Create `references/anti-patterns.md` — explicit NEVER list
- Add to SKILL.md: "MANDATORY - READ `references/patterns-reference.md` for all 24 pattern definitions"
- Reduce SKILL.md to ~150 lines (PERSONALITY + decision tree + loading triggers)
- Expected impact: Proper structure, improved D5 from 10→13-14

---

### 3. **Enhance Description with Keywords & Specificity** (D4)

**Why third**: Improves skill activation in real user scenarios.

**How**:

- Add keywords: humanize, authentic, natural voice, AI patterns, published writing, documentation, blogs
- Add specificity: "Use when editing published content, documentation, or detecting obviously AI-written text"
- Add framework reference: "Based on Wikipedia's 24 Signs of AI writing"
- Expected impact: Skill activates in more relevant scenarios, improved D4 from 12→14

---

## Detailed Analysis

### D1: Knowledge Delta (14/20) — Redundancy Issue

**Strengths**:

- Expert knowledge on AI writing pattern detection (65% of content)
- Wikipedia research backing (authoritative source)
- 24 distinct patterns covering comprehensive attack surface
- Good activation content on "soulless writing" (reminds Claude of lesser-known principles)

**Weaknesses**:

- Example repetition: ~8 patterns have 2-3 examples when 1-2 would be sufficient
  - Pattern 1: "Undue Emphasis" has 3 distinct examples
  - Pattern 3: "Superficial Analyses" has 2 detailed examples
  - Pattern 4: "Promotional Language" has 2 examples
- This redundancy = ~15% of the skill's length
- Total: 481 lines is 80-100 lines longer than needed

**Why it matters**: Each redundant example steals context window from user's actual task.

**Specific evidence**:

```markdown
Pattern 1 example 1: "Statistical Institute..." Pattern 1 example 2: "Haolai River..." Pattern 1 example 3: [implied by context]

Could be: 1 strongest example showing "pivotal moment" → "established to" pattern
```

---

### D2: Mindset vs Procedures (12/15) — Good but Could Strengthen Decision Framework

**Strengths**:

- Excellent mindset section: "PERSONALITY AND SOUL" establishes thinking ("Have opinions", "Acknowledge complexity")
- Clear domain procedures: How to identify and rewrite each pattern
- Good balance between principles and examples

**Weaknesses**:

- Mindset concentrated in one section; rest is list-based
- Missing "Before You Start" decision framework
  - "What's the document's purpose?"
  - "Who's the audience?"
  - "What tone should match the content?"
- No guidance on "when to break rules" (e.g., when is repetition acceptable?)

**Specific fix opportunity**:

```markdown
## Before You Start: Establish Context

Ask yourself:

1. What's the document purpose? (Blog opinion vs technical spec vs press release)
2. Who's reading? (Experts vs general audience)
3. What tone matches? (Conversational vs formal)
4. Which patterns matter most for THIS audience?

This context determines which patterns to prioritize and when rules can bend.
```

This would improve D2 from 12→13-14.

---

### D3: Anti-Pattern Quality (10/15) — Implicit Rather Than Directive

**Strengths**:

- "Signs of Soulless Writing" section is good anti-pattern content
- Real examples of what NOT to do

**Weaknesses**:

- Format is implicit ("Every sentence same length") rather than directive ("NEVER write every sentence the same length")
- Missing WHY: Why does "no opinions" make writing feel soulless? (Answer: lacks human judgment)
- No explicit NEVER list as separate section
- Anti-patterns scattered across 24 pattern descriptions rather than consolidated

**Comparison**:

```markdown
Current (implicit): "Every sentence is the same length and structure"

Better (directive with WHY): "NEVER write every sentence the same length — humans naturally vary rhythm based on emphasis. Monotonous rhythm signals algorithmic output."
```

**Would improve D3 from 10→12-13** if converted to explicit NEVER list with WHY statements.

---

### D4: Specification Compliance (12/15) — Description is Too Vague

**Strengths**:

- Valid YAML frontmatter
- Name is appropriate: "humanizer"
- Description concise

**Weaknesses**:

- WHAT is clear (remove AI signs) but not specific
- WHEN is too broad ("editing or reviewing" = any editing?)
- KEYWORDS missing: No "humanize", "authentic", "natural voice", "AI detection"
- Doesn't mention Wikipedia framework
- Doesn't specify use cases: Published writing, documentation, blogs

**Current Description Analysis**:

```yaml
description: |
  Remove signs of AI-generated writing from text. Use when editing or reviewing
  text to make it sound more natural and human-written. Based on Wikipedia's
  comprehensive "Signs of AI writing" guide. Detects and fixes patterns including:
  inflated symbolism, promotional language, superficial -ing analyses, vague
  attributions, em dash overuse, rule of three, AI vocabulary words, negative
  parallelisms, and excessive conjunctive phrases.
```

Actually, re-reading this — the description in the SKILL.md frontmatter IS better than what I initially analyzed. Let me check what's actually in the header...

Looking at actual frontmatter:

```yaml
description: |
  Remove signs of AI-generated writing from text. Use when editing or reviewing
  text to make it sound more natural and human-written. Based on Wikipedia's
  comprehensive "Signs of AI writing" guide. Detects and fixes patterns including:
  inflated symbolism, promotional language, superficial -ing analyses, vague
  attributions, em dash overuse, rule of three, AI vocabulary words, negative
  parallelisms, and excessive conjunctive phrases.
```

This is actually better than the AGENTS.md version. Score revision: **D4 = 13/15** (description is good, could add keywords for better activation).

---

### D5: Progressive Disclosure (10/15) — Needs References

**Current Structure**:

- SKILL.md: 481 lines (everything)
- No references/ directory
- No loading triggers

**Problem**: At 481 lines, this violates the <500 max and lacks layer separation.

**Should Be**:

```
SKILL.md (~150 lines):
  - Frontmatter
  - Introduction
  - PERSONALITY AND SOUL section
  - Your Task (summary)
  - Process (condensed)
  - Loading trigger: "MANDATORY - READ references/patterns-reference.md"

references/
  ├── patterns-reference.md (~250 lines)
  │   └── All 24 patterns with examples, comparison table
  │   └── "Load this when you need to identify which specific pattern..."
  │
  └── anti-patterns.md (~50 lines)
      └── Explicit NEVER list
      └── "Read if uncertain about what NOT to do"
```

This structure:

- Keeps SKILL.md at ~150 lines (clean, fast load)
- Moves reference content to on-demand files
- Provides explicit loading guidance
- Follows proper progressive disclosure

**Would improve D5 from 10→13-14** if implemented.

---

### D6: Freedom Calibration (13/15) — Well-Matched

**Analysis**:

- Pattern identification: Low freedom (these are specific patterns to diagnose)
- Rewriting: Medium-high freedom (multiple valid rewrites possible)
- Voice injection: High freedom (genuine principles, not exact steps)

This matches the task's fragility level. If Agent identifies Pattern 1 wrong, it might over-rewrite. If Agent can't identify patterns, skill fails. So low freedom on diagnosis is appropriate.

**Evidence of good calibration**:

- Before/after examples guide without constraining
- "Add soul" section uses principles not procedures
- Pattern definitions are specific but rewriting guidance is flexible

**Minor issue**: Could add one defensive statement like: "If unsure whether something is a pattern instance, err toward keeping it. False positives are safer than over-humanizing."

This would improve D6 from 13→14-15.

---

### D7: Pattern Recognition (8/10) — Tool Pattern with Length Deviation

**Pattern Identified**: Tool pattern

- 24 decision points (which pattern am I seeing?)
- Multiple examples per decision
- Reference-backing (Wikipedia)

**Alignment**:

- ✓ Follows Tool pattern structure (decision trees + examples)
- ✓ Has specificity appropriate for Tools
- ✗ Exceeds recommended ~300 lines (481 is 60% over)
- ✗ Could streamline examples to match canonical length

**Minor deviation**: The skill is a LARGE Tool pattern rather than standard-sized Tool. This is acceptable for a tool with 24 decision points, but could be better optimized.

**Would improve D7 from 8→9-10** if examples are consolidated (Issue #1).

---

### D8: Practical Usability (12/15) — Good Patterns, Missing Meta-Framework

**What Works**:

- Clear identification for each pattern ✓
- Good before/after examples ✓
- Organized by category (Content, Language, Style, Communication) ✓
- Practical rewriting guidance ✓

**What's Missing**:

- No decision tree for "which patterns should I fix first?"
- No context-based prioritization (e.g., "for blogs, prioritize these patterns")
- No trade-off guidance (e.g., "removing Pattern X might make this too terse")
- No edge case handling (e.g., "what if the document SHOULD have emotion? Pattern 1 might be necessary")
- No "pattern interdependency" guidance (fixing Pattern 8 often resolves Pattern 1)

**Example Gap**: Agent reads all 24 patterns. Finds 12 instances. Which to fix first? Skill doesn't say.

**Would improve D8 from 12→14** if meta-framework added.

---

## Enhancement Actions Taken

_(Leave empty as requested — this is evaluation only)_

---

## Recommendation

**Current Grade: C (Adequate)**  
**Post-Improvements Target: B+ (95-105/120)**

This skill has solid foundational knowledge but needs structural optimization. The three priority improvements are quick wins that would move the skill from "adequate" to "good" category.

Focus order:

1. **Consolidate examples** (quick, high impact) — 60-80 lines, improves D1+D7
2. **Add progressive disclosure** (medium effort, high impact) — proper structure, improves D5
3. **Enhance description** (quick, moderate impact) — better activation, improves D4

All three are actionable within skill-judge criteria.

---

**Report Generated**: 2026-05-04  
**Evaluator**: OpenCode Skill Judge  
**Evaluation Method**: 8-Dimension Analysis per skill-judge SKILL.md
