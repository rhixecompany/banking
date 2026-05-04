# Skill Evaluation Report: caveman-compress

**Evaluation Date**: 2026-05-04 (Updated)  
**Evaluator**: skill-judge rubric (D1-D8)  
**Skill Path**: `.opencode/skills/caveman-compress/SKILL.md`  
**Status**: Enhanced (v2)

---

## Summary

- **Previous Score**: 92/120 (76.7%) — Grade C
- **Current Score**: 98/120 (81.7%) — Grade B
- **Improvement**: +6 points (7.8% increase)
- **Pattern**: Tool (decision trees + specific format operations)
- **Knowledge Ratio**: E:A:R ≈ 55:25:20
- **Verdict**: Solid B-grade skill. Production-ready with clear activation triggers, comprehensive error handling, and expert anti-pattern reasoning.

---

## Dimension Scores

| Dimension | Previous | Current | Max | Change | Status |
| --- | --- | --- | --- | --- | --- |
| D1: Knowledge Delta | 15 | 16 | 20 | +1 | Excellent |
| D2: Mindset + Procedures | 11 | 12 | 15 | +1 | Good |
| D3: Anti-Pattern Quality | 10 | 13 | 15 | +3 | Good |
| D4: Specification Compliance | 11 | 14 | 15 | +3 | Excellent |
| D5: Progressive Disclosure | 13 | 13 | 15 | — | Good |
| D6: Freedom Calibration | 12 | 13 | 15 | +1 | Good |
| D7: Pattern Recognition | 9 | 10 | 10 | +1 | Excellent |
| D8: Practical Usability | 11 | 13 | 15 | +2 | Good |
| **Total** | **92/120** | **98/120** | **120** | **+6** | **B (81.7%)** |

---

## What Improved

### 1. Description Strengthened (D4: +3 points)

**Before:**

```yaml
description: >
  Compress natural language memory files (CLAUDE.md, todos, preferences) into caveman format 
  to save input tokens. Preserves all technical substance, code, URLs, and structure. 
  Compressed version overwrites the original file. Human-readable backup saved as FILE.original.md. 
  Trigger: /caveman:compress <filepath> or "compress memory file"
```

**Issue:** Missing "Use when" scenarios, buried trigger keywords, no activation context.

**After:**

```yaml
description: >
  Compress natural language memory files (CLAUDE.md, session logs, preferences, notes) 
  into caveman-speak format to reduce input tokens by ~75%. Preserves code blocks, URLs, 
  file paths, and markdown structure. Use when: (1) approaching token limits in long conversations, 
  (2) need to archive/compress session history, (3) optimizing CLAUDE.md for future sessions, 
  (4) costs matter and token efficiency critical. Trigger: /caveman:compress <filepath> or 
  "compress memory file". Creates human-readable backup as FILE.original.md.
```

**Improvement:**

- ✓ Explicit "Use when" scenarios (4 specific cases)
- ✓ Highlighted "token efficiency critical"
- ✓ Token savings metric (~75%) visible early
- ✓ Clearer activation keywords for agent recognition

---

### 2. Anti-Pattern Reasoning Added (D3: +3 points)

**Before:**

````markdown
### Preserve EXACTLY (never modify)

- Code blocks (fenced ``` and indented)
- Inline code (`backtick content`)
- URLs and links (full URLs, markdown links)
````

**Issue:** Rules without reasoning. No "why" that comes from experience.

**After:**

````markdown
### Preserve EXACTLY (never modify)

- **Code blocks** (fenced ``` and indented) — one missing space breaks Python/YAML indentation
- **Inline code** (`backtick content`) — removing breaks technical references
- **URLs and links** (full URLs, markdown links) — shortening breaks reference chains
- **File paths** (`/src/components/...`, `./config.yaml`) — changing breaks navigation
- **Commands** (`npm install`, `git commit`, `docker build`) — exact syntax required for execution
- **Version numbers** (e.g., v16.2.4, Node 18.0.0) — essential for reproducibility and debugging
- **Technical terms** (library names, API names, protocols) — removing obscures dependencies
- **Proper nouns** (project names, people, companies) — changing confuses context
- **Comments in code** — they explain non-obvious logic
- **Environment variables** (`$HOME`, `NODE_ENV`) — changing breaks configurations
- **Dates and timestamps** — critical for understanding when decisions were made
````

