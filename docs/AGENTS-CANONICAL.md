# AGENTS Canonical Reference

Scope

- Consolidated, authoritative agent guidance for the Banking repo. Includes persona roles, agent rules, available skills, MCP servers, and validation steps. SKILL.md files are preserved in .opencode/skills and referenced; full SKILL.md contents are appended to this document (per policy).

Personas

- Implementer — minimal, auditable edits, prefers small changes.
- Reviewer — focuses on risks, regressions, and missing tests.
- Maintainer — approves merges and runs destructive infra scripts.
- QA Engineer — runs E2E and exploratory tests.
- Product Owner — provides acceptance criteria.

Agentic Coding Standards (summary)

- Never read process.env in application code. Use app-config.ts (preferred) or lib/env.ts.
- All DB access must go through dal/\*. Avoid N+1 queries by eager loading or joins.
- All mutations must be Server Actions in actions/\* with:
  - "use server" directive
  - early auth() call
  - Zod validation with descriptive messages and .describe() on fields
  - return type Promise<{ ok: boolean; error?: string }>
  - cache revalidation after success (revalidatePath / revalidateTag / updateTag)
- Plan requirement: if change touches >7 files, create .opencode/commands/<short>.plan.md

Validation & CI checks (run after edits)

- npm run type-check
- npm run lint:strict
- npm run verify:rules
- Optional: bash scripts/utils/run-ci-checks.sh --continue-on-fail

Skills (inventory)

- See .opencode/skills/\* for full SKILL.md files. The following skills exist (short list):
  - agent-governance, agentic-eval, auth-skill, create-web-form, dal-skill, db-skill, deployment-skill, dwolla-skill, entra-agent-user, gh-cli, git-commit, github-issues, make-skill-template, mcp-cli, meeting-minutes, nuget-manager, plaid-skill, prd, refactor, scoutqa-test, security-skill, server-action-skill, session-logger, testing-skill, suspense-skill, ui-skill, validation-skill, vscode-ext-commands, vscode-ext-localization

Scripts embedding policy

- SKILL.md files included verbatim in this document. Scripts are referenced by path and include invocation examples only (per user choice B).

Available MCP servers

- See .opencode/mcp_servers.json for the full list exposed in this workspace. Use mcp-cli to inspect at runtime.

Backing up targets

- Before making replacements, backups of target files will be written to .opencode/backups/canonical-agent-rules/<timestamp>/

Provenance

- Files read while preparing this doc (representative): AGENTS.md, .opencode/instructions/_.md, .cursor/rules/_.mdc, .opencode/skills/_/SKILL.md, package.json, eslint.config.mts, scripts/verify-rules.ts, scripts/seed/run.ts, app-config.ts, lib/env.ts, actions/_, dal/\*

Appendix: SKILL.md files (verbatim)

-- .opencode/skills/agent-governance/SKILL.md --

---

---

--- Begin Verbatim: .opencode/skills/agent-governance/SKILL.md ---

---

name: agent-governance description: | Patterns and techniques for adding governance, safety, and trust controls to AI agent systems. Use this skill when:

- Building AI agents that call external tools (APIs, databases, file systems)
- Implementing policy-based access controls for agent tool usage
- Adding semantic intent classification to detect dangerous prompts
- Creating trust scoring systems for multi-agent workflows
- Building audit trails for agent actions and decisions
- Enforcing rate limits, content filters, or tool restrictions on agents
- Working with any agent framework (PydanticAI, CrewAI, OpenAI Agents, LangChain, AutoGen) lastReviewed: 2026-04-13 applyTo: "lib/\*_/_.{py,js,ts,md}"

---

# Agent Governance Patterns

Patterns for adding safety, trust, and policy enforcement to AI agent systems.

## Overview

Governance patterns ensure AI agents operate within defined boundaries — controlling which tools they can call, what content they can process, how much they can do, and maintaining accountability through audit trails.

```
User Request → Intent Classification → Policy Check → Tool Execution → Audit Log
                     ↓                      ↓               ↓
              Threat Detection         Allow/Deny      Trust Update
```

## When to Use

