---
name: marp-slide
description: Create professional Marp presentation slides with 7 themes (default, minimal, colorful, dark, gradient, tech, business). Expert theme selection framework, anti-patterns, and image integration. Use when users request presentations, "make it look good" slides, or Marp documents.
---

# Marp Slide Creator

Create professional, visually appealing Marp presentation slides with 7 pre-designed themes, expert anti-patterns, and decision-based theme selection. Master the thinking behind great slide design.

## When to Use This Skill

Use this skill when the user:

- Requests to create presentation slides or Marp documents
- Asks to "make slides look good" or "improve slide design"
- Provides vague instructions like "make it nice" or "make it cool"
- Wants to create lecture or seminar materials
- Needs bullet-point focused slides with occasional images

## Quick Start

### Step 1: Select Theme Using Decision Framework

First, determine the appropriate theme by systematically analyzing your content and audience. Don't guess—think first.

#### Dimension 1: Analyze Content Type

- **Code/Technical content present?** → Prioritize `tech` or `dark` (better code contrast)
- **Text-heavy (lots of words)?** → Prioritize `minimal` or `business` (maximum readability)
- **Visual/image-heavy?** → Prioritize `colorful` or `gradient` (matches aesthetic intensity)
- **Mix of all?** → Use `default` (balanced approach)

#### Dimension 2: Consider Your Audience

| Audience | Best Theme | Why |
| --- | --- | --- |
| Developers | `tech`, `dark` | Familiar with dark terminal aesthetics; expect code visibility |
| Business/Executives | `business`, `minimal` | Professional tone; fast to process; clean lines build credibility |
| Students/Creative | `colorful`, `gradient` | Engagement and retention matter more than minimalism |
| General/Mixed | `default` | Neutral, safe, works for any audience |

#### Dimension 3: Evaluate Delivery Context

- **Dark room (projector)?** → `dark`, `tech` (reduces eye strain on large screens)
- **Bright room (printed)?** → `light`, `business`, `default` (maintains contrast)
- **Online (screen share)?** → Any theme works equally well

#### Decision Rules (Apply in Order)

1. **If code is present**: Use `tech` (unless business audience needs corporate aesthetic → use `business`)
2. **If text-heavy**: Use `minimal` or `business` (minimal is safest if unsure)
3. **If very creative content**: Use `colorful` or `gradient` (but NOT for technical content)
4. **Default fallback**: Use `default` if conflicting signals

**When guidelines conflict** (e.g., code + business audience): Ask yourself: "Is code visibility or professionalism more important?" Code first usually wins.

### Step 2: Understand Marp Syntax & Best Practices

**Core syntax you must know**:

#### Title Slide

```markdown
<!-- _class: lead -->

# My Presentation Title

Subtitle or introduction text
```

Note: `<!-- _class: lead -->` tells Marp this is a title slide (larger text, centered)

#### Content Slide with Bullets

```markdown
## Slide Title (5-7 characters max)

- Point one (max 30 characters)
- Point two
- Point three
```

Note: Keep titles short (no more than 7 characters without line break)

#### Slide with Side Image

```markdown
## Title

![bg right:40%](diagram.png)

- Explanation point 1
- Explanation point 2
- Explanation point 3
```

Note: Image goes on right (40% of slide), text on left

#### Other Image Patterns

- **Centered image**: `![w:600px](image.png)` - Fixed width, centered
- **Full background**: `![bg](image.png)` - Full-screen background (text overlays on top)
- **Image on left**: `![bg left:40%](image.png)` - Flips placement to left side

