# Skill Evaluation Report: writing-clearly-and-concisely

## Summary

- **Total Score**: 97/120 (80.8%)
- **Grade**: B (Good — minor improvements needed)
- **Pattern**: Hybrid Mindset + Navigation
- **Knowledge Ratio**: E:A:R ≈ 45:40:15
- **Verdict**: Strong anti-pattern knowledge with Strunk foundation, but redundant rule listing undermines knowledge delta. Practical and usable; needs tighter structure.

---

## Dimension Scores

| Dimension | Score | Max | Status |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 13 | 20 | Mixed: Expert anti-patterns, Redundant rules |
| D2: Mindset + Procedures | 11 | 15 | Good: Framework + domain procedures, missing decision tree |
| D3: Anti-Pattern Quality | 14 | 15 | Excellent: Specific, expert-grade LLM pattern list |
| D4: Specification Compliance | 12 | 15 | Good: Clear description, missing explicit trigger scenarios |
| D5: Progressive Disclosure | 13 | 15 | Good: Layered structure, missing "Do NOT Load" guidance |
| D6: Freedom Calibration | 14 | 15 | Excellent: Appropriate high freedom for creative writing |
| D7: Pattern Recognition | 8 | 10 | Adequate: Hybrid pattern, structural inconsistency |
| D8: Practical Usability | 12 | 15 | Good: Works for common cases, edge cases missing |

---

## Critical Issues

### 1. Knowledge Delta Waste (D1: -7 points)

**Problem**: The full "Elementary Rules of Usage" and "Elementary Principles of Composition" lists (rules 1-18) are basics Claude already knows. This is tutorial-level content, not expert knowledge compression.

**Evidence**:

- Rules like "Form possessive singular by adding 's," "Use comma after each term in series," "Use active voice" are standard grammar instruction
- Claude readily produces these patterns; the Skill isn't teaching new capabilities

**Impact**: ~40% of tokens wasted on knowledge Claude already has. The REAL value is in the "AI Writing Patterns to Avoid" section (expert knowledge), which gets diluted.

**Fix**: Delete the full rules list. Keep ONLY the 6 bolded/highlighted rules (10, 11, 12, 13, 16, 18) and expand the AI patterns section with more examples, reasoning, and edge cases.

---

### 2. Missing Decision Framework (D2: -4 points)

**Problem**: No upfront decision tree for "What kind of writing problem am I solving?"

**Current flow**: User provides prose → Skill says "here are Strunk's rules" → User must figure out which reference to load.

**Better flow**:

```markdown
## Before Editing, Ask Yourself

- **Clarity**: Are sentences confusing? Are ideas buried? → Load `03-elementary-principles-of-composition.md`
- **Brevity**: Is the prose too wordy? Too many adjectives? → Load `03-elementary-principles-of-composition.md`
- **Tone**: Does it sound AI-generated? Too puffed-up? → Use AI patterns checklist (this section)
- **Grammar/Punctuation**: Are there comma errors? Tense shifts? → Load `02-elementary-rules-of-usage.md`
```

This transforms the Skill from "here are resources" to "here's how experts think about writing problems."

---

### 3. Specification Incompleteness (D4: -3 points)

**Problem**: Description lacks explicit trigger scenarios. The skill is invisible to Agent unless user mentions "Strunk" or "clarity."

**Current description**:

```
Use when writing prose humans will read—documentation, commit messages,
error messages, explanations, reports, or UI text. Applies Strunk's
timeless rules for clearer, stronger, more professional writing.
```

**Missing triggers**:

- "WHEN user says: 'make this clearer'"
- "WHEN user asks: 'improve this writing'"
- "WHEN AI-generated text needs humanizing"
- "WHEN prose contains: puffery, overused adjectives, passive voice"

**Better description** (example):

```
Improve prose clarity and force using Strunk's principles and anti-pattern
detection. Use when: (1) editing documentation for clarity, (2) cutting
wordiness from explanations, (3) removing AI-generated puffery and clichés,
(4) improving commit messages or UI copy. Includes Strunk's active voice,
concrete language, and omit-needless-words rules. Also identifies LLM
regression patterns: puffery ("pivotal", "crucial"), empty "-ing" phrases,
promotional adjectives, overused vocabulary ("leverage", "multifaceted").
```

---

### 4. Missing "Do NOT Load" Guidance (D5: -2 points)

**Problem**: No anti-loading triggers. When should Agent NOT load certain references?

**Examples of missing guidance**:

- "Do NOT load `04-a-few-matters-of-form.md` unless editing formal documentation with specific formatting requirements"
- "Do NOT load `05-words-and-expressions-commonly-misused.md` for general prose editing — use only when debugging specific word choices"

This prevents cognitive overload and keeps Agent focused on the minimal necessary content.

---