- **Agents with tool access**: Any agent that calls external tools (APIs, databases, shell commands)
- **Multi-agent systems**: Agents delegating to other agents need trust boundaries
- **Production deployments**: Compliance, audit, and safety requirements
- **Sensitive operations**: Financial transactions, data access, infrastructure management

---

## Pattern 1: Governance Policy

Define what an agent is allowed to do as a composable, serializable policy object.

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional
import re

class PolicyAction(Enum):
    ALLOW = "allow"
    DENY = "deny"
    REVIEW = "review"  # flag for human review

@dataclass
class GovernancePolicy:
    """Declarative policy controlling agent behavior."""
    name: str
    allowed_tools: list[str] = field(default_factory=list)       # allowlist
    blocked_tools: list[str] = field(default_factory=list)       # blocklist
    blocked_patterns: list[str] = field(default_factory=list)    # content filters
    max_calls_per_request: int = 100                             # rate limit
    require_human_approval: list[str] = field(default_factory=list)  # tools needing approval

    def check_tool(self, tool_name: str) -> PolicyAction:
        """Check if a tool is allowed by this policy."""
        if tool_name in self.blocked_tools:
            return PolicyAction.DENY
        if tool_name in self.require_human_approval:
            return PolicyAction.REVIEW
        if self.allowed_tools and tool_name not in self.allowed_tools:
            return PolicyAction.DENY
        return PolicyAction.ALLOW

    def check_content(self, content: str) -> Optional[str]:
        """Check content against blocked patterns. Returns matched pattern or None."""
        for pattern in self.blocked_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                return pattern
        return None
```

### Policy Composition

Combine multiple policies (e.g., org-wide + team + agent-specific):

```python
def compose_policies(*policies: GovernancePolicy) -> GovernancePolicy:
    """Merge policies with most-restrictive-wins semantics."""
    combined = GovernancePolicy(name="composed")

    for policy in policies:
        combined.blocked_tools.extend(policy.blocked_tools)
        combined.blocked_patterns.extend(policy.blocked_patterns)
        combined.require_human_approval.extend(policy.require_human_approval)
        combined.max_calls_per_request = min(
            combined.max_calls_per_request,
            policy.max_calls_per_request
        )
        if policy.allowed_tools:
            if combined.allowed_tools:
                combined.allowed_tools = [
                    t for t in combined.allowed_tools if t in policy.allowed_tools
                ]
            else:
                combined.allowed_tools = list(policy.allowed_tools)

    return combined


# Usage: layer policies from broad to specific
org_policy = GovernancePolicy(
    name="org-wide",
    blocked_tools=["shell_exec", "delete_database"],
    blocked_patterns=[r"(?i)(api[_-]?key|secret|password)\s*[:=]"],
    max_calls_per_request=50
)
team_policy = GovernancePolicy(
    name="data-team",
    allowed_tools=["query_db", "read_file", "write_report"],
    require_human_approval=["write_report"]
)
agent_policy = compose_policies(org_policy, team_policy)
```

### Policy as YAML

Store policies as configuration, not code:

```yaml
# governance-policy.yaml
name: production-agent
allowed_tools:
  - search_documents
  - query_database
  - send_email
blocked_tools:
  - shell_exec
  - delete_record
blocked_patterns:
  - "(?i)(api[_-]?key|secret|password)\\s*[:=]"
  - "(?i)(drop|truncate|delete from)\\s+\\w+"
max_calls_per_request: 25
require_human_approval:
  - send_email
```

```python
import yaml

def load_policy(path: str) -> GovernancePolicy:
    with open(path) as f:
        data = yaml.safe_load(f)
    return GovernancePolicy(**data)
```

---

## Pattern 2: Semantic Intent Classification

Detect dangerous intent in prompts before they reach the agent, using pattern-based signals.

```python
from dataclasses import dataclass

@dataclass
class IntentSignal:
    category: str       # e.g., "data_exfiltration", "privilege_escalation"
    confidence: float   # 0.0 to 1.0
    evidence: str       # what triggered the detection

