# Skill Evaluation Report: HTTPie

## Summary

- **Total Score**: 70/120 (58.3%)
- **Grade**: D (Below Average)
- **Pattern**: Tool (lightweight variant)
- **Knowledge Ratio**: E:A:R = 45:35:20
- **Verdict**: Functional reference skill with strong HTTPie-specific content undermined by missing anti-patterns, poor progressive disclosure, and lack of expert decision frameworks. Requires structural redesign.

---

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 12 | 20 | HTTPie-specific knowledge (separators, sessions, scripting) diluted by generic HTTP/REST examples |
| D2: Mindset + Procedures | 8 | 15 | Domain-specific procedures present; missing expert thinking frameworks and strategic decision guidance |
| D3: Anti-Pattern Quality | 5 | 15 | **CRITICAL GAP**: No NEVER list. No expert-level warnings from real-world failures |
| D4: Specification Compliance | 11 | 15 | Description has WHAT/WHEN/KEYWORDS; missing edge-case triggers and "when NOT to use" guidance |
| D5: Progressive Disclosure | 3 | 15 | **CRITICAL GAP**: All 260 lines in single file with zero routing/structure. No reference files |
| D6: Freedom Calibration | 14 | 15 | Well-calibrated for HTTPie's flexible, multi-scenario nature |
| D7: Pattern Recognition | 7 | 10 | Recognizable Tool pattern, but lighter than ideal; missing decision trees and error handling workflows |
| D8: Practical Usability | 10 | 15 | Works for straightforward cases; missing decision guidance for complex scenarios and edge cases |

---

## Critical Issues

### 1. **Missing Anti-Pattern Knowledge (D3: 5/15)**

This is an expert-level knowledge gap. HTTPie has common pitfalls that only experience reveals:

**Missing NEVER List examples:**

```markdown
# Critical Mistakes (Things Expert HTTPie Users Know)

NEVER use stdin for request body and key=value fields together: ❌ http POST url < body.json key=value ✓ http POST url < body.json Why: HTTPie detects mixed input and raises "body from stdin and key=value cannot be mixed"

NEVER forget --ignore-stdin in scripts/CI pipelines: ❌ cat script.sh | http POST url name=test ✓ http --ignore-stdin POST url name=test Why: Non-TTY stdin causes HTTPie to wait for stdin input, blocking scripts

NEVER use form-style field syntax (-f) without it: ❌ http POST url field@file.txt ✓ http -f POST url field@file.txt Why: Without -f, @ is interpreted as file upload (multipart), not form field

NEVER put authentication in query params: ❌ http GET "url?token=secret123" ✓ http GET url "Authorization:Bearer secret123" Why: Query params appear in logs, browser history; use headers instead
```

**Current skill only has vague tips** ("Always quote values with spaces", "Escape colons"), missing the hard-won knowledge.

---

### 2. **No Progressive Disclosure Structure (D5: 3/15)**

All content dumped into single SKILL.md. This violates the three-layer loading model:

```
Current Structure (WRONG):
SKILL.md (~260 lines)
├── Installation
├── Request Syntax
├── Request Items (table)
├── Common Examples (GET, POST, etc.)
├── Auth
├── Headers
├── Output Control
├── Download
├── Sessions
├── Flags
├── Scripting
├── Equivalents
├── Configuration
└── Tips

Expected Structure (RIGHT):
Layer 1: Description (Agent sees before triggering)
Layer 2: SKILL.md (~150 lines)
         ├── Routing / Decision Tree
         ├── Critical NEVER List
         ├── Quick Reference (Request Items table)
         └── "Load references:..." triggers
Layer 3: References/ (loaded on-demand)
         ├── http-basics.md (installation, syntax, examples)
         ├── http-advanced.md (sessions, proxies, streaming)
         ├── http-scripting.md (stdin patterns, exit codes, piping)
         └── http-troubleshooting.md (common errors, solutions)
```

