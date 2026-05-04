---
name: code-docs
description: Apply Google Style documentation standards to Python docstrings, Go comments, and Terraform descriptions. Use when writing code that needs documentation, asked to "add docstrings", "document this code", "follow Google Style", or reviewing documentation quality. Routes to language-specific Google Style guides with expert trade-off frameworks.
---

# Code Documentation Standards

Route to language-specific Google Style guides. Provides expert decision frameworks for when to document, how much detail is appropriate, and when to deviate from strict style guidelines based on audience and code lifecycle.

## Quick Routing

**Identify your code language, then load the corresponding reference:**

| Language | File Extension | Load This Guide | Load Others? |
| --- | --- | --- | --- |
| **Python** | `.py` | `references/python_google_style.md` (MANDATORY, read completely) | Do NOT load Go or Terraform guides |
| **Go** | `.go` | `references/go_google_style.md` (MANDATORY, read completely) | Do NOT load Python or Terraform guides |
| **Terraform** | `.tf` | `references/terraform_style.md` (MANDATORY, read completely) | Do NOT load Python or Go guides |

**Example (Python):**

```python
def calculate_interest(principal: float, rate: float, years: int) -> float:
    """Calculate compound interest using annual compounding.

    Args:
        principal: Initial investment amount in dollars.
        rate: Annual interest rate as decimal (e.g., 0.05 for 5%).
        years: Number of years for compounding.

    Returns:
        Final amount after compound interest.

    Raises:
        ValueError: If rate is negative or years is less than 1.
    """
```

---

## Expert Decision Frameworks

### 1. The Over-Documentation Paradox

**NEVER document every obvious one-liner** — it creates documentation noise:

- **Signal-to-noise collapse**: Readers learn to skip docstrings when 80% are trivial ("This returns x")
- **Maintenance burden**: Docstrings drift from code → confusion when they're outdated
- **Modern IDE reduction**: Type hints + IDE tooltips already show signatures; redundant descriptions waste tokens

**WHEN to document obvious code anyway**:

- Public API boundary (first-time users need anchoring, not just signature)
- Team composition: Will junior developers maintain this? They need detail
- Licensing/compliance: Documentation is contractual, not optional
- Open-source or vendor API: Users can't read implementation; assume nothing

---

### 2. Audience-Driven Documentation Philosophy

Documentation style depends on **who reads it**:

| Audience | Documentation Approach |
| --- | --- |
| **Library maintainers** | Minimal: API contract, edge cases, public behavior only |
| **New team members** | Detailed: Explain WHY, not just WHAT. Include intent. |
| **Open-source users** | Comprehensive: Assume nothing. Provide examples. |
| **Internal-only code** | Inline comments sufficient. Focus on complexity, not basics. |

---

### 3. Lifecycle-Driven Documentation Investment

How much to document depends on **code stability**:

| Stability | Documentation Level |
| --- | --- |
| **Stable API** (shipping for 6+ months) | Invest heavily: comprehensive docs + examples |
| **Experimental** (under design) | Lightweight: focus on intent, not stability |
| **Internal helper function** | Minimal: inline comments on WHY, not WHAT |
| **Deprecated** | Special: document migration path + alternative |

---

### 4. Type Hints vs. Docstring Parameters (Python 3.10+)

Modern Python makes many docstring details redundant:

```python
# ❌ WRONG: Args section repeats type info already in signature
def process_data(records: list[dict], timeout: int) -> bool:
    """Process data records.

    Args:
        records: A list of dictionaries containing records.  # <-- redundant!
        timeout: The timeout in seconds.                    # <-- redundant!
    """

# ✅ RIGHT: Args section explains WHY, not WHAT type
def process_data(records: list[dict], timeout: int) -> bool:
    """Process data records with automatic retry.

    Args:
        records: Customer transaction records; must have 'id' and 'amount' keys.
        timeout: Abort after this many seconds to prevent cascading API timeouts.
    """
```

**Rule**: If type hints fully express the constraint, explain the business reason instead.

---

### 5. When to Deviate from Google Style

Google Style is a **foundation, not dogma**. Deviate when:

- **Team standard differs**: Follow your team's convention (consistency > purity)
- **Language evolution**: Python 3.10+ allows more concise docs than 3.8
- **Context requires it**: An internal API doesn't need the rigor of a public library
- **Readability suffers**: If Google Style makes your docs harder to scan, adapt

**Never deviate** on:

- One-line summary (always first)
- Parameter/return/error documentation (critical for safety)
- Format consistency within a single file

---

## Reference Files (Load Based on Language)

### references/python_google_style.md

**Python code only** — Complete docstring standard:

- Module, class, function docstring formats
- Args, Returns, Raises, Yields sections
- Type hint integration & PEP 257 compliance
- Examples: from simple to complex algorithms
- Common mistakes & how to fix them

### references/go_google_style.md

**Go code only** — Complete comment standard:

- Package comment format & best practices
- Function comment template (action verb required)
- Type & interface comment patterns
- Error documentation (special Go requirement)
- godoc integration notes
- Examples: from simple to complex patterns

### references/terraform_style.md

**Terraform code only** — Complete description standard:

- Variable description format & validation
- Output description best practices
- Module documentation structure
- Inline comments for complex resources
- terraform-docs compatibility
- Examples: from simple to enterprise patterns

---

## Quality Standards (All Languages)

Before finalizing documentation:

- ✅ One-line summary is concise & action-oriented
- ✅ Grammar and punctuation are correct
- ✅ Language-specific formatting is consistent
- ✅ Complex functions include usage examples
- ✅ Parameters, returns, and errors/exceptions are documented
- ✅ Documentation can be maintained (won't quickly drift from code)

---

## What NOT to Do

- ❌ Generic placeholders ("This function does stuff") — users get nothing
- ❌ Redundant descriptions that mirror code ("This adds a and b" when signature is clear)
- ❌ Mixed formatting styles in the same file — confuses readers
- ❌ Outdated documentation (comment says X, code does Y) — worse than no docs
- ❌ Over-document trivial getters/setters unless they're public API boundaries
