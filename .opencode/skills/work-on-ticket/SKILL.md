---
name: work-on-ticket
description: Fetch Jira ticket details, create appropriately named git branch, and initiate task planning workflow for ticket-based work. Use when starting work on a specific Jira ticket: 'work on AGP-782', 'start PROJ-123', 'pick up AICC-456', 'begin [TICKET_ID]'. Handles git state verification, branch naming conventions, and error scenarios (uncommitted changes, existing branches, missing tickets).
---

# Work on Ticket

Streamlined workflow to start work on a Jira ticket by fetching ticket details, creating a branch, and initiating task planning.

## Ticket Assessment Framework: Before You Branch

Expert ticket work isn't mechanical (fetch → branch → plan). It requires critical thinking about scope, clarity, and readiness:

**Is the ticket well-scoped?**

- Does it have clear, testable acceptance criteria? If not, ask for clarification before branching.
- Can you articulate when this work is "done"? If unclear, the ticket is too vague.
- Are the requirements specific enough, or do they allow multiple interpretations? If ambiguous, clarify first.

**Should YOU work on this ticket?**

- Do you have all information needed, or does it depend on external clarification?
- Can you complete this without blocking on other tickets or dependencies?
- Is this actually one ticket or multiple pieces of work bundled together? If the latter, request a split.

**When to STOP and Ask for Clarity:**

- Ticket lacks acceptance criteria → STOP, request explicit definition of done
- Ticket seems to contain 2-3 different pieces of work → STOP, ask to split into multiple tickets
- You don't understand why this work matters → STOP, ask for business context
- Estimated effort looks larger than ticket scope suggests → STOP, negotiate scope or re-estimate
- Ticket description is vague or contradictory → STOP, ask for clarification

**Scope Safety Check:**

- If you can describe the ticket in 1-2 sentences, scope is probably clear ✓
- If it takes 3+ sentences or has conditionals ("If X, do Y"), scope is too wide or vague ⚠

## When to Use This Skill

Activate this skill when:

- The user says "work on AGP-123" or "start work on AGP-123"
- The user says "pick up AGP-123" or "begin AGP-123" or "start PROJ-456"
- The user mentions starting work on a specific Jira ticket ID: "work on AICC-789", "start TICKET_ID"
- Pattern: `work on [TICKET_ID]`, `start [TICKET_ID]`, `pick up [TICKET_ID]`, `begin [TICKET_ID]`, or similar intent

**NEVER Do This When Working on Tickets:**

- **NEVER accept an ambiguous ticket without asking for clarity** — Branching locks you into uncertainty. Clarify first.
- **NEVER skip reviewing acceptance criteria** — If the ticket has none, STOP and request them. You can't know when you're done.
- **NEVER combine multiple tickets into one branch** — One ticket = one branch. If work spans multiple logical pieces, request ticket split.
- **NEVER commit to hours without re-scoping** — If you discover the ticket is larger than estimated, renegotiate scope.
- **NEVER create massive PRs (>10 files, >500 lines)** — Large changes break reviewability. Split into smaller, logical units.
- **NEVER start work without understanding the _why_** — Business context matters. If missing, ask.
- **NEVER merge without manual testing confirmation** — Automated tests are necessary but not sufficient.

## Workflow

### 1. Parse Ticket ID

Extract the Jira ticket ID from the user's message. Common patterns:

- `work on AGP-782`
- `start AGP-782`
- `pick up PROJ-123`

Ticket ID format: `[A-Z]+-[0-9]+` (e.g., AGP-782, AICC-123)

### 2. Fetch Jira Ticket Details

Use the MCP Zapier tool to fetch the ticket:

```typescript
mcp__zapier -
  frontend__jira_software_cloud_find_issue_by_key({
    instructions: "Get details for ticket [TICKET_ID]",
    key: "[TICKET_ID]",
    fields: "summary,description,issuetype,priority,status"
  });
```

**Extract from response:**

- Summary (title)
- Description
- Issue type
- Status
- Any other relevant context

### 3. Generate Branch Name

Create a branch name using this format:

```
[TICKET_ID]-[kebab-case-summary]
```

**Branch Naming Rules:**

- Start with the ticket ID (e.g., `AGP-782-`)
- Convert summary to kebab-case (lowercase, dashes instead of spaces)
- Remove special characters
- Keep it concise (max 50 characters total)
- Use meaningful words from the summary

**Examples:**

- `AGP-782-migrate-existing-mcp-server`
- `AICC-123-fix-auth-token-expiry`
- `PROJ-456-add-user-settings-page`

**Implementation:**

```bash
# Convert summary to kebab-case
# Example: "Migrate existing MCP server" -> "migrate-existing-mcp-server"
```

### 4. Check Current Git State

Before creating a branch, check the current state:

```bash
# Check current branch
git branch --show-current

# Check for uncommitted changes
git status --porcelain
```

**If uncommitted changes exist:**

- STOP and inform User
- Suggest: "You have uncommitted changes. Should I commit them first, stash them, or continue anyway?"
- Wait for User's decision

**If not on staging/main:**

- STOP and inform User
- Suggest: "You're currently on branch [CURRENT_BRANCH]. Should I switch to staging first?"
- Wait for User's decision

### 5. Create Branch

Once it's safe to proceed:

```bash
# Ensure we're on the latest staging
git checkout staging
git pull origin staging

# Create and checkout new branch
git checkout -b [TICKET_ID]-[kebab-case-summary]
```