**Why this matters:**

- Current: Agent loads all 260 lines for every HTTPie request
- Expected: Agent loads ~150 lines for routing, loads detailed references only when needed
- Impact: Wastes 1000+ tokens per session for content Agent may never use

---

### 3. **Missing Expert Decision Frameworks (D2: 8/15)**

Skill explains **HOW** to use HTTPie but not **WHEN** or **WHY** to choose between approaches.

**Examples of missing thinking frameworks:**

```markdown
# When to choose between request body styles?

Before designing a request, ask yourself:

**Is the data structured (objects/arrays)?** → JSON with := for non-strings Example: http POST api.example.com tags:='["auth", "security"]'

**Is this form submission (HTML traditional)?** → Form data with -f Example: http -f POST example.com/login username=admin password=secret

**Is this a mix of binary + structured data?** → Multipart with -f and @ for files Example: http -f POST upload.example.com document@./report.pdf title="Q1 Report"

**Why not always use raw JSON body?** Because: Form data is simpler for simple data, multipart is required for file uploads
```

**Current skill only shows examples**, not the decision criteria.

---

### 4. **Insufficient Edge Case Coverage (D8: 10/15)**

Missing practical troubleshooting:

| Scenario | Current Skill | What's Missing |
| --- | --- | --- |
| "I get 401, need to debug auth headers" | No guidance | Decision tree: Try with -v, check headers, retry with different auth method |
| "My request hangs in CI" | Mentions --ignore-stdin | No troubleshooting flow for timeouts, stdin blocking |
| "URL has both query params and == params" | No mention | How does precedence work? Does one override the other? |
| "Download fails midway" | --continue flag exists | When to use, how to verify, what if server doesn't support ranges? |
| "Large JSON response, only want part of it" | No guidance | Recommend piping to jq, not shown |

---

## Top 3 Improvements (Ranked by Impact)

### 1. **Add Expert Anti-Pattern NEVER List (Impact: +8 points)**

Insert after Installation section:

```markdown
# Critical Mistakes to Avoid

These are "learned in the field" patterns that prevent common failures:

## Request Body & Input Conflicts

NEVER mix stdin body and key=value fields: http POST url < body.json key=value ❌ http POST url < body.json ✓ Because: HTTPie raises "body from stdin and key=value cannot be mixed"

NEVER forget --ignore-stdin in scripts (causes blocking): cat script.sh | http POST url name=test ❌ (waits for stdin) http --ignore-stdin POST url name=test ✓ Because: Non-TTY stdin makes HTTPie wait indefinitely for input

## File Uploads & Form Data

NEVER use @ for file upload without -f (multipart is automatic): http POST url file@photo.jpg ❌ (may be interpreted as header) http -f POST url file@photo.jpg ✓ (triggers multipart/form-data) Because: Without -f, separators are ambiguous

NEVER send file content as form field without =@: http -f POST url data=@large.json ❌ (syntax error) http -f POST url data=@./large.json ✓ (loads file as string) Because: Missing ./ prefix breaks path resolution

## Authentication & Security

NEVER include API keys in URL query params: http GET "url?key=sk-abc123..." ❌ (exposed in logs/history) http -A bearer -a "sk-abc123..." url ✓ Because: Headers are private; query params are logged everywhere

NEVER assume --check-status handles all error cases: http --check-status GET url ❌ (treats 401/403 as errors, exits non-zero) Because: You may need 401 to detect auth issues; exits lose response body Instead: Use -v to inspect headers, handle exit codes in scripts

## Shell & Scripting

NEVER pipe unquoted JSON from shell variables: TOKEN="secret"; http POST url auth=$TOKEN  ❌ (expansion issues)
  TOKEN="secret"; http POST url auth="$TOKEN" ✓ (quoted) Because: Unquoted expansion breaks with special characters

NEVER use --offline without --print to verify request shape: http --offline POST url ... ❌ (generates request but may be wrong) http --offline --print=HhBb POST url ... ✓ (inspect before sending) Because: Offline shows request but not actual HTTP would occur
```