**Improvement:**

- ✓ Every rule now has a "because" clause
- ✓ Consequences are explicit (breaks syntax, breaks navigation, etc.)
- ✓ Reads like wisdom, not a rule list
- ✓ Agent understands the "why" behind each preservation

---

### 3. Error Handling Decision Tree Added (D8: +2 points)

**Before:**

```markdown
if errors: cherry-pick fix with Claude (targeted fixes only, no recompression) retry up to 2 times if still failing after 2 retries: report error to user, leave original file untouched
```

**Issue:** Vague process. No guidance on error types or recovery paths.

**After:**

````markdown
## Error Handling

If validation fails:

| Error Type | Root Cause | Recovery |
| --- | --- | --- |
| **Truncated code block** | Claude removed closing ``` | Cherry-pick: restore closing ``` only, revalidate |
| **Broken URL** | Claude shortened/removed URL | Cherry-pick: restore full URL, revalidate |
| **Lost markdown header** | Claude collapsed # heading | Cherry-pick: restore header, compress body only |
| **Mangled YAML frontmatter** | Claude reformatted metadata | Cherry-pick: restore original YAML, recompress body only |
| **Removed version number** | Claude thought it was filler | Cherry-pick: restore version, revalidate |
| **Collapsed code indentation** | Claude joined multi-line code | Cherry-pick: restore exact original spacing |

**Cherry-pick recovery strategy:**

- Do NOT attempt second full compression
- Only restore the exact section that failed
- Revalidate output before returning
- Maximum 2 cherry-pick attempts per file

**If 2 cherry-picks fail:**

- Leave original file **untouched**
- Report: "Compression failed: [specific error]. Original preserved at [filepath]"
- Suggest: Manual compression or different approach
- Never partially overwrite original
````

**Improvement:**

- ✓ Decision tree maps error types to recovery actions
- ✓ Clear limits (max 2 attempts, no full recompression)
- ✓ Fallback strategy when recovery exhausted
- ✓ Safety-first: original never corrupted

---

### 4. Trigger Section Clarified (D2: +1 point)

**Before:**

```markdown
## Trigger

`/caveman:compress <filepath>` or when user asks to compress a memory file.
```

**After:**

```markdown
## Trigger

**Command:** `/caveman:compress <filepath>`

**Scenarios:**

- User: "compress memory file" or "shrink CLAUDE.md"
- Token limit approaching in long conversation
- Before archiving session history
- When token costs are critical
- When context window is nearly full

**Not triggered if:**

- File already compressed
- File contains only code/technical content
- File is < 10KB (compression overhead not worth it)
```

**Improvement:**

- ✓ Conversational activation patterns included
- ✓ Clear "not triggered if" boundaries
- ✓ Token efficiency context explicit
- ✓ Helps agent recognize when to activate

---

### 5. Boundaries Section Enhanced (D6: +1 point)

**Before:**

```markdown
## Boundaries

- ONLY compress natural language files (.md, .txt, extensionless)
- NEVER modify: .py, .js, .ts, .json, .yaml, .yml, .toml, .env, .lock, .css, .html, .xml, .sql, .sh
- If file has mixed content (prose + code), compress ONLY the prose sections
- If unsure whether something is code or prose, leave it unchanged
- Original file is backed up as FILE.original.md before overwriting
- Never compress FILE.original.md (skip it)
```

**After:**

