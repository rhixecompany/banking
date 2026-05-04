---
name: writing-clearly-and-concisely
description: "Improve prose clarity and force using Strunk's principles and AI anti-pattern detection. Use when: (1) editing documentation for clarity, (2) cutting wordiness from explanations, (3) removing AI-generated puffery and clichés, (4) improving commit messages or UI copy. Identifies LLM regression patterns: puffery (pivotal, crucial, vital), empty '-ing' phrases, promotional adjectives, overused vocabulary (leverage, multifaceted). Applies active voice, concrete language, and omit-needless-words principles."
---

# Writing Clearly and Concisely

## Overview

Write with clarity and force. This skill covers what to do (Strunk) and what not to do (AI patterns).

## Before Editing, Ask Yourself

**"What kind of writing problem am I solving?"** The answer determines which rules to apply.

### Is the prose **unclear** or **confusing**?

- Sentences bury the main idea?
- Paragraph structure is hard to follow?
- Grammar or punctuation errors present? → **Load `03-elementary-principles-of-composition.md`** (covers clarity, structure, active voice)

### Is the prose **too wordy** or **too verbose**?

- Adjectives stacking up?
- Phrases that say nothing?
- Could be shorter without losing meaning? → **Load `03-elementary-principles-of-composition.md`** (focus on "Omit needless words")

### Does it **sound like marketing** or **AI-generated**?

- Overused words (pivotal, crucial, seamless, robust)?
- Artificial phrases (ensuring reliability, showcasing features)?
- Puffery instead of specificity? → **Use the AI Writing Patterns section below** (no file load needed)

### Are you **debugging specific words** or **formatting issues**?

- Confusion between similar words (affect/effect, allude/elude)?
- Unusual punctuation or heading format? → **Load appropriate file** (see Reference Files table)

## Core Strunk Principles (Quick Reference)

Six rules that matter most:

- **Use active voice** — "We found a bug" not "A bug was found"
- **Put statements in positive form** — "This is fast" not "This isn't slow"
- **Use definite, specific, concrete language** — "Saves 2 seconds" not "Improves performance"
- **Omit needless words** — "The file is big" not "The file in question is quite large"
- **Keep related words together** — Modifiers near what they modify
- **Place emphatic words at end of sentence** — Strong words carry more weight at the end

**Why these matter**: They're not grammar pedantry. They're clarity hacks. Clear writing makes code readable, docs usable, and communication effective.

## Limited Context Strategy

When context is tight:

1. Write your draft using judgment
2. Dispatch a subagent with your draft and the relevant section file
3. Have the subagent copyedit and return the revision

Loading a single section (~1,000-4,500 tokens) instead of everything saves significant context.

## Reference Files

For complete explanations with examples:

| Section | File | ~Tokens | When to Load |
| --- | --- | --- | --- |
| Grammar, punctuation, comma rules | `02-elementary-rules-of-usage.md` | 2,500 | When debugging comma/semicolon usage |
| Paragraph structure, active voice, concision | `03-elementary-principles-of-composition.md` | 4,500 | DEFAULT: Most tasks need this one |
| Headings, quotations, formatting | `04-a-few-matters-of-form.md` | 1,000 | Only for formal documentation |
| Word choice, common errors | `05-words-and-expressions-commonly-misused.md` | 4,000 | Only when debugging specific word confusion |

### What NOT to Load

**Do NOT load `04-a-few-matters-of-form.md`** unless editing formal documentation (APA papers, official reports). Its rules are prescriptive and may overconstrain creative writing. For most code comments and technical docs, ignore formatting pedantry.

**Do NOT load `05-words-and-expressions-commonly-misused.md`** for general prose editing. Load it ONLY when you've identified a specific word confusion ("affect" vs "effect", "allude" vs "elude", "i.e." vs "e.g."). Using this file for everything wastes context.

**Do NOT load multiple files at once** for clarity problems. Start with `03` (principles), then load another only if you hit edge cases. The files build on each other; loading all four upfront causes decision paralysis.