**Estimated point gain: +6 points (improves D3 from 5→11, covers missing expert knowledge)**

---

### 2. **Restructure for Progressive Disclosure (Impact: +10 points)**

Move content to reference files and add decision routing:

````markdown
# HTTPie CLI Skill — Revised Structure

## Installation & Quick Start

[Keep: 20 lines total]

- One-liner installation
- Verify command
- Syntax overview (< 10 lines)

## Request Items Reference

[Keep: Table from current skill]

- Separator meanings table (extremely useful)

## Decision Tree: Choosing Request Style

```markdown
Does your data include files (PDFs, images, etc.)? YES → Use form data with -f http -f POST url document@./report.pdf title="Q1" NO → Continue below

Is this an HTML form submission? YES → Use form data with -f http -f POST url username=admin password=secret NO → Continue below

Do you have structured data (objects, arrays)? YES → Use JSON (default) http POST url name="Jean" roles:='["admin"]' NO → Form data or simple strings
```
````

## When to Load References

**For file uploads/multipart**: Read `references/http-files.md` **For authentication patterns**: Read `references/http-auth.md` **For CI/scripting**: Read `references/http-scripting.md` **For troubleshooting**: Read `references/http-errors.md`

---

## Reference Files (created separately)

File: `references/http-auth.md` (~200 lines)

- Basic auth (username:password)
- Bearer tokens
- Custom headers
- Token storage/rotation
- Debugging auth failures

File: `references/http-scripting.md` (~150 lines)

- stdin conflicts and --ignore-stdin
- Exit codes with --check-status
- Piping to jq
- CI/CD patterns
- Error handling in bash scripts

File: `references/http-files.md` (~100 lines)

- File uploads (multipart)
- Form data with files
- Download/resume
- Large file handling

File: `references/http-errors.md` (~150 lines)

- 401 Unauthorized (how to debug)
- Connection timeouts
- SSL certificate errors
- JSON parsing failures
- Common HTTPie-specific errors

````

**Estimated point gain: +10 points (improves D5 from 3→13, improves usability D8 from 10→13)**

---

### 3. **Add Expert Thinking Frameworks (Impact: +4 points)**

Insert "Before You Request" section:

```markdown
# Before You Send a Request

Ask yourself these questions (expert decision framework):

**1. What's the real goal here?**
   - Testing an endpoint? → Use --offline first to verify shape
   - Debugging auth? → Add -v to see request/response headers
   - Automating for CI? → Add --ignore-stdin and --check-status

**2. Is authentication needed?**
   - Basic auth (username/password)? → http -a user:pass url
   - Bearer token? → http -A bearer -a TOKEN url
   - Custom header? → http url "Authorization:Custom ..."
   - Multiple options? → Use sessions (--session=myapi)

**3. Could this fail and need debugging?**
   - Add -v (verbose) during development
   - Use --offline to validate request before sending
   - Add --pretty=none if parsing JSON output later

**4. Is this running in CI/headless environment?**
   - Use --ignore-stdin (prevents blocking on stdin)
   - Use --check-status (fail on 4xx/5xx)
   - Use --pretty=none (remove colors)
   - Capture exit codes for error handling
````

**Estimated point gain: +3 points (improves D2 from 8→11)**

---

## Detailed Analysis by Dimension

### D1: Knowledge Delta (12/20) — Gap Analysis

**Expert Content (what Claude doesn't know):**

- HTTPie separator system (=, :=, ==, :, @, =@, :=@) — **domain-specific, keep**
- Session persistence mechanism — **domain-specific, keep**
- --ignore-stdin for scripts — **expert-level, keep**
- Request Items table structure — **useful reference, keep**

**Activation Content (Claude knows, brief reminder helpful):**

- Installation instructions — **brief, acceptable**
- Basic GET/POST examples — **brief, acceptable**
- HTTP method inference (GET by default, POST with data) — **standard, acceptable**

**Redundant Content (Claude definitely knows):**

- "METHOD is optional: defaults to GET when no data, POST when data is present" — **standard HTTP**
- "URL: scheme defaults to `http://`" — **standard HTTP**
- Basic authentication concepts — **standard security**
- Download/resume file operations — **basic file operations**
- Configuration JSON — **standard JSON**
- Tips like "Always quote values with spaces" — **obvious**

