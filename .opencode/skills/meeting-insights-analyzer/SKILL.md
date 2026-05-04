---
name: meeting-insights-analyzer
description: "Analyzes meeting transcripts and recordings to uncover behavioral patterns, communication insights, and actionable feedback. Identifies when you avoid conflict, use filler words, dominate conversations, or miss opportunities to listen. Use when analyzing your own communication patterns across multiple meetings, preparing performance review examples with concrete behavioral evidence, coaching team members on communication style, or tracking improvement in specific areas like listening, conflict-handling, or facilitation skills. Requires: Meeting transcripts with speaker labels and timestamps (text, VTT, SRT, or DOCX format)."
---

# Meeting Insights Analyzer

This skill helps you understand your communication patterns through behavioral analysis of meeting transcripts. Unlike surface-level metrics, it emphasizes honest interpretation grounded in evidence, cultural context, and rigorous skepticism of your own assumptions.

## How to Analyze Behavior Honestly

The goal is not to judge yourself or others, but to see patterns with clarity. Good behavioral analysis:

- **Looks for multiple perspectives**: Before concluding "you avoid conflict," also consider "you're collaborative" or "you listen before responding"
- **Questions your assumptions**: Notice when you're drawn to conclusions that confirm what you already believe about yourself
- **Respects context**: Behavior changes by situation. Quiet in hierarchical meetings ≠ quiet person; quiet with peer friends = different signal
- **Tracks evidence rigorously**: Patterns need 3+ instances across 2+ meetings, not single memorable moments
- **Acknowledges medium limitations**: Text transcripts lose tone, pacing, and emotional intent. What reads harsh was spoken warmly

## NEVER Do When Analyzing

This list captures mistakes that are easy to make and hard to catch without explicit guidance:

**NEVER assume a single instance indicates a pattern** → One interruption doesn't mean you're domineering. Minimum 3+ occurrences across 2+ different meetings required before claiming a behavioral pattern.

**NEVER interpret speaking ratio without role context** → Meeting facilitators and leaders naturally speak 50-70% more than participants. Only compare speaking time to peers in similar roles. "You spoke 60%" means nothing without knowing if you were facilitating.

**NEVER confuse absence of behavior with its opposite** → No interruptions ≠ deference. No questions ≠ disengagement. Absence is information but doesn't indicate the opposite action.

**NEVER miss the transcript medium's distortion** → Transcripts strip tone, pause, hesitation, and emphasis. Blunt text may have been collaborative in tone. Uncertain speech reads as uncertain confidence. Sarcasm becomes literalism.

**NEVER attribute personality when situation explains behavior** → You avoid conflict in status-imbalanced meetings but not peer meetings = situational adaptation, not conflict-avoiding personality. Context drives behavior more than trait.

**NEVER misinterpret silence or reflective thinking** → Some people are reflective listeners who think before speaking. Silence ≠ disengagement. Measure engagement by what they do when they do speak.

**NEVER assume cultural or generational norms are individual traits** → "Like" is standard Gen Z speech; "actually" is normal in certain professional cultures; pausing is normal for non-native speakers. These aren't communication flaws.

**NEVER overgeneralize from limited data** → Three meetings in Q1 may not represent annual patterns. Holiday weeks, project crises, or seasonal staffing changes affect communication. Look for stability before claiming patterns.

**NEVER let confirmation bias shape your interpretation** → You already believe you avoid conflict? Your brain will find hedging language everywhere. You believe you're inclusive? You'll see evidence of it. Actively look for counterexamples.

## Loading References

Depending on what you're analyzing, load these references **selectively**:

**MANDATORY FIRST**: Read [`bias-mitigation.md`](references/bias-mitigation.md) before starting any analysis. It contains your framework for recognizing observer bias and staying honest.

**Then choose based on analysis type**:

- Analyzing conflict avoidance? → Load [`behavioral-patterns.md`](references/behavioral-patterns.md) – conflict section
- Measuring speaking patterns? → Load [`behavioral-patterns.md`](references/behavioral-patterns.md) – speaking-patterns section
- Evaluating leadership style? → Load [`behavioral-patterns.md`](references/behavioral-patterns.md) – leadership section
- Dealing with ambiguous or contradictory findings? → Load [`edge-cases.md`](references/edge-cases.md)
- Need detailed methodology? → Load [`frameworks.md`](references/frameworks.md)

Do NOT load all references at once. Load what you need for the specific analysis.

## Workflow: Analyze → Validate → Report

### 1. **Prepare**: Confirm Data Quality

Before analyzing, verify:

- [ ] Transcripts have speaker labels (if not, see edge-cases.md)
- [ ] Timestamps present (if not, note limitation)
- [ ] At least 2+ meetings for pattern claims
- [ ] Clear date/context for each meeting

### 2. **Observe**: Look for Specific Signals

For the behavior you're analyzing (from references/behavioral-patterns.md), identify:

- Exact timestamps and quotes
- Frequency count
- Context (meeting type, who was present, tension level)

### 3. **Validate**: Test Your Interpretation

Before reporting, ask:

- Do I have 3+ instances? Or just memorable moments?
- Could context explain this instead of personality?
- Am I looking for examples to prove what I already believe?
- What contradicts this pattern?

### 4. **Report**: Evidence First, Interpretation Second

Structure findings as:

```
Pattern: [Name]
Instances: X times across Y meetings
Examples: [Timestamp + quote + why it matters]
Interpretation: [What this might indicate, with caveats]
Counterexamples: [Times this pattern DIDN'T appear]
```

## Quick Reference: Key Behavioral Indicators

**Conflict Avoidance Signals** (load references/behavioral-patterns.md for details):

- Hedging: "maybe", "kind of", "I think", "potentially"
- Deflection: "whatever you think", "I'm open to anything"
- Subject changes when tension rises
- Agreeing without clarity on commitment

**Speaking Patterns** (load references/behavioral-patterns.md for details):

- Speaking percentage vs. role (facilitator vs. participant)
- Interruption frequency and patterns
- Question vs. statement ratio
- Turn-taking consistency

**Leadership Style** (load references/behavioral-patterns.md for details):

- Directive (telling) vs. collaborative (asking)
- How disagreement is handled
- Inclusion of quiet voices
- Clarity of follow-up and decisions

**Active Listening Indicators** (load references/behavioral-patterns.md for details):

- Building on others' ideas
- Paraphrasing to confirm understanding
- Asking clarifying questions
- References to others' previous points

## Examples: Analysis in Practice

### Example 1: Rigorous Pattern Discovery

**Request**: "Tell me when I avoid conflict in my meetings."

**What you DON'T do**: Scan transcripts, find one hedged statement, report "conflict avoidance detected."

**What you DO do**:

1. Read bias-mitigation.md to check: "Am I expecting to find conflict avoidance? Am I hunting for examples?"
2. Scan all transcripts and log EVERY instance of hedging language, deflection, or direct statements
3. Sort by date and context (1:1 vs team, high-stakes vs routine)
4. Identify patterns: "In 5 out of 7 salary discussion meetings, I used hedging language. But in peer planning meetings, I was direct."
5. Report: "Conflict avoidance appears contextual — occurs in hierarchical meetings with power imbalance, not peer meetings"

This is honest analysis: you didn't avoid conflict generally; you adapted your communication to perceived power dynamics.

### Example 2: Contradictory Patterns

**Finding**: "You interrupt frequently (7 interruptions in one meeting) but also ask a lot of questions (14 questions)."

**Naive interpretation**: "You're domineering but also curious."

**Better interpretation** (from edge-cases.md):

- Load edge-cases.md, Section: "What if patterns contradict?"
- Analyze timing: When do you interrupt? When do you ask questions?
- You interrupt during _your own_ explanations (incomplete thoughts) but ask questions during _others' explanations_ (information gathering)
- This isn't contradiction; it's different behaviors in different contexts
- Report: "You tend to think out loud, completing thoughts mid-explanation (7 self-interruptions). When others speak, you're deeply curious and ask for detail."

### Example 3: No Clear Patterns Emerge

**Situation**: You analyzed 4 meetings, looked for conflict avoidance, active listening, leadership style — found no standout patterns.

**What NOT to do**: Report "no findings" and stop.

**What to do** (from edge-cases.md):

- This is valid: absence of extreme patterns itself is information
- Look for POSITIVE patterns: moments of good listening, clear communication, collaborative problem-solving
- Report: "No conflict avoidance detected. Patterns observed: asks clarifying questions consistently, invites input from quiet participants, names disagreements directly"
- This is actually a strength profile, not a failure to find patterns

## Edge Cases: Handling Ambiguous Situations

See [`edge-cases.md`](references/edge-cases.md) for detailed guidance on:

- **No speaker labels**: Transcripts without clear speaker identification
  - Ask user for speaker context
  - Note analysis limitations in report
  - Fall back to team-level patterns only

- **Contradictory patterns**: Behavior that seems to pull in opposite directions
  - Investigate context and timing
  - Often indicates situational adaptation, not contradiction
  - Report the contextual variation, not the contradiction

- **Very long transcripts**: 10+ hour meetings or marathon sessions
  - Segment by topic or hour
  - Track fatigue/engagement changes over time
  - Note how late-meeting behavior differs from early-meeting

- **No clear patterns**: Analysis reveals stable, consistent communication
  - This is valuable: strength profile, not lack of findings
  - Report positive patterns observed
  - Avoid forcing conclusions

- **Minimal data**: Only 1-2 meetings available
  - Clearly note "insufficient data for pattern claims"
  - Offer specific observations from those meetings
  - Recommend collecting 2+ more meetings for pattern analysis