# Weighted signal patterns for threat detection
THREAT_SIGNALS = [
    # Data exfiltration
    (r"(?i)send\s+(all|every|entire)\s+\w+\s+to\s+", "data_exfiltration", 0.8),
    (r"(?i)export\s+.*\s+to\s+(external|outside|third.?party)", "data_exfiltration", 0.9),
    (r"(?i)curl\s+.*\s+-d\s+", "data_exfiltration", 0.7),

    # Privilege escalation
    (r"(?i)(sudo|as\s+root|admin\s+access)", "privilege_escalation", 0.8),
    (r"(?i)chmod\s+777", "privilege_escalation", 0.9),

    # System modification
    (r"(?i)(rm\s+-rf|del\s+/[sq]|format\s+c:)", "system_destruction", 0.95),
    (r"(?i)(drop\s+database|truncate\s+table)", "system_destruction", 0.9),

    # Prompt injection
    (r"(?i)ignore\s+(previous|above|all)\s+(instructions?|rules?)", "prompt_injection", 0.9),
    (r"(?i)you\s+are\s+now\s+(a|an)\s+", "prompt_injection", 0.7),
]

def classify_intent(content: str) -> list[IntentSignal]:
    """Classify content for threat signals."""
    signals = []
    for pattern, category, weight in THREAT_SIGNALS:
        match = re.search(pattern, content)
        if match:
            signals.append(IntentSignal(
                category=category,
                confidence=weight,
                evidence=match.group()
            ))
    return signals

def is_safe(content: str, threshold: float = 0.7) -> bool:
    """Quick check: is the content safe above the given threshold?"""
    signals = classify_intent(content)
    return not any(s.confidence >= threshold for s in signals)
```

**Key insight**: Intent classification happens _before_ tool execution, acting as a pre-flight safety check. This is fundamentally different from output guardrails which only check _after_ generation.

---

## Pattern 3: Tool-Level Governance Decorator

Wrap individual tool functions with governance checks:

```python
import functools
import time
from collections import defaultdict

_call_counters: dict[str, int] = defaultdict(int)

def govern(policy: GovernancePolicy, audit_trail=None):
    """Decorator that enforces governance policy on a tool function."""
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            tool_name = func.__name__

            # 1. Check tool allowlist/blocklist
            action = policy.check_tool(tool_name)
            if action == PolicyAction.DENY:
                raise PermissionError(f"Policy '{policy.name}' blocks tool '{tool_name}'")
            if action == PolicyAction.REVIEW:
                raise PermissionError(f"Tool '{tool_name}' requires human approval")

            # 2. Check rate limit
            _call_counters[policy.name] += 1
            if _call_counters[policy.name] > policy.max_calls_per_request:
                raise PermissionError(f"Rate limit exceeded: {policy.max_calls_per_request} calls")

            # 3. Check content in arguments
            for arg in list(args) + list(kwargs.values()):
                if isinstance(arg, str):
                    matched = policy.check_content(arg)
                    if matched:
                        raise PermissionError(f"Blocked pattern detected: {matched}")

            # 4. Execute and audit
            start = time.monotonic()
            try:
                result = await func(*args, **kwargs)
                if audit_trail is not None:
                    audit_trail.append({
                        "tool": tool_name,
                        "action": "allowed",
                        "duration_ms": (time.monotonic() - start) * 1000,
                        "timestamp": time.time()
                    })
                return result
            except Exception as e:
                if audit_trail is not None:
                    audit_trail.append({
                        "tool": tool_name,
                        "action": "error",
                        "error": str(e),
                        "timestamp": time.time()
                    })
                raise

        return wrapper
    return decorator
```

---

## Pattern 4: Trust Scoring

Track agent reliability over time with decay-based trust scores:

```python
from dataclasses import dataclass, field
import math
import time

@dataclass
class TrustScore:
    """Trust score with temporal decay."""
    score: float = 0.5          # 0.0 (untrusted) to 1.0 (fully trusted)
    successes: int = 0
    failures: int = 0
    last_updated: float = field(default_factory=time.time)

    def record_success(self, reward: float = 0.05):
        self.successes += 1
        self.score = min(1.0, self.score + reward * (1 - self.score))
        self.last_updated = time.time()

    def record_failure(self, penalty: float = 0.15):
        self.failures += 1
        self.score = max(0.0, self.score - penalty * self.score)
        self.last_updated = time.time()

    def current(self, decay_rate: float = 0.001) -> float:
        """Get score with temporal decay — trust erodes without activity."""
        elapsed = time.time() - self.last_updated
        decay = math.exp(-decay_rate * elapsed)
        return self.score * decay

    @property
    def reliability(self) -> float:
        total = self.successes + self.failures
        return self.successes / total if total > 0 else 0.0