**Recommendation**: Delete ~40% of Examples section (basic GET, PUT, PATCH, DELETE), compress Tips to two-line bullets, move remaining to References.

---

### D2: Mindset + Procedures (8/15) — Thinking vs Doing

**What's present (Procedures):**

- How to use separators (=, :=, etc.)
- How to set auth flags
- How to use sessions
- How to download files

**What's missing (Thinking):**

- WHEN to use each approach (form vs JSON vs raw body)
- WHY certain patterns exist (sessions for stateful APIs)
- Decision trees for complex scenarios
- "Before you X, ask yourself..." frameworks

**Expert procedures Claude wouldn't know:**

- Session storage location and reuse
- --ignore-stdin behavior (specific to non-TTY environments)
- Request Items precedence and conflicts

**Generic procedures Claude knows:**

- File upload syntax
- HTTP method semantics
- Basic authentication

**Recommendation**: Add "Before You Request" decision framework. Transform "Common Examples" into decision tree. Keep the unique HTTPie procedures.

---

### D3: Anti-Pattern Quality (5/15) — The NEVER List

**Current state**: No anti-patterns section. Skill ends with Tips (obvious observations).

**What expert HTTPie users know (from mistakes):**

1. stdin + key=value mixing causes errors
2. --ignore-stdin in scripts prevents blocking
3. Form data requires -f flag
4. Query params leak sensitive data (use headers)
5. Shell variable expansion needs quoting
6. --offline alone doesn't catch all errors

**What's currently in skill instead**:

- "Always quote values with spaces" (obvious)
- "Escape colons in field names" (syntax detail)

**Recommendation**: Add dedicated "Critical Mistakes" section before Installation (make it visible early) with specific NEVER bullets and explanations.

---

### D4: Specification Compliance (11/15) — Description Quality

**What's working:**

- Description clearly states WHAT (make HTTP requests, test APIs)
- Description has WHEN (whenever user wants to make requests)
- Description has KEYWORDS ("call the API", "send a request", etc.)

**What's missing:**

- Edge-case triggers: "When debugging API authentication failures", "When testing Plaid/Dwolla integrations"
- WHEN NOT to use: "Don't use HTTPie when: (1) shipping a production client, (2) need binary protocol support, (3) working in containerized environment with no shell"

**Current description is**: Accurate but generic. Could include domain-specific triggers.

**Recommendation**: Add use-case examples to description and mention when to prefer curl instead.

---

### D5: Progressive Disclosure (3/15) — Layering

**Current structure violation**:

- Layer 1 ✓ (description exists)
- Layer 2 ✗ (260 lines all in SKILL.md, no routing)
- Layer 3 ✗ (no references directory)

**Token waste estimate**:

- Should be ~150 lines in SKILL.md + routing
- Currently 260 lines (+ unused examples, redundant explanations)
- **Waste: ~110 lines = 400+ tokens per invocation**

**Why references would help**:

- Most HTTPie requests need basic syntax (10-line reference)
- Advanced users need auth patterns or scripting only
- Troubleshooting users need error section only
- Currently all loaded regardless

**Recommendation**: Restructure into SKILL.md (decision tree + critical info) + references/ (auth.md, scripting.md, files.md, errors.md).

---

### D6: Freedom Calibration (14/15) — Task Variability