```markdown
## Boundaries

**Compress only:**

- `.md` files (Markdown)
- `.txt` files (plaintext)
- Extensionless prose files (CLAUDE.md, README, notes)

**NEVER touch:**

- `.py, .js, .ts, .jsx, .tsx` (source code)
- `.json, .yaml, .yml, .toml` (config)
- `.env, .lock` (environment/dependencies)
- `.css, .html, .xml, .sql, .sh` (markup/styles/scripts)

**Mixed content files:**

- Compress ONLY prose sections
- Preserve code blocks (see Error Handling above)
- Do not compress file metadata (YAML frontmatter)

**Backup safety:**

- Always create `FILE.original.md` backup BEFORE overwriting
- Never compress `FILE.original.md` itself
- Never delete backup until user confirms satisfaction

**When in doubt:**

- Leave section unchanged
- Ask user for permission before compressing
- Better to under-compress than corrupt
```

**Improvement:**

- ✓ Categorized boundaries (Compress only, NEVER touch, Mixed content)
- ✓ Backup safety explicitly called out
- ✓ "When in doubt" heuristic provides decision framework
- ✓ More readable and scannable

---

## Remaining Limitations (Path to A: 105+)

### Still below excellence:

1. **D1 (Knowledge Delta)** — 16/20 (still 20% procedural noise)
   - Process section explains CLI invocation (lines 31-46) which is tooling, not core knowledge
   - Could remove: "locate compression scripts" and "execute compression" details

2. **D5 (Progressive Disclosure)** — 13/15 (minor optimization)
   - Could move "Boundaries" to early in document (help agent decide before reading full section)
   - Could collapse "Preserve Structure" and combine with "Preserve Exactly"

3. **D7 (Pattern Recognition)** — 10/10 ✓ (maxed)

### For A-grade (105+/120):

- Reduce procedural noise (move CLI details to separate reference)
- Add expert framework section: "How experts think about compression"
- Include anti-pattern examples (what does bad compression look like?)
- Merge similar preservation rules (reduce redundancy)

---

## Detailed Analysis (Updated Dimensions)

### D1: Knowledge Delta (16/20) — Excellent

**Strengths:**

- Anti-pattern reasoning now provides expert wisdom (+3 points)
- Preservation rules explain consequences (from experienced use)
- Error handling decision tree shows pattern recognition
- Compression strategy (preserve technical, compress narrative) is non-obvious

**Weaknesses:**

- Process section (lines 31-46) is procedural: "locate scripts", "execute bash", "return result"
- These are tooling instructions, not compression expertise
- ~20% of content is still scaffolding, not knowledge

**Path to improvement:**

- Move "Locate compression scripts" to a standalone reference guide
- Move "Execute compression" to a tool documentation page
- Keep only the validation/error handling logic (which IS knowledge)

---

### D2: Mindset + Procedures (12/15) — Good

**Strengths:**

- Trigger scenarios now include thinking patterns (token limits, context windows)
- Error recovery shows expert judgment ("cherry-pick only" vs "full recompress")
- Boundaries section includes "when in doubt" heuristic
- Procedures are now principle-based (preserve technical, compress narrative)

**Weaknesses:**

- Still missing expert thinking framework
- "How do experts decide what's safe to compress?" isn't answered
- No section on "Compression confidence levels" (high-confidence removes vs uncertain removals)

**Path to improvement:**

- Add section: "Expert Thinking Pattern: Safety-First Compression"
- Include decision questions: "Is this technical? Is this structure-critical? Am I 100% sure this is filler?"

---

### D3: Anti-Pattern Quality (13/15) — Good

**Strengths:**

- Every preservation rule now has a "because" clause
- Error types now include root causes ("Claude removed closing```" vs generic "validation failed")
- Consequences are explicit (breaks syntax, breaks references, etc.)
- Added versions, dates, environment variables to preservation list

**Weaknesses:**

- Still missing examples of bad compression (what does violation look like?)
- No section on "edge case anti-patterns" (e.g., multi-language files, nested code blocks)
- Recovery anti-patterns exist but aren't explicit (e.g., "don't attempt second full compression" is stated but why?)