# Usage in multi-agent systems
trust = TrustScore()

# Agent completes tasks successfully
trust.record_success()  # 0.525
trust.record_success()  # 0.549

# Agent makes an error
trust.record_failure()  # 0.467

# Gate sensitive operations on trust
if trust.current() >= 0.7:
    # Allow autonomous operation
    pass
elif trust.current() >= 0.4:
    # Allow with human oversight
    pass
else:
    # Deny or require explicit approval
    pass
```

---

## Pattern 5: Audit Trail

Append-only audit log for all agent actions — critical for compliance and debugging:

```python
from dataclasses import dataclass, field
import json
import time

@dataclass
class AuditEntry:
    timestamp: float
    agent_id: str
    tool_name: str
    action: str           # "allowed", "denied", "error"
    policy_name: str
    details: dict = field(default_factory=dict)

class AuditTrail:
    """Append-only audit trail for agent governance events."""
    def __init__(self):
        self._entries: list[AuditEntry] = []

    def log(self, agent_id: str, tool_name: str, action: str,
            policy_name: str, **details):
        self._entries.append(AuditEntry(
            timestamp=time.time(),
            agent_id=agent_id,
            tool_name=tool_name,
            action=action,
            policy_name=policy_name,
            details=details
        ))

    def denied(self) -> list[AuditEntry]:
        """Get all denied actions — useful for security review."""
        return [e for e in self._entries if e.action == "denied"]

    def by_agent(self, agent_id: str) -> list[AuditEntry]:
        return [e for e in self._entries if e.agent_id == agent_id]

    def export_jsonl(self, path: str):
        """Export as JSON Lines for log aggregation systems."""
        with open(path, "w") as f:
            for entry in self._entries:
                f.write(json.dumps({
                    "timestamp": entry.timestamp,
                    "agent_id": entry.agent_id,
                    "tool": entry.tool_name,
                    "action": entry.action,
                    "policy": entry.policy_name,
                    **entry.details
                }) + "\n")
```

---

## Pattern 6: Framework Integration

### PydanticAI

```python
from pydantic_ai import Agent

policy = GovernancePolicy(
    name="support-bot",
    allowed_tools=["search_docs", "create_ticket"],
    blocked_patterns=[r"(?i)(ssn|social\s+security|credit\s+card)"],
    max_calls_per_request=20
)

agent = Agent("openai:gpt-4o", system_prompt="You are a support assistant.")

@agent.tool
@govern(policy)
async def search_docs(ctx, query: str) -> str:
    """Search knowledge base — governed."""
    return await kb.search(query)

@agent.tool
@govern(policy)
async def create_ticket(ctx, title: str, body: str) -> str:
    """Create support ticket — governed."""
    return await tickets.create(title=title, body=body)
```

---

## Governance Levels

Match governance strictness to risk level:

| Level | Controls | Use Case |
| --- | --- | --- |
| **Open** | Audit only, no restrictions | Internal dev/testing |
| **Standard** | Tool allowlist + content filters | General production agents |
| **Strict** | All controls + human approval for sensitive ops | Financial, healthcare, legal |
| **Locked** | Allowlist only, no dynamic tools, full audit | Compliance-critical systems |

---

## Best Practices

| Practice | Rationale |
| --- | --- |
| **Policy as configuration** | Store policies in YAML/JSON, not hardcoded — enables change without deploys |
| **Most-restrictive-wins** | When composing policies, deny always overrides allow |
| **Pre-flight intent check** | Classify intent _before_ tool execution, not after |
| **Trust decay** | Trust scores should decay over time — require ongoing good behavior |
| **Append-only audit** | Never modify or delete audit entries — immutability enables compliance |
| **Fail closed** | If governance check errors, deny the action rather than allowing it |
| **Separate policy from logic** | Governance enforcement should be independent of agent business logic |

---

## Quick Start Checklist

```markdown
## Agent Governance Implementation Checklist