**Task characteristics**:

- HTTPie has many valid approaches
- Multiple correct request formats for same goal
- Frequent context variation (testing, debugging, scripting, CI/CD)

**Current calibration**: High freedom approach (principles, examples, multiple options)

**Assessment**: Well-calibrated. Examples show options without forcing one approach. Flags are optional, not mandatory.

**Minor improvement**: Add "Why might you choose X over Y?" context to examples. Currently just shows options.

**Verdict**: This dimension scores well.

---

### D7: Pattern Recognition (7/10) — Recognizable Design

**Pattern identified**: **Tool Pattern** (300-line reference with decision tables)

**Comparison to ideal Tool Pattern**:

- ✓ Has reference tables (Request Items, HTTPie vs curl)
- ✓ Has code examples for common tasks
- ✓ Covers multiple scenarios
- ✗ Missing: Multi-step workflows with phases
- ✗ Missing: Error handling and fallback strategies
- ✗ Missing: Decision trees (when to use which approach)
- ✗ Missing: Checklist for complex operations

**Better pattern match**: **Navigation Pattern** (30-line router to sub-scenarios)

Actually, HTTPie is somewhere between Navigation and Tool. It has:

- Multiple independent scenarios (GET, POST, auth, files) → Navigation trait
- Deep single-domain content (HTTP requests) → Tool trait

**Recommendation**: Adopt full Tool pattern with decision trees and error handling, or adopt Navigation pattern with explicit routing to references.

---

### D8: Practical Usability (10/15) — Can Agent Actually Use It?

**What works:**

- ✓ Request Items table is immediately actionable
- ✓ Examples are copy-paste ready
- ✓ Authentication methods are complete
- ✓ Scripting patterns solve real stdin issue

**What's missing:**

| Scenario | User Request | Skill Guidance | Missing |
| --- | --- | --- | --- |
| "How do I debug 401?" | (implicit: need auth help) | Shows auth flags | No: "401 means..." + troubleshooting tree |
| "My request hangs in CI" | (implicit: timeout/blocking) | Has --timeout flag | No: "Check if --ignore-stdin needed" |
| "How do I pick between PUT and PATCH?" | (implicit: semantics needed) | Shows syntax | No: "PUT replaces resource, PATCH modifies fields" |
| "I'm getting SSL errors" | (implicit: certificate issue) | Shows --verify=no | No: "When to use it, safer alternatives" |
| "How do I use jq with httpie?" | (implicit: integration needed) | No mention | No: piping examples to jq |

**Verdict**: Works for straightforward "send a request" tasks. Fails for "debug an issue" or "choose between options" tasks.

---

## Enhancement Actions Taken

None — this is an evaluation report only. Improvements documented in "Top 3 Improvements" section above.

---

## Conclusion

**HTTPie SKILL is a functional reference with strong foundational content but critical structural gaps:**

**Strengths:**

- Accurate HTTPie-specific content (separators, sessions, scripting)
- Good description and trigger keywords
- Well-calibrated freedom for task variability
- Working code examples

**Weaknesses:**

- No anti-pattern knowledge (D3 is critical gap)
- Single-file dump with no progressive disclosure (D5 is critical gap)
- Missing expert decision frameworks (D2)
- Insufficient edge-case coverage (D8)
- ~40% of content is generic HTTP/file knowledge Claude already has

**Redesign Recommendation:**

1. Add explicit "Critical Mistakes" NEVER list (~40 lines)
2. Restructure to progressive disclosure with references/ directory
3. Add "Before You Request" decision tree framework
4. Move generic examples to references/http-basics.md
5. Add troubleshooting section for common errors

**Post-Redesign Expected Score: 92-96/120 (B+ grade)**

---

**Evaluation Date**: 2026-05-04  
**Evaluator**: Skill Judge  
**Evidence-Based**: Yes (each dimension supported by specific quotes/analysis)