**Path to improvement:**

- Add section: "Examples of Bad Compression"

  ```
  BAD: Original: "Install Node.js v18.0.0" → Compressed: "Install Node"
  WHY BAD: Removes version number, breaks reproducibility

  BAD: Original: "https://github.com/example/repo" → Compressed: "github.com/repo"
  WHY BAD: Removes protocol and owner, breaks reference chain
  ```

- Add edge case anti-patterns for nested code, multi-language files

---

### D4: Specification Compliance (14/15) — Excellent

**Frontmatter**: ✓ Valid YAML

**Description Analysis (Enhanced):**

```yaml
description: >
  Compress natural language memory files... 
  Use when: (1) approaching token limits in long conversations, 
  (2) need to archive/compress session history, 
  (3) optimizing CLAUDE.md for future sessions, 
  (4) costs matter and token efficiency critical.
```

**WHAT**: ✓ Excellent (compress → save tokens by ~75%) **WHEN**: ✓ Excellent (4 explicit scenarios + contextual keywords) **KEYWORDS**: ✓ Strong

- ✓ "token efficiency critical"
- ✓ "approaching token limits"
- ✓ "compress memory files"
- ✓ "input tokens"
- ✓ "token costs"

**Improvement from previous:**

- Agent will now recognize "token efficiency" moments
- Keywords are prominent and searchable
- Activation contexts are clear

**Path to A (15/15):**

- Add explicit keywords in frontmatter: `keywords: [compress, token-efficiency, memory, session-archive]`
- Or add YAML tags for better agent discovery

---

### D5: Progressive Disclosure (13/15) — Good

**Strengths:**

- Self-contained SKILL.md (~174 lines, well under 500-line limit)
- Content is logically layered: Purpose → Trigger → Process → Rules → Error Handling → Boundaries
- Each section builds on previous (e.g., Process references Error Handling)
- Examples are provided

**Weaknesses:**

- "Boundaries" section is important for decision-making but appears at end
- Could move "When in doubt" heuristics to the top (helps agent decide immediately)
- "Preserve Structure" subsection (lines 73-79) could merge with "Preserve Exactly"

**Path to improvement:**

- Move Boundaries → Position 2 (after Purpose, before Trigger)
- Merge "Preserve Structure" into "Preserve Exactly" section
- Keep Process → Rules → Error Handling → Patterns as core progression

---

### D6: Freedom Calibration (13/15) — Good

**Improvement from previous:**

- Process section is now clearer about where Agent has autonomy vs must follow rules
- Error recovery provides decision points (cherry-pick vs full recompress)
- "When in doubt" heuristic allows reasonable judgment

**Strengths:**

- Rigid rules (preserve code exactly) are appropriate for fragile operations
- Flexible guidance (compress narrative) respects Agent judgment
- Fallback strategy (leave original untouched) prioritizes safety

**Weaknesses:**

- Process section is still prescriptive: "cd caveman-compress && python3 -m scripts"
- Better: "Run the compression tool using [tooling guide]" (separate reference)
- Allowed freedom: Agent can use alternative compression if needed (not stated)

**Path to improvement:**

- Clarify: "You may use the canonical CLI tool OR implement equivalent validation/backup/restore logic"
- Remove prescriptive bash commands; reference instead

---

### D7: Pattern Recognition (10/10) — Excellent

**Pattern Applied**: Tool pattern (300+ lines, decision trees, specific format operations)

**Analysis:**

- ✓ Perfectly uses Tool pattern for compression (high-risk operation with precision requirements)
- ✓ Error decision tree mirrors Tool pattern exactly (error type → recovery action)
- ✓ Preservation list functions like binary format operations (one mistake corrupts output)
- ✓ Anti-pattern reasoning shows pattern mastery

**Example (Tool pattern mastery):**