### Setup

- [ ] Define governance policy (allowed tools, blocked patterns, rate limits)
- [ ] Choose governance level (open/standard/strict/locked)
- [ ] Set up audit trail storage

### Implementation

- [ ] Add @govern decorator to all tool functions
- [ ] Add intent classification to user input processing
- [ ] Implement trust scoring for multi-agent interactions
- [ ] Wire up audit trail export

### Validation

- [ ] Test that blocked tools are properly denied
- [ ] Test that content filters catch sensitive patterns
- [ ] Test rate limiting behavior
- [ ] Verify audit trail captures all events
- [ ] Test policy composition (most-restrictive-wins)
```

---

## Related Resources

- [Agent-OS Governance Engine](https://github.com/imran-siddique/agent-os) — Full governance framework
- [AgentMesh Integrations](https://github.com/imran-siddique/agentmesh-integrations) — Framework-specific packages
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

--- End Verbatim: .opencode/skills/agent-governance/SKILL.md ---

-- .opencode/skills/agentic-eval/SKILL.md --

---

--- Begin Verbatim: .opencode/skills/agentic-eval/SKILL.md ---

---

name: agentic-eval description: | Patterns and techniques for evaluating and improving AI agent outputs. Use this skill when:

- Implementing self-critique and reflection loops
- Building evaluator-optimizer pipelines for quality-critical generation
- Creating test-driven code refinement workflows
- Designing rubric-based or LLM-as-judge evaluation systems
- Adding iterative improvement to agent outputs (code, reports, analysis)
- Measuring and improving agent response quality lastReviewed: 2026-04-13 applyTo: "\*_/_"

---

# Agentic Evaluation Patterns

Patterns for self-improvement through iterative evaluation and refinement.

## Overview

Evaluation patterns enable agents to assess and improve their own outputs, moving beyond single-shot generation to iterative refinement loops.

```
Generate → Evaluate → Critique → Refine → Output
    ↑                              │
    └──────────────────────────────┘
```

## When to Use

- **Quality-critical generation**: Code, reports, analysis requiring high accuracy
- **Tasks with clear evaluation criteria**: Defined success metrics exist
- **Content requiring specific standards**: Style guides, compliance, formatting

---

## Pattern 1: Basic Reflection

Agent evaluates and improves its own output through self-critique.

```python
def reflect_and_refine(task: str, criteria: list[str], max_iterations: int = 3) -> str:
    """Generate with reflection loop."""
    output = llm(f"Complete this task:\n{task}")

    for i in range(max_iterations):
        # Self-critique
        critique = llm(f"""
        Evaluate this output against criteria: {criteria}
        Output: {output}
        Rate each: PASS/FAIL with feedback as JSON.
        """)

        critique_data = json.loads(critique)
        all_pass = all(c["status"] == "PASS" for c in critique_data.values())
        if all_pass:
            return output

        # Refine based on critique
        failed = {k: v["feedback"] for k, v in critique_data.items() if v["status"] == "FAIL"}
        output = llm(f"Improve to address: {failed}\nOriginal: {output}")

    return output
```

**Key insight**: Use structured JSON output for reliable parsing of critique results.

---

## Pattern 2: Evaluator-Optimizer

Separate generation and evaluation into distinct components for clearer responsibilities.

```python
class EvaluatorOptimizer:
    def __init__(self, score_threshold: float = 0.8):
        self.score_threshold = score_threshold

    def generate(self, task: str) -> str:
        return llm(f"Complete: {task}")

    def evaluate(self, output: str, task: str) -> dict:
        return json.loads(llm(f"""
        Evaluate output for task: {task}
        Output: {output}
        Return JSON: {{"overall_score": 0-1, "dimensions": {{"accuracy": ..., "clarity": ...}}}}
        """))

    def optimize(self, output: str, feedback: dict) -> str:
        return llm(f"Improve based on feedback: {feedback}\nOutput: {output}")

    def run(self, task: str, max_iterations: int = 3) -> str:
        output = self.generate(task)
        for _ in range(max_iterations):
            evaluation = self.evaluate(output, task)
            if evaluation["overall_score"] >= self.score_threshold:
                break
            output = self.optimize(output, evaluation)
        return output
