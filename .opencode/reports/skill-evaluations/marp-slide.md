# Skill Evaluation Report: marp-slide

## Summary

- **Total Score**: 65/120 (54.2%)
- **Grade**: D (Below Average)
- **Pattern**: Unclear (attempts Process but references break pattern)
- **Knowledge Ratio**: E:A:R = 55:30:15
- **Verdict**: Struggling skill with critical gaps in anti-pattern guidance, shallow thinking frameworks, and unclear reference structure. Requires significant redesign before production use.

---

## Dimension Scores

| Dimension | Score | Max | Assessment |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 13 | 20 | Marp-specific content is valuable but generic workflow steps dilute focus |
| D2: Mindset + Procedures | 8 | 15 | WEAK: Theme selection is list-based, not decision-tree-based; missing "why" frameworks |
| D3: Anti-Pattern Quality | 2 | 15 | **CRITICAL**: Zero anti-patterns, no NEVER list, missing design pitfalls |
| D4: Specification Compliance | 13 | 15 | Valid frontmatter and description; could be sharper on keywords |
| D5: Progressive Disclosure | 6 | 15 | Intent good but execution unclear; references may not exist in package |
| D6: Freedom Calibration | 11 | 15 | Slightly too rigid for creative task; constraining when should trust Agent's judgment |
| D7: Pattern Recognition | 5 | 10 | Unclear pattern; mixes workflow phases without clear separation |
| D8: Practical Usability | 7 | 15 | Basic usability but lacks error handling, edge cases, and visual theme demonstration |

---

## Critical Issues

### 1. **Anti-Patterns Completely Missing (D3 = 2/15)**

The skill has **zero** NEVER list. For a design-focused skill, this is a critical failure.

**Examples of missing anti-patterns**:

- NEVER: Single-digit bullet points (ambiguous, looks unfinished)
- NEVER: More than 5 bullet points per slide (cognitive overload)
- NEVER: Title longer than 7 characters without line break
- NEVER: Dark text on dark background (accessibility)
- NEVER: Mix too many themes in one deck (inconsistent)
- NEVER: Use templates without understanding their constraints
- NEVER: Skip whitespace management (cramped slides look unprofessional)

**Impact**: Agent has no warning about design pitfalls. Without explicit NEVER guidance, Agent may create presentations that look "okay" but violate Marp best practices.

### 2. **Shallow Thinking Framework (D2 = 8/15)**

Theme selection is presented as a lookup table, not a thinking framework:

**Current (weak)**:

```
Quick theme selection:
- Technical/Developer content → tech theme
- Business/Corporate → business theme
- Creative/Event → colorful or gradient theme
```

**Should be (expert thinking)**:

```
Before selecting a theme, ask yourself:

1. What emotion should the presentation evoke?
   - Technical/precise → tech, dark, minimal
   - Friendly/approachable → colorful, gradient
   - Corporate/formal → business, default

2. Who is the audience and what's their context?
   - Developers: expect code visibility → tech theme has proper contrast
   - Executives: expect speed → minimal reduces cognitive load
   - Students: expect engagement → colorful or gradient holds attention

3. What's the content density?
   - Code-heavy: Use tech (monospace, proper contrast)
   - Text-heavy: Use minimal or business (maximum readability)
   - Visual-heavy: Use colorful or gradient (matches aesthetic)
```

**Current skill doesn't explain WHY**. Why does a developer prefer tech theme? Because code visibility matters. Why minimal for academic? Because content density is high. Missing this reasoning means Agent doesn't know how to adapt when facing novel scenarios.

### 3. **Reference/Template Structure Unclear (D5 = 6/15)**

The skill extensively references files:

- `references/marp-syntax.md`
- `references/image-patterns.md`
- `references/best-practices.md`
- `assets/template-basic.md` (and 6 more templates)
- `assets/theme-*.css` files

**Problem**: Unclear if these files actually exist in the skill package. The skill says "read `references/marp-syntax.md`" but Agent will fail if the file doesn't exist.

**If files don't exist**: This is a CRITICAL failure. The skill is unusable without these references.

**If files do exist**: They need to be properly documented with loading triggers, not just listed at the end.

### 4. **No Error Handling or Fallbacks (D8 = 7/15)**

**Missing edge cases**:

- What if template syntax is wrong? (Show corrected version)
- What if image path is broken? (Fallback without image)
- What if content is very long? (Multi-slide strategy)
- What if theme doesn't work for audience? (Theme switching guidance)

**Missing error handling**:

- No troubleshooting section
- No "common mistakes and fixes"
- No validation checklist BEFORE delivery

### 5. **Themes Described but Not Visually Demonstrated (D8)**

Each theme is described by color/style, but Agent can't see what they look like:

```
### 1. Default Theme
**Colors**: Beige background, navy text, blue headings
**Style**: Clean, sophisticated with decorative lines
**Use for**: General seminars, lectures, presentations
```

**Missing**: Visual samples or CSS snippets that show the actual theme. Agent doesn't see beige + navy in action.

Better approach:

```
### 1. Default Theme

**Visual**: [ASCII art or CSS inline showing colors]
```

---

## Detailed Analysis by Dimension

### D1: Knowledge Delta (13/20) — Marp-Specific Content Mixed with Redundancy

**What's Expert**:

- Marp directives: `<!-- _class: lead -->`, `![bg right:40%]()`, `![w:600px]()`
- Image integration patterns (side image, centered, full background)
- Best practice constraints (5-7 char titles, 3-5 bullets per slide)
- Theme categorization and when to use each

**What's Activation** (brief reminders, acceptable):

- Template workflow ("apply template, maintain structure")
- General slide structuring principles

**What's Redundant** (should be cut):

```
### Basic Workflow
1. Understand requirements
2. Select theme
3. Apply template
4. Structure content
5. Refine quality
6. Add images
7. Output file
```

This is generic software workflow. Claude knows this. Every skill shouldn't repeat this.

**Recommendation**: Cut the generic workflow section entirely. Replace with Marp-specific "What to think about before creating."

---

### D2: Mindset + Procedures (8/15) — List-Based vs Decision-Tree-Based

**Current approach (weak)**:

- Lists themes with one-liner guidance
- Workflow steps (generic)
- No decision framework for novel scenarios

**Expert approach would have**:

```
## Thinking Framework: Theme Selection

Before selecting a theme, systematically evaluate:

**Dimension 1: Content Type**
| Type | Best Theme | Why |
| --- | --- | --- |
| Code/Technical | tech | Monospace, proper contrast for code readability |
| Text-Heavy | minimal, business | Maximum whitespace, readability focus |
| Visual-Heavy | colorful, gradient | Matches aesthetic intensity |

**Dimension 2: Audience Context**
| Audience | Best Theme | Why |
| --- | --- | --- |
| Developers | tech, dark | Familiar with dark terminal aesthetics |
| Executives | business, minimal | Professional, fast to process |
| Students | colorful, gradient | Engagement and retention |

**Dimension 3: Delivery Context**
| Context | Best Theme | Why |
| --- | --- | --- |
| Dark room (projection) | dark, tech | Reduces eye strain on projection screens |
| Bright room (print) | light, business | Maintains readability in bright environments |
| Online (screen share) | any | All themes work equally well |
```

This teaches Agent HOW TO THINK, not just which theme to use.

---

### D3: Anti-Pattern Quality (2/15) — CRITICAL FAILURE

**Current state**: Zero anti-patterns list.

**Required expert anti-patterns** (things that take experience to learn):

```
## NEVER Do — Design Anti-Patterns

### Content Density
- NEVER exceed 5 bullet points per slide (cognitive overload; need to split into 2 slides)
- NEVER use 1 bullet point on a slide (looks incomplete; either use 2+ or use plain text)
- NEVER exceed 30 characters per line (breaks line wrapping, looks chaotic)

### Theme Consistency
- NEVER mix more than 2 themes in one deck (audience gets confused about visual hierarchy)
- NEVER use bright colorful theme for technical content (undermines credibility; developers expect tech theme)
- NEVER use minimal theme for creative content (feels corporate; use colorful/gradient instead)

### Typography & Spacing
- NEVER use titles longer than 7 characters without line break (title wraps unpredictably in Marp)
- NEVER eliminate whitespace to fit more content (indicates poor content strategy, not technical limitation)
- NEVER use more than 3 heading levels (H1, H2, H3 maximum; more creates chaos)

### Images
- NEVER use `![bg](image.png)` without specifying size (image may distort unexpectedly)
- NEVER place image text overlays without testing on actual presentation screen (might be unreadable on projector)
- NEVER use high-resolution images without compression (file size explodes, slow to load)

### Marp-Specific
- NEVER forget `<!-- _class: lead -->` on title slide (first impression suffers)
- NEVER use raw HTML instead of Marp directives (breaks theming, looks broken)
- NEVER commit Marp files with unsaved CSS (theme won't load on other machines)
```

**Why this matters**: These are landmines Claude hasn't stepped on. Without them, Agent produces presentations that are technically valid but look amateurish.

---

### D4: Specification Compliance (13/15) — Good but Refineable

**Frontmatter**: Valid YAML ✓

**Description Analysis**:

```yaml
description: "Create professional Marp presentation slides with 7 beautiful themes
(default, minimal, colorful, dark, gradient, tech, business). Use when users
request slide creation, presentations, or Marp documents. Supports custom themes,
image layouts, and 'make it look good' requests with automatic quality improvements."
```

