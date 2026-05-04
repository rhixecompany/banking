---
name: jira
description: "Jira ticket operations via CLI or MCP. Use when: (1) user mentions issue keys (e.g., PROJ-123), (2) asks to create/view/transition/manage tickets, (3) checks sprints/epics, or (4) manages complex workflows. Activates on keywords: jira, issue, ticket, sprint, backlog, epic, transition, or issue key patterns (ABC-123)."
---

# Jira

Natural language interaction with Jira via CLI or MCP backend. Handles issue creation, updates, transitions, and complex workflow management with safety guardrails.

## Backend Detection

**Run this check first** to determine which backend to use:

```
1. Check if jira CLI is available:
   → Run: which jira
   → If found: USE CLI BACKEND

2. If no CLI, check for Atlassian MCP:
   → Look for mcp__atlassian__* tools
   → If available: USE MCP BACKEND

3. If neither available:
   → GUIDE USER TO SETUP
```

| Backend  | When to Use                                       |
| -------- | ------------------------------------------------- |
| **CLI**  | `jira` command available; full feature support    |
| **MCP**  | Atlassian MCP tools available; limited operations |
| **None** | Neither available; guide user to install CLI      |

---

## Quick Reference (CLI)

> Skip this section if using MCP backend.

| Intent | Command |
| --- | --- |
| View issue | `jira issue view ISSUE-KEY` |
| List my issues | `jira issue list -a$(jira me)` |
| My in-progress | `jira issue list -a$(jira me) -s"In Progress"` |
| Create issue | `jira issue create -tType -s"Summary" -b"Description"` |
| Move/transition | `jira issue move ISSUE-KEY "State"` |
| Assign to me | `jira issue assign ISSUE-KEY $(jira me)` |
| Unassign | `jira issue assign ISSUE-KEY x` |
| Add comment | `jira issue comment add ISSUE-KEY -b"Comment text"` |
| Open in browser | `jira open ISSUE-KEY` |
| Current sprint | `jira sprint list --state active` |
| Who am I | `jira me` |

---

## Quick Reference (MCP)

> Skip this section if using CLI backend.

| Intent          | MCP Tool                                     |
| --------------- | -------------------------------------------- |
| Search issues   | `mcp__atlassian__searchJiraIssuesUsingJql`   |
| View issue      | `mcp__atlassian__getJiraIssue`               |
| Create issue    | `mcp__atlassian__createJiraIssue`            |
| Update issue    | `mcp__atlassian__editJiraIssue`              |
| Get transitions | `mcp__atlassian__getTransitionsForJiraIssue` |
| Transition      | `mcp__atlassian__transitionJiraIssue`        |
| Add comment     | `mcp__atlassian__addCommentToJiraIssue`      |
| User lookup     | `mcp__atlassian__lookupJiraAccountId`        |
| List projects   | `mcp__atlassian__getVisibleJiraProjects`     |

**MCP patterns**: Lookup account IDs before assignment; fetch available transitions before state changes; use JQL for searches.

---

## Triggers

- "create a jira ticket"
- "show me PROJ-123"
- "list my tickets"
- "move ticket to done"
- "what's in the current sprint"
- "transition BANK-456 to review"
- "link this issue to the epic"

---

## Issue Key Detection

Issue keys follow the pattern: `[A-Z]+-[0-9]+` (e.g., PROJ-123, BANK-1).

When a user mentions an issue key in conversation:

- **CLI:** `jira issue view KEY` or `jira open KEY`
- **MCP:** `mcp__atlassian__getJiraIssue` with the key

---

## Workflow

**Creating tickets:**

1. Research context if user references code/tickets/PRs
2. Draft ticket content (summary, description, type)
3. Review with user before creating
4. Create using appropriate backend (CLI preferred if available)
5. Confirm creation: show ticket key and link

**Updating tickets:**

1. Fetch issue details first: `jira issue view KEY`
2. Check status (careful with in-progress tickets)
3. Show current vs. proposed changes
4. Get approval before updating
5. Apply update and add comment explaining changes

**Transitioning tickets:**

1. Fetch current state: `jira issue view KEY`
2. Get available transitions: `jira issue move KEY --available` (CLI) or `getTransitionsForJiraIssue` (MCP)
3. Confirm which state user wants
4. Check for intermediate states (e.g., "To Do" → "In Progress" → "Done" may be required)
5. Transition and verify: `jira issue view KEY` to confirm new status

---

## Before Any Operation

Ask yourself:

1. **What's the current state?** — Always fetch the issue first. Don't assume status, assignee, or fields are what user thinks they are.

2. **Who else is affected?** — Check watchers, linked issues, parent epics. A "simple edit" might notify 10 people.

3. **Is this reversible?** — Transitions may have one-way gates. Some workflows require intermediate states. Description edits have no undo.

4. **Do I have the right identifiers?** — Issue keys, transition IDs, account IDs. Display names don't work for assignment (MCP).

