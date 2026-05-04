# Skill Evaluation Report: httpie

## Summary

- **Total Score**: 90/120 (75%)
- **Grade**: C
- **Pattern**: Tool (decision trees, code examples, low freedom)
- **Knowledge Ratio**: E:A:R = 48:32:20
- **Verdict**: Solid tool skill with strong anti-pattern section but significant redundancy in basic explanations.

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 14 | 20 | Critical mistakes section is strong but diluted with redundant tutorial content |
| D2: Mindset vs Procedures | 11 | 15 | Good thinking framework but mixed with generic CLI guidance |
| D3: Anti-Pattern Quality | 13 | 15 | Strong NEVER list with specific reasoning |
| D4: Specification Compliance | 10 | 15 | Valid frontmatter but description vague on edge cases |
| D5: Progressive Disclosure | 10 | 15 | SKILL.md 295 lines acceptable for Tool pattern |
| D6: Freedom Calibration | 12 | 15 | Appropriate low freedom for CLI tool |
| D7: Pattern Recognition | 9 | 10 | Clear Tool pattern |
| D8: Practical Usability | 11 | 15 | Good examples but missing error handling decision tree |

## Critical Issues

1. Installation section (lines 11-24) wastes tokens - Claude knows basic pip/brew/apt
2. Request syntax section redundant - "METHOD optional" are basic CLI concepts
3. Request Items table is reference material not expert knowledge
4. Generic examples section - basic GET/POST not expert-level content
5. Description vague - "debug my 401 error" too simplistic

## Top 3 Improvements

1. Reduce installation to 2 lines - delete pip/brew/apt detailed instructions
2. Add error handling decision tree (401, 429, SSL, timeout scenarios)
3. Enhance description with specific trigger scenarios

---

_Evaluation Date: 2026-05-04_