### 5. Structural Inconsistency (D7: -2 points)

**Problem**: The Skill mixes two patterns awkwardly.

- **Mindset pattern**: "Write with clarity and force," AI anti-patterns, philosophical framing
- **Navigation pattern**: Reference table with file routing

The "Elementary Rules" section (1-18) bridges both but doesn't fit either cleanly. It reads prescriptive (Tool pattern) when the Skill is supposed to be principle-based (Mindset).

**Fix**: Restructure to pure Mindset pattern: Philosophy → Anti-patterns → References as appendix.

---

### 6. Edge Cases Undercovered (D8: -3 points)

**Problem**: Doesn't address domain-specific variations.

**Missing scenarios**:

- **Technical documentation**: Rules differ (brevity < clarity; accept more jargon)
- **User-facing copy**: Rules differ (warmth matters; formality matters less)
- **Comments in code**: Rules differ (very terse; abbreviations OK)
- **Non-English prose**: How do Strunk's rules (heavily English-centric) apply?

---

## Top 3 Improvements

### 1. **Delete Redundant Rules List, Expand AI Patterns** (Highest Impact)

**Action**:

- Delete the full "Elementary Rules of Usage" (1-7) and "Elementary Principles of Composition" (8-18) list
- Keep ONLY rules 10, 11, 12, 13, 16, 18 (the bolded ones) as brief callouts
- TRIPLE the AI patterns section with:
  - More specific examples of puffery ("vital" vs. "important", "enduring legacy" vs. "lasting impact")
  - Patterns broken down by type (vocabulary overuse, structural patterns, emotional cues)
  - Why these patterns emerge ("LLMs optimize for training data, which includes marketing/hype writing")
  - Anti-examples showing correct vs. AI-generated versions

**Token cost**: ~2,000 tokens moved from references, ~500 added. Net: manageable.

**Impact on D1**: Improves from 13→17 (eliminating ~500 tokens of redundancy, focusing on expert knowledge).

---

### 2. **Add Decision Framework** (High Impact)

**Action**:

- Insert "Before Editing, Ask Yourself" section after Overview
- Create 4-5 scenarios with decision trees:
  - "Is the prose unclear or is it just long?" → leads to different references
  - "Does it sound AI-generated?" → use AI patterns list
  - "Are there grammar errors?" → load reference 02

**Token cost**: ~300 tokens.

**Impact on D2**: Improves from 11→13 (provides the thinking framework D2 measures).

---

### 3. **Enhance Description with Trigger Scenarios** (Medium Impact)

**Action**:

- Expand description field to ~150 characters, include "WHEN user says..." and "WHEN text contains..." triggers
- Add keywords: "puffery", "AI-generated", "clarity", "Strunk", "wordiness"

**Example**:

```yaml
description: "Improve prose clarity and force using Strunk's principles.
Use when editing documentation, cutting wordiness, or removing AI-generated
puffery. Identifies patterns: overused adjectives (groundbreaking, seamless),
empty '-ing' phrases (ensuring, showcasing), promotional language. Applies
active voice, concrete language, omit-needless-words rules."
```

**Token cost**: ~50 tokens.

**Impact on D4**: Improves from 12→14 (description becomes more specific and discoverable).

---

## Detailed Analysis by Dimension

### D1: Knowledge Delta (13/20) — Token Efficiency Problem

**What's working**:

- AI Writing Patterns section is genuinely expert knowledge. These patterns emerge from training on marketing/hype-heavy text. Claude doesn't have this kind of "mistakes to avoid" awareness.
- The observation "LLMs regress to statistical means" is insightful and non-obvious.
- Reference to Wikipedia's "Signs of AI writing" guide adds credibility and external validation.

**What's not working**:

- The 18 Strunk rules are basic English instruction. Claude can generate proper possessives, use commas in series, and write in active voice. These rules codify what Claude already does.
- Listing rules 1-18 suggests the Skill is teaching the model something. It's not. It's reminding. And reminders of obvious content waste tokens.
- The distinction between "rules" (prescriptive) and "principles" (Claude's natural tendency) is lost.

**Token efficiency metric**:

- Expert content (AI patterns): ~500 tokens, irreplaceable value
- Activation content (references, framing): ~400 tokens, acceptable
- Redundant content (rule 1-18 list): ~1,200 tokens, should be 200 (brief callouts only)

**Verdict**: This Skill's real value is the anti-pattern knowledge. The Strunk framework is activation-level at best, redundant at worst. Cut 70% of the rules list, keep 30%.

---

### D2: Mindset + Appropriate Procedures (11/15) — Missing "How to Think"

**What's working**:

- "Write with clarity and force" is a mindset statement, not a procedure.
- Limited Context Strategy (dispatch subagent) is a domain-specific procedure Claude might not know.
- Reference file routing (table with token counts) shows conditional thinking: "choose references based on task."

**What's not working**:

- No "Before doing X, ask yourself..." framework. The Skill jumps from philosophy to rules to reference files.
- Missing decision logic: "If prose sounds marketing-heavy, use AI patterns. If grammar is unclear, use rules."
- Procedural gap: "How do I apply these principles?" The Skill says "load these files" but doesn't explain the workflow.

**Example of strong mindset + procedure** (for comparison):

```markdown
## How Experts Edit

1. Read once for clarity. Does it make sense?
2. Read again for tone. Does it sound like marketing or explanation?
3. Read third time for concision. Every word serving a purpose?

This order matters because:

- Clarity issues (step 1) require structural changes
- Tone issues (step 2) require vocabulary swaps
- Concision (step 3) is polish after substance is fixed
```

The Skill lacks this kind of procedural sequencing.

**Verdict**: Good mindset ("clarity and force"), decent procedures (reference routing), missing the bridge ("here's how to think about the problem, here's the procedure to solve it").

---

### D3: Anti-Pattern Quality (14/15) — Excellent, Nearly Perfect

**What's working** (exemplary for the field):

- Lists ARE specific: "pivotal, crucial, vital, testament, enduring legacy" — not just "avoid vague words"
- Includes mechanism: "LLMs regress to statistical means, producing generic, puffy prose"
- Provides anti-examples: "Be specific, not grandiose. Say what it actually does."
- Multi-category approach: puffery, empty "-ing" phrases, promotional adjectives, overused vocabulary, formatting overuse
- External validation: "Wikipedia editors developed this guide"

**Minor gap** (why -1 point):

- Could include more patterns from real LLM failures:
  - "Overuse of colons and semicolons" (LLMs think these are fancy)
  - "False parallelism" (LLMs love rule-of-three even when one item doesn't fit)
  - "Vague attribution" ("many argue", "it is said")

**Verdict**: This section alone justifies the B grade. It's expert-grade anti-pattern knowledge. The rest of the Skill could be weaker, and this section would still be valuable.

---

### D4: Specification Compliance (12/15) — Description Needs Specificity

**Frontmatter validity**: ✓ Valid YAML, proper name format

**Description analysis**:

Current:

```
Use when writing prose humans will read—documentation, commit messages,
error messages, explanations, reports, or UI text. Applies Strunk's
timeless rules for clearer, stronger, more professional writing.
```

**What this answers**:

- **WHAT**: Applies Strunk's rules, "clearer, stronger" writing ✓
- **WHEN**: "When writing prose humans will read" ✓
- **KEYWORDS**: Strunk, clarity, documentation, commit messages ✓

**What this misses**:

- **Trigger scenarios**: "Use when user says 'improve this writing'" or "WHEN text contains puffery"
- **Specificity on AI patterns**: Doesn't mention the anti-pattern expertise
- **Use case priorities**: Doesn't signal "especially for removing AI-generated prose"

**Why this matters**: If a user writes "this document sounds too marketing-like," the Agent needs to see in the description that this Skill detects marketing language. Currently, the description says "Strunk's rules" — which could mean grammar pedantry.

**Verdict**: Solid baseline, needs enhancement for activation likelihood. Better description = Skill gets used more.

---

### D5: Progressive Disclosure (13/15) — Layering Works, Missing Brakes

**Three-layer structure** (correctly implemented):

1. **Metadata** (~50 tokens): name, description
2. **SKILL.md** (~800 tokens): Principles, AI patterns, reference routing
3. **References** (optional): 4 detailed reference files

**Loading trigger quality**:

Good: Token counts per reference help Agent decide.

```markdown
| Section | File | ~Tokens | | Grammar, punctuation | 02-elementary-rules-of-usage.md | 2,500 | | Paragraph structure | 03-elementary-principles-of-composition.md | 4,500 |
```

Good: Routing logic: "Most tasks need only 03..."

Missing: "Do NOT load" anti-triggers.

**Example of what's missing**:

```markdown
## What NOT to Load

- **Do NOT load 04-a-few-matters-of-form.md** unless editing formal documentation (APA papers, official reports). Its rules are prescriptive and may overconstrain creative writing.

- **Do NOT load 05-words-and-expressions-commonly-misused.md** for general editing. Use only when debugging specific word confusion ("affect" vs "effect", "allude" vs "elude").
```

These anti-triggers prevent cognitive overload and keep Agent focused.

**Verdict**: Excellent layering; progressive disclosure works as designed. Missing the "what NOT to load" safety rails.

---

### D6: Freedom Calibration (14/15) — Appropriately High Freedom

**Task fragility assessment**: Writing is creative; multiple approaches valid. High freedom is correct.

**How freedom manifests**:

- Strunk rules are PRINCIPLES ("use active voice"), not PROCEDURES ("change every sentence from passive to active")
- AI patterns are GUIDELINES ("avoid puffery"), not RULES ("delete all adjectives")
- Subagent option shows flexibility: "if context tight, dispatch instead of loading"

**Calibration correctness**:

- Low freedom would be: "Step 1: Find all passive constructions. Step 2: Rewrite in active voice. Step 3: Verify no passives remain."
- High freedom is: "Prefer active voice because it's more direct" (principle, not formula)

This Skill correctly uses high freedom.

**Minor note** (-1 point): The "Elementary Rules" section (1-18) reads slightly more prescriptive (low freedom) than the rest. "Form possessive by adding 's" sounds like a rule, not a principle. This structural inconsistency brought down the score slightly.

**Verdict**: Excellent calibration overall. Freedom level matches task creativity appropriately.

---

### D7: Pattern Recognition (8/10) — Hybrid Execution, Structural Tension

**Identified pattern**: Hybrid Mindset + Navigation

**Mindset elements present**:

- Philosophy: "Write with clarity and force"
- Anti-patterns: Excellent "AI Writing Patterns to Avoid" list
- Principles: Emphasis on what Claude already knows (activation-level)

**Navigation elements present**:

- Reference table with decision routing
- Token counts for informed loading

**Pattern purity issue**:

- Pure Mindset: ~43 lines, principle-focused, strong anti-pattern list, high freedom (example: frontend-design)
- Pure Navigation: ~30 lines, minimal body, heavy routing to sub-files (example: internal-comms)
- **This Skill**: ~140 lines, mixed philosophy + rules listing + navigation = 8/10 (clear pattern with deviations)

The "Elementary Rules" listing disrupts both patterns. It's too prescriptive for Mindset, too brief for Tool.

**Recommendation**: Restructure to pure Mindset (target: ~80-100 lines total):

- Philosophy (10 lines)
- Anti-patterns (40 lines, expanded)
- Context strategy (10 lines)
- References as minimal table (10 lines)

**Verdict**: Clear intention (Mindset pattern), good execution (principles + anti-patterns), but structural inconsistency (rules list doesn't fit). 8/10 is fair — good pattern adherence with room for tighter architecture.

---

### D8: Practical Usability (12/15) — Good for Common Cases, Edge Cases Missing

**What works**:

- AI patterns checklist is actionable: Agent can read and immediately identify puffery in its own prose
- Reference routing with token counts helps Agent decide what to load
- "Most tasks need only 03..." provides practical shortcut

**What's missing**:

**Edge case 1 — Domain variation**:

```markdown
Specific to your writing context:

- **Technical documentation**: Clarity > brevity. Accept specialized jargon. Strunk's "omit needless words" is less strict here.

- **User-facing copy**: Warmth > formality. "Please do this" > "Execute this." Strunk's "active voice" applies, but tone principles from humanizer skill apply more.

- **Code comments**: Be VERY terse. Abbreviations OK. Strunk's rules are overkill here; focus on clarity for busy readers.
```

**Edge case 2 — Error recovery**:

```markdown
If prose still reads AI-generated after applying rules:

1. Check: Are you using generic metaphors? Replace with concrete actions.
2. Check: Are sentences similar length/structure? Vary them.
3. If stuck: Dispatch humanizer skill (it's more specialized for LLM-detection than this skill).
```

**Edge case 3 — Reference selection error**:

```markdown
If you load the wrong reference:

- Loaded 02 (grammar) but prose is structural → Switch to 03 (composition)
- Loaded 05 (word choice) but issue is tone → Use AI patterns section instead
```

**Verdict**: Practical for straightforward "improve clarity" tasks, but lacks guidance for complex scenarios (domain variations, fallbacks, reference errors). 12/15 reflects solid foundation with depth gaps.

---

## Recommendations Summary

| Priority | Action | Impact | Effort |
| --- | --- | --- | --- |
| **P0** | Delete rules 1-18, expand AI patterns section | D1: -7pts → -3pts | High |
| **P1** | Add decision framework ("Before editing, ask yourself") | D2: -4pts → -2pts | Medium |
| **P2** | Enhance description with trigger scenarios | D4: -3pts → -1pts | Low |
| **P3** | Add "Do NOT Load" guidance | D5: -2pts → -1pts | Low |
| **P4** | Restructure to pure Mindset pattern | D7: -2pts → 0pts | High |
| **P5** | Add edge case coverage | D8: -3pts → -1pts | Medium |

**Post-improvement estimated grade**: A (90-95%, 108-114 points) with all recommendations implemented.

---

## Enhancement Actions Taken

_None — this is a pure evaluation report. Improvements require separate skill editing session._

---

**Report Generated**: 2026-05-04  
**Evaluator**: Claude Haiku 4.5  
**Rubric Version**: skill-judge SKILL.md (v2.1)