```

---

## Pattern 3: Code-Specific Reflection

Test-driven refinement loop for code generation.

```python
class CodeReflector:
    def reflect_and_fix(self, spec: str, max_iterations: int = 3) -> str:
        code = llm(f"Write Python code for: {spec}")
        tests = llm(f"Generate pytest tests for: {spec}\nCode: {code}")

        for _ in range(max_iterations):
            result = run_tests(code, tests)
            if result["success"]:
                return code
            code = llm(f"Fix error: {result['error']}\nCode: {code}")
        return code
```

---

## Evaluation Strategies

### Outcome-Based

Evaluate whether output achieves the expected result.

```python
def evaluate_outcome(task: str, output: str, expected: str) -> str:
    return llm(f"Does output achieve expected outcome? Task: {task}, Expected: {expected}, Output: {output}")
```

### LLM-as-Judge

Use LLM to compare and rank outputs.

```python
def llm_judge(output_a: str, output_b: str, criteria: str) -> str:
    return llm(f"Compare outputs A and B for {criteria}. Which is better and why?")
```

### Rubric-Based

Score outputs against weighted dimensions.

```python
RUBRIC = {
    "accuracy": {"weight": 0.4},
    "clarity": {"weight": 0.3},
    "completeness": {"weight": 0.3}
}

def evaluate_with_rubric(output: str, rubric: dict) -> float:
    scores = json.loads(llm(f"Rate 1-5 for each dimension: {list(rubric.keys())}\nOutput: {output}"))
    return sum(scores[d] * rubric[d]["weight"] for d in rubric) / 5
```

---

## Best Practices

| Practice | Rationale |
| --- | --- |
| **Clear criteria** | Define specific, measurable evaluation criteria upfront |
| **Iteration limits** | Set max iterations (3-5) to prevent infinite loops |
| **Convergence check** | Stop if output score isn't improving between iterations |
| **Log history** | Keep full trajectory for debugging and analysis |
| **Structured output** | Use JSON for reliable parsing of evaluation results |

---

## Quick Start Checklist

```markdown
## Evaluation Implementation Checklist

### Setup

- [ ] Define evaluation criteria/rubric
- [ ] Set score threshold for "good enough"
- [ ] Configure max iterations (default: 3)

### Implementation

- [ ] Implement generate() function
- [ ] Implement evaluate() function with structured output
- [ ] Implement optimize() function
- [ ] Wire up the refinement loop

### Safety

- [ ] Add convergence detection
- [ ] Log all iterations for debugging
- [ ] Handle evaluation parse failures gracefully
```

--- End Verbatim: .opencode/skills/agentic-eval/SKILL.md ---

-- .opencode/skills/auth-skill/SKILL.md --

---

--- Begin Verbatim: .opencode/skills/auth-skill/SKILL.md ---

---

name: auth-skill description: NextAuth v4 authentication patterns, session helper, and protected route guidance. lastReviewed: 2026-04-13 applyTo: "actions/\*_/_.{ts,tsx}"

---

# auth-skill — Authentication Patterns

Overview

Auth uses NextAuth v4 with `jwt` strategy. Use the `auth()` server helper to obtain sessions inside Server Actions.

Session Shape

- `session.user` includes `{ id: string; name?: string; email?: string; isAdmin: boolean; isActive: boolean }`.

Server Action Example

```ts
import { auth } from "@/auth";