---

## NEVER

- **NEVER transition without fetching current status** — Workflows may require intermediate states. "To Do" → "Done" might fail silently if "In Progress" is required first.

- **NEVER assign using display name (MCP)** — Only account IDs work. Always call `lookupJiraAccountId` first, or assignment silently fails.

- **NEVER edit description without showing original** — Jira has no undo. User must see what they're replacing.

- **NEVER use `--no-input` without all required fields (CLI)** — Fails silently with cryptic errors. Check project's required fields first.

- **NEVER assume transition names are universal** — "Done", "Closed", "Complete" vary by project. Always get available transitions first.

- **NEVER bulk-modify without explicit approval** — Each ticket change notifies watchers. 10 edits = 10 notification storms.

---

## Common Errors & Recovery

### 401 Unauthorized / Invalid Token

**Symptom**: `"Unauthorized"` or `"Invalid or expired token"` when running jira commands or MCP tools.

**Diagnosis**:

- CLI: Token stored in `~/.config/jira/config.yml` may have expired
- MCP: Atlassian credentials in MCP config may be invalid

**Recovery**:

- **CLI**: Run `jira auth login` to re-authenticate
- **MCP**: Update Atlassian credentials in MCP settings and restart

**Agent guidance**: "Your Jira session has expired. Please re-authenticate [show command] and try again."

---

### Permission Denied

**Symptom**: `"You do not have permission to perform this operation on issue PROJ-123."` when trying to update, transition, or delete.

**Diagnosis**:

- User lacks project-level permissions (Reporter, Developer, etc.)
- Issue is restricted or in an archived project
- Workflow transition requires a specific role

**Recovery**:

1. Check user's project role: `jira issue view PROJ-123` and check "Assignee" field
2. Guide user to request access from project admin
3. Suggest alternative actions (comment instead of edit, etc.)

**Agent guidance**: "You don't have permission to modify this issue. Check with the project admin for access to [project]."

---

### Silent Assignment Failures (MCP)

**Symptom**: Assignment appears to succeed but assignee doesn't change when using display name.

**Diagnosis**: MCP's `transitionJiraIssue` (and similar) require account IDs, not display names.

**Recovery**:

1. Always call `mcp__atlassian__lookupJiraAccountId` first with display name or email
2. Extract account ID from result
3. Use account ID in assignment

**Agent guidance**: "When assigning via MCP, always lookup the account ID first using `lookupJiraAccountId`."

---

### Transition Fails Silently

**Symptom**: Issue doesn't move to new state despite no error message.

**Diagnosis**: Workflow has intermediate states (e.g., "In Progress" required between "To Do" and "Done") or status has conditions not met.

**Recovery**:

1. Fetch available transitions: `jira issue move ISSUE-KEY --available` (CLI)
2. Check which states are accessible from current state
3. Move through intermediate states if required
4. Verify with `jira issue view ISSUE-KEY` after each transition

**Agent guidance**: "The workflow may require intermediate states. Let me check available transitions first."

---

### Missing Required Fields

**Symptom**: `"Field X is required"` when creating or updating issue.

**Diagnosis**: Project has custom required fields. CLI defaults don't include all of them.

**Recovery**:

1. Run `jira issue create --template` to see all available fields
2. Ask user for values for required fields
3. Rebuild command with `-f"FieldName:Value"` syntax

**Agent guidance**: "This project requires [fields]. Can you provide values for these?"

---

### No Backend Available

**Symptom**: Neither CLI nor MCP tools are available.

**Diagnosis**: Jira CLI not installed; MCP not configured.

**Recovery**: Guide user to setup:

```
To use Jira, you need one of:

1. **jira CLI** (recommended):
   https://github.com/ankitpokhrel/jira-cli
   Install: brew install ankitpokhrel/jira-cli/jira-cli
   Setup:   jira init

2. **Atlassian MCP**:
   Configure in your MCP settings with Atlassian credentials.
```

---

## End-to-End Examples

### Example 1: Creating a Bug Ticket from Code Reference

**Scenario**: User says "Create a ticket for that memory leak in auth.ts"

**Step 1: Research**

```bash
# Ask user: "I'll create a bug ticket. What's the impact? Can you describe the memory leak?"
# Once user provides details, proceed.
```

**Step 2: Prepare**

```bash
# Draft the issue content
Summary: "Memory leak in auth.ts login flow"
Description: "When user logs in, process memory increases by 10MB. Suspected: session storage not being cleared on logout. Impacts: production login performance."
Type: Bug
```

**Step 3: Show & Approve**

```
Ready to create:
  Title: Memory leak in auth.ts login flow
  Type: Bug
  Description: When user logs in, process memory increases by 10MB...

Should I proceed?
```

**Step 4: Create (CLI)**

```bash
jira issue create \
  -tBug \
  -s"Memory leak in auth.ts login flow" \
  -b"When user logs in, process memory increases by 10MB. Suspected: session storage not being cleared on logout. Impacts: production login performance." \
  -p"BANKING"
```