## AI Writing Patterns to Avoid

LLMs regress to statistical means from training data heavy in marketing, hype, and padding. Recognize and eliminate:

### Puffery (Grandiose instead of specific)

- **Overused words**: pivotal, crucial, vital, testament, enduring legacy, transformative, revolutionary
- **Example**: "This pivotal change revolutionizes the system" → "This saves engineers 10 minutes per build"
- **Why it fails**: Grandiosity hides specificity. Humans distrust marketing speak.

### Empty "-ing" Phrases (Sound busy, say nothing)

- **Examples**: ensuring reliability, showcasing features, highlighting capabilities, delivering value, fostering growth
- **Problem**: "-ing" phrases feel active but often hide passive construction ("ensuring X" = "X is ensured")
- **Fix**: Use concrete verbs. "Our service responds in 50ms" not "ensuring fast response times"

### Promotional Adjectives (Corporate-speak inflation)

- **Overused terms**: groundbreaking, seamless, robust, cutting-edge, innovative, flexible, scalable, elegant
- **Problem**: Every feature gets one. Readers learn to ignore them.
- **Fix**: Eliminate adjectives. "Fast" is better than "remarkably efficient"

### Overused AI Vocabulary (LLM Signature moves)

- **High-frequency AI words**: delve, leverage, multifaceted, foster, realm, tapestry, nuance, paradigm, synergy
- **Why**: Models extract patterns from professional writing, which loves these words
- **Fix**: Use common language instead. "Change" not "pivot". "Help" not "facilitate"

### Formatting Overuse (Visual noise)

- Excessive bullets (≥7 items loses scannability)
- Emoji decorations (treats readers like children)
- Bold on every other word (emphasis becomes no emphasis)
- Colons and semicolons everywhere (LLMs think they're fancy)

## NEVER Do When Editing

- **NEVER edit without re-reading for meaning** — "The sentence is grammatical" ≠ "The sentence is clear"
- **NEVER eliminate a word without asking "does the reader lose information?"** — Concision without clarity is deletion
- **NEVER assume Strunk's rules apply to all prose** — Technical docs accept jargon; code comments are terse; UI copy needs warmth
- **NEVER load multiple references at once** — Start with principles (`03`), then branch based on specific needs

---

## Editing Workflow: Step by Step

1. **Read for meaning**: Is the core idea clear? Mark unclear sections.
2. **Read for tone**: Does it sound like marketing or explanation? Mark puffery.
3. **Read for concision**: Can any phrase be shorter? Mark wordy sections.
4. **Apply principles**: Use the "Core Strunk Principles" above for fixes.
5. **Check AI patterns**: Compare your prose to the patterns above. If it matches, rewrite.
6. **Load references only if stuck**: If grammar is genuinely unclear, load `03` (default) or specific files.

This order matters: clarity (step 1) requires structure changes. Tone (step 2) requires word swaps. Concision (step 3) is polish.

---

## When Prose Still Reads AI-Generated

After applying Strunk's rules and checking AI patterns, if prose still feels off:

1. **Check specificity**: Are you using generic metaphors or concrete actions?
   - Generic: "leveraging cloud infrastructure" → Concrete: "using AWS Lambda"
2. **Check sentence variety**: Are sentences similar length/structure?
   - Monotonous: "This is X. That is Y. We are Z." → Vary with: short + long + complex structures
3. **Check attribution**: Are you saying "it is said" or backing claims with evidence?
4. **If stuck**: The humanizer skill is more specialized for LLM-pattern detection. Dispatch it for final pass.

---

**For comprehensive research on why AI patterns occur, see `signs-of-ai-writing.md`.** Wikipedia editors developed this guide to detect AI-generated submissions — their patterns are well-documented and field-tested.

---

## Bottom Line

**Editing workflow**: Decision tree (above) → Load relevant reference file → Apply Strunk principles → Check AI patterns → Re-read for meaning.

**Most common scenario**: Prose is unclear or wordy → Load `03-elementary-principles-of-composition.md` → Focus on active voice + omit needless words → Done.