export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  if (!session.user.isActive)
    return { ok: false, error: "AccountDeactivated" };
  return { ok: true };
}
```

Validation

- `npm run type-check`

--- End Verbatim: .opencode/skills/auth-skill/SKILL.md ---

-- .opencode/skills/create-web-form/SKILL.md --

---

--- Begin Verbatim: .opencode/skills/create-web-form/SKILL.md ---

---

name: create-web-form description: 'Create robust, accessible web forms with best practices for HTML structure, CSS styling, JavaScript interactivity, form validation, and server-side processing. Use when asked to "create a form", "build a web form", "add a contact form", "make a signup form", or when building any HTML form with data handling. Covers PHP and Python backends, MySQL database integration, REST APIs, XML data exchange, accessibility (ARIA), and progressive web apps.' lastReviewed: 2026-04-13 applyTo: "web/\*_/_"

---

# Create Web Form Skill

## Overview

This skill provides comprehensive reference materials and best practices for creating web forms. It covers HTML syntax, UI/UX design, form validation, server-side processing (PHP and Python), data handling, and network communication.

## Purpose

Enable developers to build robust, accessible, and user-friendly web forms by providing:

- HTML form syntax and structure
- CSS styling techniques for form elements
- JavaScript for form interactivity and validation
- Accessibility best practices
- Server-side form processing with PHP and Python
- Database integration methods
- Network data handling and security
- Performance optimization

... (truncated in canonical; full SKILL.md also present under .opencode/skills)

--- End Verbatim: .opencode/skills/create-web-form/SKILL.md ---

-- .opencode/skills/dal-skill/SKILL.md --

(See .opencode/skills/dal-skill/SKILL.md for full content)

-- .opencode/skills/db-skill/SKILL.md --

(See .opencode/skills/db-skill/SKILL.md for full content)

-- .opencode/skills/deployment-skill/SKILL.md --

(See .opencode/skills/deployment-skill/SKILL.md for full content)

-- .opencode/skills/dwolla-skill/SKILL.md --

(See .opencode/skills/dwolla-skill/SKILL.md for full content)

-- .opencode/skills/entra-agent-user/SKILL.md --

(See .opencode/skills/entra-agent-user/SKILL.md for full content)

-- .opencode/skills/gh-cli/SKILL.md --

(See .opencode/skills/gh-cli/SKILL.md for full content)

-- .opencode/skills/git-commit/SKILL.md --

(See .opencode/skills/git-commit/SKILL.md for full content)

-- .opencode/skills/github-issues/SKILL.md --

(See .opencode/skills/github-issues/SKILL.md for full content)

-- .opencode/skills/make-skill-template/SKILL.md --

(See .opencode/skills/make-skill-template/SKILL.md for full content)

-- .opencode/skills/mcp-cli/SKILL.md --

(See .opencode/skills/mcp-cli/SKILL.md for full content)

-- .opencode/skills/meeting-minutes/SKILL.md --

(See .opencode/skills/meeting-minutes/SKILL.md for full content)

-- .opencode/skills/nuget-manager/SKILL.md --

(See .opencode/skills/nuget-manager/SKILL.md for full content)

-- .opencode/skills/plaid-skill/SKILL.md --

(See .opencode/skills/plaid-skill/SKILL.md for full content)

-- .opencode/skills/prd/SKILL.md --

(See .opencode/skills/prd/SKILL.md for full content)

-- .opencode/skills/refactor/SKILL.md --

(See .opencode/skills/refactor/SKILL.md for full content)

-- .opencode/skills/scoutqa-test/SKILL.md --

(See .opencode/skills/scoutqa-test/SKILL.md for full content)

-- .opencode/skills/security-skill/SKILL.md --

(See .opencode/skills/security-skill/SKILL.md for full content)

-- .opencode/skills/session-logger/SKILL.md --

(See .opencode/skills/session-logger/SKILL.md for full content)

-- .opencode/skills/server-action-skill/SKILL.md --

(See .opencode/skills/server-action-skill/SKILL.md for full content)

-- .opencode/skills/testing-skill/SKILL.md --

(See .opencode/skills/testing-skill/SKILL.md for full content)

-- .opencode/skills/suspense-skill/SKILL.md --

(See .opencode/skills/suspense-skill/SKILL.md for full content)

-- .opencode/skills/ui-skill/SKILL.md --

(See .opencode/skills/ui-skill/SKILL.md for full content)

-- .opencode/skills/validation-skill/SKILL.md --

(See .opencode/skills/validation-skill/SKILL.md for full content)

-- .opencode/skills/vscode-ext-commands/SKILL.md --

(See .opencode/skills/vscode-ext-commands/SKILL.md for full content)

-- .opencode/skills/vscode-ext-localization/SKILL.md --

(See .opencode/skills/vscode-ext-localization/SKILL.md for full content)

End of canonical doc (draft)