- WHAT: 7 themes, custom themes, image layouts ✓
- WHEN: users request slides, presentations, Marp documents, "make it look good" ✓
- KEYWORDS: Marp, presentations, themes, image layouts ✓

**Minor improvement**: Could add more search keywords:

- "Marp presentations" (more searchable than just "Marp")
- "presentation templates"
- "slide deck creation"

---

### D5: Progressive Disclosure (6/15) — Intent Good, Execution Unclear

**Current structure**:

- SKILL.md: ~320 lines (reasonable)
- References section lists files but doesn't show loading triggers
- Templates listed but not embedded or demonstrated

**Problem 1**: No explicit "MANDATORY - READ ENTIRE FILE" triggers. Where should Agent load `references/marp-syntax.md`? In theme selection? Or only for advanced tasks?

**Problem 2**: References may not exist in the skill package (unclear).

**Problem 3**: Templates are mentioned but not shown inline. Agent would need to access separate files.

**Better approach** (if references exist):

In "Step 2: Create Slides" section:

```markdown
### Read Marp Syntax

**MANDATORY - READ ENTIRE FILE**: Before proceeding, read [`references/marp-syntax.md`](references/marp-syntax.md) completely. This covers directives, frontmatter, pagination.

**Do NOT load** `references/theme-css-guide.md` or `references/advanced-features.md` unless building custom themes.
```

---

### D6: Freedom Calibration (11/15) — Slightly Too Rigid for Creative Task

**Task fragility**: Presentation design is creative, not fragile. Themes won't break. Aesthetic choices matter more than syntax precision.

**Current approach (slightly rigid)**:

- "Title slide uses `<!-- _class: lead -->`" (correct constraint)
- "All h2 titles are concise (5-7 chars)" (good constraint)
- "Bullet points are 3-5 items per slide" (reasonable constraint)
- Quality checklist with checkboxes (procedural, not creative)

**Should push MORE freedom on**:

- Color adjustments (let Agent customize if default theme doesn't fit)
- Layout experimentation (Agent should feel free to try novel layouts)
- Typography choices (don't prescribe, suggest)
- Content pacing (checklist items should be guidelines, not rules)

**But KEEP strict guidance on**:

- Marp syntax (directives must be correct)
- Template structure (CSS must be properly embedded)
- Accessibility (contrast ratios, readable fonts)

**Recommendation**: Reframe checklist as "Guidelines" not "Quality Checklist"; use principles ("maintain visual hierarchy") not procedures ("use h2 titles only").

---

### D7: Pattern Recognition (5/10) — Unclear Pattern, Mixed Approaches

**Attempts to follow**: Process pattern (200 lines, phased workflow)

**Actual structure**:

1. Theme selection (decision)
2. Slide creation (workflow)
3. File output (procedure)
4. Quality checklist (validation)

**Problem**: Doesn't clearly separate phases. Workflow steps are generic. References break progressive disclosure pattern.

**If this were Navigation pattern** (minimal core, route to sub-files):

- Core would be: "Select theme → Copy template → Customize content"
- Heavy content in references and templates
- But references aren't properly loaded

**If this were Philosophy pattern** (thinking first, then express):

- Would start with presentation principles
- Then show how Marp implements those principles
- But it goes straight to workflow

**Recommendation**: Choose pattern consciously:

- **If keeping references**: Refactor as Navigation pattern (30-line core, everything else in references)
- **If removing references**: Refactor as Mindset pattern (think first, then act)
- **Current state**: In-between and unclear

---

### D8: Practical Usability (7/15) — Basic but Incomplete

**What works**:

- Theme list is usable
- Image syntax examples are correct ✓
- Template-based approach is practical

**What's missing**:

1. **Decision tree complexity**: Theme selection is shallow

   ```
   Current: "Technical → tech"
   Needed: "If technical AND code-heavy AND dark room → tech;
            If technical AND text-heavy → minimal;
            If technical AND presentations to executives → business"
   ```

2. **Error handling**: Zero fallback strategies
   - Template syntax error? → No guidance
   - Image not loading? → No guidance
   - Content too long for slide? → No guidance

3. **Visual demonstration**: Themes described but not shown
   - No CSS samples
   - No visual comparisons
   - No before/after examples

4. **Edge cases uncovered**:
   - Very long titles (how to break them?)
   - Mathematical equations in slides (supported?)
   - Animated transitions (supported?)
   - Presenter notes (how to add?)

5. **Quality validation**: Checklist exists but no way to validate before delivery
   - No syntax validation
   - No accessibility check
   - No cross-theme verification

---

## Top 3 Improvements (Priority Order)

### 1. **Add Comprehensive Anti-Pattern List (Impact: +7 points, moves D3 from 2→9)**

Create a NEVER section with expert-level design pitfalls:

```markdown
## NEVER Do — Learned the Hard Way

### Slide Density

- NEVER: Single-bullet slide (looks unfinished) → Use 2+ or remove bullets
- NEVER: >5 bullets per slide (cognitive overload) → Split into 2 slides
- NEVER: Title >7 chars without wrapping (breaks layout) → Break at word boundary

### Theme Consistency

- NEVER: Mix >2 themes in one deck → Choose 1 theme, stick with it
- NEVER: Bright theme for code content → Developers expect dark/tech
- NEVER: Corporate theme for creative content → Undermines energy

### Execution

- NEVER: Forget `<!-- _class: lead -->` on title slide → First impression is critical
- NEVER: Skip whitespace management → Cramped = amateurish
- NEVER: Use template without testing in presentation mode → Looks different on projector
```

**Expected impact**: Gives Agent concrete warnings about design landmines. Single biggest improvement.

### 2. **Replace List-Based Theme Selection with Decision Framework (Impact: +5 points, moves D2 from 8→13)**

Transform "Quick theme selection" into expert thinking:

```markdown
## Selecting the Right Theme: Thinking Framework

### Step 1: Analyze Content Type

- Is there code? → Prioritize tech or dark (syntax highlighting needs contrast)
- Is it text-heavy? → Prioritize minimal or business (maximum whitespace)
- Is it visual? → Prioritize colorful or gradient (aesthetic intensity)

### Step 2: Consider Audience

- Technical audience → They expect tech theme (familiar aesthetic)
- Business audience → They expect business or minimal (professional)
- Student/general → They respond to colorful or gradient (engagement)

### Step 3: Evaluate Context

- Dark room (projector) → Dark or tech (eye strain reduction)
- Bright room (printed) → Light or business (maintains contrast)
- Online (screenshare) → Any (all work equally)

### When to Override Defaults

- If guidelines conflict (e.g., code + business audience) → Ask: Is code visibility or professionalism more important?
- If you're uncertain → Default always works, but minimal is safest fallback
```

This teaches Agent to THINK rather than just lookup.

### 3. **Clarify Reference/Template Structure with Loading Triggers (Impact: +4 points, moves D5 from 6→10)**

Either:

**Option A (If references exist)**:

```markdown
## Step 2: Read Core References

**MANDATORY - READ**: [`references/marp-syntax.md`](references/marp-syntax.md) Complete coverage of Marp directives and syntax. Load this FIRST before creating slides.

**CONDITIONAL - READ IF**:

- Building custom themes → [`references/theme-css-guide.md`](references/theme-css-guide.md)
- Using advanced features (math, fragmentation) → [`references/advanced-features.md`](references/advanced-features.md)
- Integrating images → [`references/image-patterns.md`](references/image-patterns.md)

**Do NOT load**: `references/official-themes.md` (reference only, not needed)
```

**Option B (If references don't exist)**: Delete all reference listings and embed critical syntax in SKILL.md:

````markdown
## Marp Syntax You Need to Know

### Title Slide

```markdown
<!-- _class: lead -->

# My Presentation Title
```
````

### Content Slide with Image

```markdown
## Why This Matters

![bg right:40%](diagram.png)

- Point one
- Point two
```

...

```

---

## Knowledge Compression Ratio Analysis

**Expert Knowledge** (55%):
- Marp directives and syntax
- Theme selection thinking (partially)
- Image integration patterns
- Best practice constraints specific to Marp

**Activation Knowledge** (30%):
- Generic workflow reminders
- Template-based approach
- Quality guidelines

**Redundant Knowledge** (15%):
- Step-by-step workflow that Claude already knows
- Generic presentation principles

**Assessment**: Better than average (most struggling skills have 40% expert), but should be 70%+ for design skill.

---

## Recommendation

**Current Grade: D (54.2%)**

**Path to B Grade (80%+)**:

1. Add NEVER list (gain +7 on D3)
2. Replace theme selection with thinking framework (gain +5 on D2)
3. Clarify reference structure with loading triggers (gain +4 on D5)
4. Add error handling and edge cases (gain +4 on D8)
5. Improve freedom calibration for creative task (gain +2 on D6)

**Total potential**: 65 + 7 + 5 + 4 + 4 + 2 = 87/120 = 72.5% → C/B boundary

**Estimated timeline to improvements**: 2-3 hours focused work on critical dimensions.

**Priority before production use**: MUST add D3 anti-patterns and D2 thinking framework. D5 reference structure must be clarified (either embed files or confirm they exist).
```