Confirm to User: "Created and checked out branch: [BRANCH_NAME]"

### 6. Build Task Planning Prompt

Analyze the Jira ticket and create a comprehensive prompt for the `/eng:chore` command:

**Prompt should include:**

- The ticket summary
- Key details from the description
- Any acceptance criteria mentioned
- Relevant technical context

**Example prompt construction:**

```
Summary: [ticket.summary]

Description: [ticket.description]

Acceptance Criteria:
[extracted criteria if present]
```

### 7. Execute Task Planning

Run the `/eng:chore` slash command with the ticket number and constructed prompt:

```bash
/eng:chore [TICKET_ID] [CONSTRUCTED_PROMPT]
```

**Example:**

```bash
AGP-782 Migrate existing MCP server implementation to new architecture

Description: We need to refactor the MCP server to use the new modular architecture. This includes updating the tool registry, migrating existing tools, and ensuring backward compatibility.

Acceptance Criteria:
- All existing tools work with new architecture
- Tests pass
- No breaking changes to API
```

## Error Handling

**If ticket not found:**

- Inform User: "Couldn't find ticket [TICKET_ID] in Jira. Please check the ticket ID."
- STOP - don't proceed with branch creation

**If branch already exists:**

- Inform User: "Branch [BRANCH_NAME] already exists."
- Ask: "Should I check it out, create a new branch with a different name, or stop?"
- Wait for decision

**If git operations fail:**

- Show the error to User
- STOP - don't proceed to task planning

**If Jira API is unreachable (network failure):**

- Inform User: "Cannot reach Jira API. Check your network connection and JIRA credentials."
- Suggest: "Try again when network is stable, or provide ticket details manually."
- STOP - don't proceed without ticket information

**If ticket summary contains invalid branch name characters:**

- Example: "Fix [Auth] Token Support" contains brackets
- Sanitize: Remove or replace invalid characters when converting to kebab-case
- Result: `TICKET_ID-fix-auth-token-support`
- Inform User: "Sanitized branch name to: [BRANCH_NAME]"
- Proceed if User approves

**If ticket is a sub-task or linked issue:**

- Inform User: "This is a sub-task of [PARENT_TICKET]. Should I work on the parent ticket instead?"
- Check for dependencies and relationships before branching
- Ask: "Are there blocking issues? Should I create a separate branch or wait?"
- Wait for decision

## Example Usage

### Example 1: Simple Ticket

**User:** "work on AGP-782"

**Claude:**

1. Fetches AGP-782 from Jira
2. Finds summary: "Migrate existing MCP server"
3. Checks git state (clean, on staging)
4. Creates branch: `AGP-782-migrate-existing-mcp-server`
5. Runs: `/eng:chore AGP-782 Migrate existing MCP server implementation...`

### Example 2: With Uncommitted Changes

**User:** "work on AICC-456"

**Claude:**

1. Fetches AICC-456 from Jira
2. Checks git state - finds uncommitted changes
3. **STOPS** and asks: "You have uncommitted changes. Should I commit them first, stash them, or continue anyway?"
4. Waits for User's decision

### Example 3: Ticket Not Found

**User:** "work on BAD-999"

**Claude:**

1. Tries to fetch BAD-999 from Jira
2. Ticket not found
3. Informs User: "Couldn't find ticket BAD-999 in Jira. Please check the ticket ID."
4. STOPS

### Example 4: Invalid Branch Name Characters

**User:** "work on API-123" **Ticket summary:** "Add [Auth] Bearer Token Support"

**Claude:**

1. Fetches API-123
2. Summary has brackets: "[Auth] Bearer Token Support"
3. Converts to kebab-case: "add-auth-bearer-token-support"
4. Branch: `API-123-add-auth-bearer-token-support` ✓
5. Asks: "Sanitized branch name to: API-123-add-auth-bearer-token-support. Proceed?"

### Example 5: Vague Ticket (Assessment Failure)

**User:** "work on PROJ-567" **Ticket summary:** "Improve system" **Description:** "Make the system better"

**Claude:**

1. Fetches PROJ-567
2. Assesses scope - description is vague with no acceptance criteria
3. **STOPS and asks:** "This ticket needs clarification. Can you provide:
   - What specific aspect of the system needs improvement?
   - What does 'better' mean (performance, UX, reliability)?
   - What are the acceptance criteria or definition of done?
4. Waits for User to clarify before creating branch

## Important Notes

- **Always check git state** before creating branches
- **Never force-create branches** or overwrite existing branches
- **Never proceed** if there are uncommitted changes without User's approval
- **Keep branch names concise** - aim for clarity over completeness
- **Include ticket context** in the task planning prompt to give the planner maximum context
- **The `/eng:chore` command** will handle the detailed planning - this skill just sets up the environment
- **Assess ticket quality first** - if the ticket is unclear, vague, or too broad, ask for clarification before branching

## Success Criteria

The skill is successful when:

1. ✅ Jira ticket is fetched successfully
2. ✅ Ticket is assessed for scope clarity and completeness (user confirmed or asked clarifying questions)
3. ✅ Appropriate branch name is generated
4. ✅ Git state is verified (no uncommitted changes or user approved)
5. ✅ New branch is created and checked out
6. ✅ `/eng:chore` command is executed with ticket context
7. ✅ User is informed of each major step