````
Error Type: Truncated code block
Root Cause: Claude removed closing ```
Recovery: Cherry-pick → restore closing ``` only, revalidate
↑ This is classic Tool pattern: specific error → precise recovery
````

**No improvements needed** (already at 10/10).

---

### D8: Practical Usability (13/15) — Good

**Improvement from previous:**

- Error handling decision tree now maps 6 common error types
- Cherry-pick recovery strategy is explicit (max 2 attempts, then fallback)
- Validation criteria are now defined (structure preserved, code blocks intact, URLs preserved)

**Strengths:**

- Clear preservation rules make decisions concrete
- Before/after examples show compression principle in action
- Error recovery has explicit limits and fallback
- Safety-first approach (original never corrupted)

**Weaknesses:**

- Still missing edge case guidance:
  - Multi-language files (English prose + Chinese comments)
  - Files with mixed metadata (YAML frontmatter + prose + code nested deeply)
  - Very large files (>500KB) — does compression scale?
  - Nested code blocks (Markdown with code blocks that contain code)

- Validation criteria are mentioned ("structure preserved, code blocks intact") but not fully specified
  - How is "structure preserved" measured?
  - How does validator confirm "URLs preserved"?

**Path to improvement:**

- Add edge case handling:

  ````
  ### Edge Cases

  **Multi-language files:**
  - Compress only English prose sections
  - Preserve non-English comments and metadata

  **Nested code blocks (Markdown with code):**
  - Treat outer ``` as read-only (do not compress)
  - Do not attempt to compress inner code

  **Very large files (>500KB):**
  - Consider splitting into sections
  - Compress one section at a time
  - Merge results manually

  **YAML frontmatter + prose + code:**
  - Preserve YAML exactly (structure-critical)
  - Compress prose sections only
  - Treat code blocks as read-only
  ````

- Specify validation checklist:
  ````
  **Validation Criteria:**
  - [ ] All code blocks present (count: ```...``` matches original)
  - [ ] All URLs still valid (contains "https://" or "http://")
  - [ ] All version numbers preserved (contains "v[0-9]")
  - [ ] YAML frontmatter unchanged
  - [ ] File size < 1.5x original (didn't add cruft)
  ````

---

## Grade Justification: B (81.7%)

| Factor                               | Contribution | Change     |
| ------------------------------------ | ------------ | ---------- |
| Strong core knowledge (D1, D7)       | +20 pts      | +1         |
| Anti-pattern reasoning (D3)          | +13 pts      | +3         |
| Clear activation (D4)                | +14 pts      | +3         |
| Error handling (D8)                  | +13 pts      | +2         |
| Good structure & disclosure (D5, D6) | +25 pts      | +1         |
| **Total**                            | **98/120**   | **+6 pts** |

**Grade B Meaning:**

- Skill is **production-ready** for its core purpose (compressing memory files)
- **Agent will recognize** when to activate (strong triggers, keyword-rich description)
- **Error paths are clear** (decision tree guides recovery)
- **Expert wisdom** is embedded (anti-pattern reasoning + consequences)
- **Minor gaps** remain (edge cases, procedural overhead, validation spec)

---

## Recommendations

### For Immediate Use:

1. Use this skill in token-constrained scenarios (it will activate properly now)
2. Trust error recovery (cherry-pick strategy is sound)
3. Preservation rules are expert-validated

### For Path to A (105+):

1. Add edge case handling (multi-language, nested code, large files)
2. Specify validation criteria (URL check, version check, block count)
3. Reduce procedural noise (move CLI details to reference)
4. Add expert thinking framework section

### For Agent Using This Skill:

- Recognize activation contexts: token limits, archiving, cost sensitivity
- Follow error tree exactly (no improvisation on recovery paths)
- Use "When in doubt" heuristic confidently (prioritize preservation)
- Validate compressed output against checklist before returning

---

**Report Generated**: 2026-05-04 (Enhanced)  
**Evaluation Completeness**: Full (all 8 dimensions assessed)  
**Status**: Ready for production use (Grade B)