**Step 5: Create (MCP)**

```
mcp__atlassian__createJiraIssue with:
  - issuetype: Bug
  - summary: "Memory leak in auth.ts login flow"
  - description: "When user logs in..."
  - project: BANKING
```

**Step 6: Confirm**

```
✓ Issue BANKING-456 created
  Link: https://jira.example.com/browse/BANKING-456

Should I add this to the current sprint?
```

---

### Example 2: Transitioning Issue to Done

**Scenario**: User says "Move BANKING-123 to Done"

**Step 1: Fetch Current State**

```bash
jira issue view BANKING-123
# Output shows: Status: "In Progress", Assignee: "john@example.com", Watchers: 5
```

**Step 2: Check Available Transitions**

```bash
jira issue move BANKING-123 --available
# Output shows: [In Review, Blocked, Done]
```

**Step 3: Confirm with User**

```
Current status: In Progress
Available transitions: [In Review, Blocked, Done]

Ready to move BANKING-123 to Done. Approved?
```

**Step 4: Transition (CLI)**

```bash
jira issue move BANKING-123 Done
```

**Step 4: Transition (MCP)**

```
mcp__atlassian__transitionJiraIssue with:
  - issueKey: BANKING-123
  - transitionName: Done
```

**Step 5: Verify**

```bash
jira issue view BANKING-123
# Output shows: Status: "Done", Updated: "2025-05-04", Notified: 5 watchers
```

**Step 6: Confirm**

```
✓ BANKING-123 moved to Done
  5 watchers notified
```

---

### Example 3: Linking Issue to Epic (Complex Workflow)

**Scenario**: User says "Link BANKING-789 to the Q2 roadmap epic"

**Step 1: Find Epic**

```bash
jira issue list -t Epic -s "Q2 Roadmap"
# Output: BANKING-100 (Q2 Roadmap)
```

**Step 2: Show Current State**

```bash
jira issue view BANKING-789
# Output: No epic linked currently
```

**Step 3: Confirm**

```
Ready to link:
  Issue: BANKING-789 (Create new dashboard)
  Epic: BANKING-100 (Q2 Roadmap)

Approved?
```

**Step 4: Link (CLI)**

```bash
jira issue edit BANKING-789 -f"Epic:BANKING-100"
```

**Step 4: Link (MCP)**

```
mcp__atlassian__editJiraIssue with:
  - issueKey: BANKING-789
  - updateData: { epic: BANKING-100 }
```

**Step 5: Verify**

```bash
jira issue view BANKING-789
# Output: Epic: BANKING-100 (Q2 Roadmap)
```

**Step 6: Confirm**

```
✓ BANKING-789 linked to epic BANKING-100
  Parent: Q2 Roadmap
```

---

## Safety

- Always show the command/tool call before running it
- Always get approval before modifying tickets
- Preserve original information when editing
- Verify updates after applying
- Always surface authentication issues clearly so the user can resolve them

---

## Deep Dive Reference

For advanced usage, consult these patterns:

### CLI Commands Reference

**JQL Queries** (for complex issue searches):

```bash
# Find all open bugs in a project
jira issue list -q"project = PROJ AND type = Bug AND status = Open"

# Find tickets assigned to me
jira issue list -q"assignee = currentUser()"

# Find high-priority issues in progress
jira issue list -q"priority = High AND status = 'In Progress'"
```

**Creating issues with custom fields**:

```bash
jira issue create \
  -tTask \
  -s"Summary" \
  -b"Description" \
  -f"Custom Field:Value" \
  -f"Another Field:Another Value"
```

**Bulk operations** (use with caution):

```bash
# Update multiple issues (requires explicit approval)
jira issue edit $(jira issue list -q"...") -f"Field:NewValue"
```

### MCP Patterns

**Lookup account IDs before assignment**:

```
1. Call: mcp__atlassian__lookupJiraAccountId with displayName or email
2. Extract: accountId from result
3. Use: accountId in assignment operations
```

**Fetch transitions before moving**:

```
1. Call: mcp__atlassian__getTransitionsForJiraIssue with issueKey
2. Check: available transition names
3. Call: mcp__atlassian__transitionJiraIssue with correct transition name
```

**Search with JQL**:

```
1. Build: JQL query (e.g., "assignee = currentUser()")
2. Call: mcp__atlassian__searchJiraIssuesUsingJql with query
3. Extract: issueKey, summary from results
```

### Workflow State Transitions

Common Jira workflows (varies by project):

**Standard workflow**:

```
To Do → In Progress → In Review → Done
```

**Kanban workflow**:

```
To Do → In Progress → Done
(With optional: Blocked)
```

**Scrum workflow**:

```
To Do → Selected for Development → In Progress → In Review → Done
```

**Always fetch available transitions** with your backend before moving. Don't assume state names.