**For more syntax**: Consult [Marp Official Documentation](https://marp.app/) or [Marpit Directives](https://marpit.marp.app/directives)

### Step 3: Copy Appropriate Template

Select the template matching your chosen theme:

- `assets/template-basic.md` - Default theme (most common, balanced)
- `assets/template-minimal.md` - Minimal theme (text-heavy content)
- `assets/template-colorful.md` - Colorful theme (creative, youth-oriented)
- `assets/template-dark.md` - Dark mode theme (tech presentations, evening talks)
- `assets/template-gradient.md` - Gradient theme (visual-heavy, modern look)
- `assets/template-tech.md` - Tech/code theme (programming tutorials, developer audience)
- `assets/template-business.md` - Business theme (corporate, proposals)

All templates have CSS embedded—no external files needed.

### Step 4: Customize Content Within Constraints

**DO**:

- Keep titles to 5-7 characters (prevents wrapping issues)
- Use 3-5 bullet points per slide (cognitive load limit)
- Break dense content across multiple slides
- Maintain whitespace (shows professionalism)
- Use consistent heading levels (h1 for title slide, h2 for content slides)

**DON'T** (see NEVER Do section below for details):

- Use single-bullet slides (looks incomplete)
- Mix more than 2 themes in one deck
- Forget `<!-- _class: lead -->` on title slide
- Eliminate whitespace to fit more content

### Step 5: Add Images (If Needed)

Use the image patterns from Step 2 above. Test layout in Marp preview before finalizing.

### Step 6: Save & Deliver

Save to descriptive filename (e.g., `conference-talk.md`). Include embedded CSS in file (templates already do this).

---

## NEVER Do — Design Anti-Patterns

These are learned through experience. Violating them makes slides look amateurish, even if technically valid.

### Content Density Anti-Patterns

- **NEVER use a single-bullet slide** → Looks incomplete, like you forgot content. Use 2+ bullets or remove bullets entirely and use plain text.
- **NEVER exceed 5 bullet points per slide** → Cognitive overload; audience can't absorb >5 points. Split into multiple slides instead.
- **NEVER use bullet points with <15 characters** → Too short; looks sparse. Either use longer explanations or remove the bullet.
- **NEVER use lines longer than 30 characters** → Breaks line wrapping; looks chaotic. Keep lines short and scannable.

### Theme Consistency Anti-Patterns

- **NEVER mix more than 2 themes in one deck** → Audience gets confused about visual hierarchy and tone. Pick ONE theme and commit.
- **NEVER use bright/colorful theme for technical content** → Undermines credibility; developers expect dark or tech theme for code presentations.
- **NEVER use minimal theme for creative/event content** → Feels corporate and cold. Creative content needs colorful or gradient theme for visual energy.
- **NEVER switch themes mid-deck without clear reason** → Even theme changes should mark intentional breaks (e.g., main talk → Q&A section).

### Typography & Spacing Anti-Patterns

- **NEVER use h1 or h3 on content slides (only h2)** → Marp templates style h2 specifically. Other heading levels break visual hierarchy.
- **NEVER eliminate whitespace to fit more content** → This indicates a content problem, not a space problem. Cramped slides look unprofessional. Rewrite or add slides.
- **NEVER use titles longer than 7 characters without line breaks** → Titles wrap unpredictably in Marp. Either break at word boundary or use shorter title.
- **NEVER use more than 3 heading levels total** → H1 (title), H2 (slides), H3 (sub-points) maximum. More creates visual chaos.

### Image & Visual Anti-Patterns

- **NEVER use `![bg](image.png)` without specifying size** → Image may distort unexpectedly (stretches to fill slide). Always specify width or use `![bg right:40%]()` format for positioning.
- **NEVER place text overlays on images without testing on actual projection screen** → Text that's readable on laptop monitor becomes unreadable on projector. Test before delivery.
- **NEVER use high-resolution images without compression** → File size explodes; slides become slow to load and difficult to share. Compress images to 2-3 MB max per slide.
- **NEVER forget alt text for accessibility** → Include descriptive image names for screen readers: `![A diagram showing three connected boxes](diagram.png)` not `![image](x.png)`.

### Marp-Specific Anti-Patterns

- **NEVER forget `<!-- _class: lead -->` on title slide** → First impression is critical. Title slide without this directive looks like a content slide with huge text (unprofessional).
- **NEVER use raw HTML instead of Marp directives** → HTML breaks theming and may not render correctly. Always use Marp syntax: `<!-- _class: ... -->` not `<div>`.
- **NEVER save Marp files without embedded CSS** → Themes won't load on other machines if CSS is external. Templates include CSS inline; keep it.
- **NEVER use features not supported by your Marp version** → Check [Marp Release Notes](https://github.com/marp-team/marp-core/releases) for new features. Older Marp versions may not support math or advanced fragmentation.

---

## Available Themes

### 1. Default Theme

**When to use**: General seminars, mixed-audience lectures, corporate talks, or when unsure

**Visual style**: Beige background, navy text, blue headings, decorative lines on left

**Best for**:

- Balanced content (mix of code, text, visuals)
- Professional but not stuffy
- Any audience size
- Printed slides

**Trade-off**: Safe default; won't stand out visually but never looks bad

**Template**: `assets/template-basic.md`

### 2. Minimal Theme

**When to use**: Text-heavy presentations, academic talks, content-focused sessions

**Visual style**: White background, gray text, black headings, wide margins, light fonts

**Best for**:

- Dense content (lots of reading required)
- Academic or research presentations
- Executive summaries
- Print-heavy content

**Trade-off**: Maximum readability; minimal visual appeal (intentional)

**Template**: `assets/template-minimal.md`

### 3. Colorful & Pop Theme

**When to use**: Creative events, youth-oriented talks, product launches, design showcases

**Visual style**: Pink/rainbow gradient backgrounds, multi-color accents, vibrant fonts

**Best for**:

- Creative/design-focused content
- Youth audiences
- Event announcements
- High-energy talks

**Trade-off**: Visually striking but risky for serious technical content (may undermine credibility)

**Template**: `assets/template-colorful.md`

### 4. Dark Mode Theme

**When to use**: Tech presentations, evening talks, modern/trendy aesthetic, code-heavy content

**Visual style**: Black background, cyan/purple accents, glow effects, eye-friendly contrast

**Best for**:

- Programming tutorials
- Tech meetups
- Code demonstrations
- Evening/night talks (reduces eye strain)

**Trade-off**: Looks modern and expert; may be harder to print (needs color printer)

**Template**: `assets/template-dark.md`

### 5. Gradient Background Theme

**When to use**: Visual-heavy presentations, creative work, modern/stylish talks

**Visual style**: Different gradient per slide (purple→pink→blue→green), white text, shadow effects

**Best for**:

- Design portfolio presentations
- Visual storytelling
- Modern tech talks
- Aesthetic-first content

**Trade-off**: Visually impressive; can be distracting if content is dense or boring

**Template**: `assets/template-gradient.md`

### 6. Tech/Code Theme

**When to use**: Programming tutorials, developer talks, technical deep-dives, code walkthroughs

**Visual style**: GitHub-style dark background, blue/green accents, monospace code fonts, Markdown-style headers

**Best for**:

- Code demonstrations
- Developer conferences
- Technical education
- Developer community talks

**Trade-off**: Signals technical credibility to developer audience; not suitable for business/non-technical talks

**Template**: `assets/template-tech.md`

### 7. Business Theme

**When to use**: Corporate presentations, investor pitches, sales decks, formal proposals

**Visual style**: White background, navy headings, blue accents, top border, professional table support

**Best for**:

- Business presentations
- Investor pitches
- Corporate training
- Formal reports
- Executive summaries

**Trade-off**: Professional and corporate; may feel stiff for creative content

**Template**: `assets/template-business.md`

---

## Handling "Make It Look Good" Requests

When users give vague instructions like "make it feel good/nice", "make it cool/stylish", or "improve the design":

### 1. Infer Intent from Content

- Business jargon? → `business` theme
- Code snippets? → `tech` or `dark` theme
- Lots of images? → `colorful` or `gradient` theme
- Academic/dense text? → `minimal` theme
- If unclear → `default` theme

### 2. Apply Quality Principles Automatically

- Shorten all titles to 5-7 characters max (breaks long titles)
- Limit bullet points to 3-5 items per slide (never 1-2, rarely >5)
- Add generous whitespace (don't cram content)
- Use consistent structure (same layout for similar content)
- Ensure logical flow: intro → body → conclusion

### 3. Enhance Visual Hierarchy

- Use h2 for slide titles ONLY (not h1 or h3)
- Break dense text across 2-3 slides instead of 1 crowded slide
- Group related bullets under sub-bullets when needed (max 3 levels)
- Use images strategically (not just decoration)

### 4. Maintain Professional Tone

- Match theme formality to audience (formal for executives, casual for students)
- Use parallel structure in all bullet lists
- Keep technical terms consistent throughout
- Avoid "design flourishes" that distract (animated transitions, clashing colors)

---

## Design Freedom & Constraints

You can customize and adapt within these bounds:

### Freedom Zone (Customize Here)

- ✓ Change accent colors (within theme color family)
- ✓ Adjust font sizes for readability
- ✓ Reorder slides and reorganize content
- ✓ Add or remove images strategically
- ✓ Extend slides if content is valuable
- ✓ Combine themes strategically (rare; only for intentional breaks)

### Constraint Zone (Don't Break These)

- ✗ Title wrapping (keep titles short enough to fit)
- ✗ Contrast ratios (text must be readable on theme background)
- ✗ Marp syntax (must be valid directives, not HTML)
- ✗ Embedded CSS (must stay in file, not external)
- ✗ Cognitive load (never exceed 5 points per slide)

---

## Quality Checklist

Before delivering slides, verify:

- [ ] Theme selected intentionally using decision framework (not randomly)
- [ ] Title slide includes `<!-- _class: lead -->`
- [ ] All titles are 5-7 characters max (short enough to fit)
- [ ] All bullet lists have 3-5 items (never 1-2 or >5)
- [ ] Whitespace is generous (not cramped)
- [ ] Images use proper Marp syntax (`![bg...]` or `![w:...]`)
- [ ] File includes embedded CSS (no external theme files)
- [ ] Tested in Marp preview or actual presentation tool
- [ ] No NEVER anti-patterns violated (see section above)
- [ ] Logical flow and progression (intro → body → conclusion)

---

## Common Mistakes & Fixes

| Mistake | Problem | Fix |
| --- | --- | --- |
| Single-bullet slide | Looks incomplete | Add 1+ more bullet OR remove bullets entirely |
| >5 bullets per slide | Cognitive overload | Split into 2 slides |
| Title >7 characters | Wraps unexpectedly | Break title at word boundary or use shorter title |
| Multiple themes mid-deck | Visual confusion | Pick 1 theme; use theme change only for intentional section breaks |
| No whitespace | Cramped, amateurish | Rewrite content more concisely; add more slides |
| Colorful theme + code | Mixed signals | Switch to `tech` or `dark` theme for credibility |
| Forgot `<!-- _class: lead -->` | Title slide looks off | Add to first slide with h1 heading |
| Image no size specified | Image distorts | Use `![bg right:40%]()` format or `![w:600px]()` |

---

## References

### Marp Official Documentation

- **[Marp Official Site](https://marp.app/)** — Getting started with Marp
- **[Marpit Directives](https://marpit.marp.app/directives)** — Complete reference for HTML comments (<!-- -->)
- **[Marpit Image Syntax](https://marpit.marp.app/image-syntax)** — How to use `![bg]()` and image positioning
- **[Marpit Theme CSS](https://marpit.marp.app/theme-css)** — Building custom themes (advanced)
- **[Marp Core GitHub](https://github.com/marp-team/marp-core)** — Source code and issue tracker
- **[Marp CLI GitHub](https://github.com/marp-team/marp-cli)** — Command-line tool for exporting PDFs/PNGs

### Template Files (Embedded CSS)

All templates include complete CSS inline; no external files needed:

- `assets/template-basic.md` - Default theme template
- `assets/template-minimal.md` - Minimal theme template
- `assets/template-colorful.md` - Colorful theme template
- `assets/template-dark.md` - Dark mode template
- `assets/template-gradient.md` - Gradient theme template
- `assets/template-tech.md` - Tech/code theme template
- `assets/template-business.md` - Business theme template
