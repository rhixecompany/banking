---
name: mcp-builder
description: Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).
---

# MCP Server Development Guide

## Overview

To create high-quality MCP (Model Context Protocol) servers that enable LLMs to effectively interact with external services, use this skill. An MCP server provides tools that allow LLMs to access external services and APIs. The quality of an MCP server is measured by how well it enables LLMs to accomplish real-world tasks using the tools provided.

---

# Process

## 🚀 High-Level Workflow

Creating a high-quality MCP server involves four main phases:

### Phase 1: Deep Research and Planning

#### 1.1 Understand Agent-Centric Design

Design MCP tools around complete workflows that agents need to accomplish, not individual API calls. Build tools that consolidate related operations (e.g., `schedule_event` that both checks availability and creates event). Return high-signal information optimized for agent context windows, not exhaustive data dumps. Use consistent tool naming and prefixes for discoverability.

See [📋 Design Principles](./reference/design-principles.md) for detailed guidance on workflows, context optimization, error messaging, and evaluation-driven development.

#### 1.2 Study MCP Protocol Documentation

**Fetch the latest MCP protocol documentation:**

Use WebFetch to load: `https://modelcontextprotocol.io/llms-full.txt`

This comprehensive document contains the complete MCP specification and guidelines.

#### 1.3 Study Framework Documentation

**Load and read the following reference files:**

- **MCP Best Practices**: [📋 View Best Practices](./reference/mcp_best_practices.md) - Core guidelines for all MCP servers

**For Python implementations, also load:**

- **Python SDK Documentation**: Use WebFetch to load `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- [🐍 Python Implementation Guide](./reference/python_mcp_server.md) - Python-specific best practices and examples

**For Node/TypeScript implementations, also load:**

- **TypeScript SDK Documentation**: Use WebFetch to load `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) - Node/TypeScript-specific best practices and examples

#### 1.4 Exhaustively Study API Documentation

To integrate a service, read through **ALL** available API documentation:

- Official API reference documentation
- Authentication and authorization requirements
- Rate limiting and pagination patterns
- Error responses and status codes
- Available endpoints and their parameters
- Data models and schemas

**To gather comprehensive information, use web search and the WebFetch tool as needed.**

#### 1.5 Create a Comprehensive Implementation Plan

Based on your research, create a detailed plan that includes:

**Tool Selection:**

- List the most valuable endpoints/operations to implement
- Prioritize tools that enable the most common and important use cases
- Consider which tools work together to enable complex workflows

**Shared Utilities and Helpers:**

- Identify common API request patterns
- Plan pagination helpers
- Design filtering and formatting utilities
- Plan error handling strategies

**Input/Output Design:**

- Define input validation models (Pydantic for Python, Zod for TypeScript)
- Design consistent response formats (e.g., JSON or Markdown), and configurable levels of detail (e.g., Detailed or Concise)
- Plan for large-scale usage (thousands of users/resources)
- Implement character limits and truncation strategies (e.g., 25,000 tokens)

**Error Handling Strategy:**

- Plan graceful failure modes
- Design clear, actionable, LLM-friendly, natural language error messages which prompt further action
- Consider rate limiting and timeout scenarios
- Handle authentication and authorization errors

---

### Phase 2: Implementation

Now that you have a comprehensive plan, begin implementation following language-specific best practices.

#### 2.1 Set Up Project Structure

**For Python:**

- Create a single `.py` file or organize into modules if complex (see [🐍 Python Guide](./reference/python_mcp_server.md))
- Use the MCP Python SDK for tool registration
- Define Pydantic models for input validation

**For Node/TypeScript:**

- Create proper project structure (see [⚡ TypeScript Guide](./reference/node_mcp_server.md))
- Set up `package.json` and `tsconfig.json`
- Use MCP TypeScript SDK
- Define Zod schemas for input validation

#### 2.2 Implement Core Infrastructure First

**To begin implementation, create shared utilities before implementing tools:**

- API request helper functions
- Error handling utilities
- Response formatting functions (JSON and Markdown)
- Pagination helpers
- Authentication/token management

#### 2.3 Implement Tools Systematically

For each tool in the plan:

**Define Input Schema:**

- Use Pydantic (Python) or Zod (TypeScript) for validation
- Include proper constraints (min/max length, regex patterns, min/max values, ranges)
- Provide clear, descriptive field descriptions
- Include diverse examples in field descriptions

**Write Comprehensive Docstrings/Descriptions:**

- One-line summary of what the tool does
- Detailed explanation of purpose and functionality
- Explicit parameter types with examples
- Complete return type schema
- Usage examples (when to use, when not to use)
- Error handling documentation, which outlines how to proceed given specific errors

**Implement Tool Logic:**

- Use shared utilities to avoid code duplication
- Follow async/await patterns for all I/O
- Implement proper error handling
- Support multiple response formats (JSON and Markdown)
- Respect pagination parameters
- Check character limits and truncate appropriately

**Tool Registration Examples:**

**Python (FastMCP):**

```python
from mcp.server import Server
from mcp.types import Tool
import anthropic
from pydantic import BaseModel

server = Server("my-server")

class SearchUsersInput(BaseModel):
    query: str
    limit: int = 10

@server.tool
async def search_users(query: str, limit: int = 10) -> str:
    """Search for users by name or email.

    Args:
        query: Search term to match against user names and emails
        limit: Maximum number of results (max 100)

    Returns:
        JSON array of matching users with id, name, email
    """
    if limit > 100:
        limit = 100
    results = await api.search(query, limit=limit)
    return json.dumps(results)
```

**TypeScript (MCP SDK):**

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { z } from "zod";

const server = new Server({
  name: "my-server",
  version: "1.0.0"
});

const searchUsersSchema = z.object({
  query: z.string().describe("Search term"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe("Max results")
});

server.setRequestHandler(Tool.Request, async request => {
  if (request.params.name === "search_users") {
    const input = searchUsersSchema.parse(request.params.arguments);
    const results = await api.search(input.query, input.limit);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results)
        }
      ],
      isError: false
    };
  }
});
```

**Add Tool Annotations:**

- `readOnlyHint`: true (for read-only operations)
- `destructiveHint`: false (for non-destructive operations)
- `idempotentHint`: true (if repeated calls have same effect)
- `openWorldHint`: true (if interacting with external systems)

#### 2.4 Follow Language-Specific Best Practices

**At this point, load the appropriate language guide:**

**For Python: Load [🐍 Python Implementation Guide](./reference/python_mcp_server.md) and ensure the following:**

- Using MCP Python SDK with proper tool registration
- Pydantic v2 models with `model_config`
- Type hints throughout
- Async/await for all I/O operations
- Proper imports organization
- Module-level constants (CHARACTER_LIMIT, API_BASE_URL)

**For Node/TypeScript: Load [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) and ensure the following:**

- Using `server.registerTool` properly
- Zod schemas with `.strict()`
- TypeScript strict mode enabled
- No `any` types - use proper types
- Explicit Promise<T> return types
- Build process configured (`npm run build`)

---

### Phase 3: Review and Refine

After initial implementation:

#### 3.1 Code Quality Review

To ensure quality, review the code for:

- **DRY Principle**: No duplicated code between tools
- **Composability**: Shared logic extracted into functions
- **Consistency**: Similar operations return similar formats
- **Error Handling**: All external calls have error handling
- **Type Safety**: Full type coverage (Python type hints, TypeScript types)
- **Documentation**: Every tool has comprehensive docstrings/descriptions

#### 3.2 Test and Build

**Important:** MCP servers are long-running processes that wait for requests over stdio/stdin or sse/http. Running them directly in your main process (e.g., `python server.py` or `node dist/index.js`) will cause your process to hang indefinitely. This is a critical anti-pattern.

**Safe ways to test the server:**

- Use the evaluation harness (see Phase 4) - recommended approach
- Run the server in tmux to keep it outside your main process
- Use a timeout when testing: `timeout 5s python server.py`

**For Python:**

- Verify Python syntax: `python -m py_compile your_server.py`
- Check imports work correctly by reviewing the file
- To manually test: Run server in tmux, then test with evaluation harness in main process
- Or use the evaluation harness directly (it manages the server for stdio transport)

**For Node/TypeScript:**

- Run `npm run build` and ensure it completes without errors
- Verify dist/index.js is created
- To manually test: Run server in tmux, then test with evaluation harness in main process
- Or use the evaluation harness directly (it manages the server for stdio transport)

---

### Anti-Patterns to Avoid

These are critical landmines that only experience teaches. Avoid them explicitly:

**NEVER forget async/await in tool implementations**

- MCP communication is asynchronous; blocking I/O stalls agents and prevents them from using other tools
- Every external call must be awaited; use `async def` (Python) or `async (input) =>` (TypeScript)
- Exception: If wrapping a synchronous API, create an async wrapper function

**NEVER return unformatted data dumps**

- Agents have constrained context windows; return high-signal information only
- Truncate large responses; use "concise" vs "detailed" response modes
- Example: Return `[{id: "123", name: "John"}]` not full API payload with 50 nested fields

**NEVER use inconsistent tool naming patterns**

- Example: `search_users` and `find_posts` breaks pattern discovery; agents can't learn your conventions
- Use consistent prefixes: `search_*`, `get_*`, `list_*`, `create_*` for discoverability
- Bad: `getUserById`, `search_for_posts`, `findTransactions` (mixed patterns)
- Good: `get_user_by_id`, `search_posts`, `list_transactions` (consistent snake_case + pattern)

**NEVER ignore tool hints in registration**

- `readOnlyHint: true` — agents avoid this for destructive operations; always set for read-only tools
- `destructiveHint: true` — agents are extra careful; always set for mutations
- `idempotentHint: true` — agents can retry safely; set when repeated calls have same effect
- Missing hints = agents make dangerous assumptions about tool safety

**NEVER skip clear error messages for agents**

- Silent failures prevent agent learning and recovery
- Error messages must be: specific + actionable + human-readable
- Bad: `"429 error"` or `"Rate limited"` (agent has no next step)
- Good: `"Rate limited. Try again in 60 seconds."` or `"API key expired; call admin"`

**NEVER make tool descriptions overly technical**

- Agents need to understand intent, not API documentation details
- Bad: `"Invokes GET /api/v2/users/{id} endpoint with optional filter parameters"`
- Good: `"Retrieve user details by ID including name, email, and created date"`

**NEVER mix response formats without warning**

- If some tools return JSON and others Markdown, agents get confused
- Choose one primary format; document exceptions clearly
- If supporting both, document the response format in tool description

#### 3.3 Use Quality Checklist

To verify implementation quality, load the appropriate checklist from the language-specific guide:

- Python: see "Quality Checklist" in [🐍 Python Guide](./reference/python_mcp_server.md)
- Node/TypeScript: see "Quality Checklist" in [⚡ TypeScript Guide](./reference/node_mcp_server.md)

---

### Phase 4: Create Evaluations

After implementing your MCP server, create comprehensive evaluations to test its effectiveness.

**Load [✅ Evaluation Guide](./reference/evaluation.md) for complete evaluation guidelines.**

#### 4.1 Understand Evaluation Purpose

Evaluations test whether LLMs can effectively use your MCP server to answer realistic, complex questions.

#### 4.2 Create 10 Evaluation Questions

To create effective evaluations, follow the process outlined in the evaluation guide:

1. **Tool Inspection**: List available tools and understand their capabilities
2. **Content Exploration**: Use READ-ONLY operations to explore available data
3. **Question Generation**: Create 10 complex, realistic questions
4. **Answer Verification**: Solve each question yourself to verify answers

#### 4.3 Evaluation Requirements

Each question must be:

- **Independent**: Not dependent on other questions
- **Read-only**: Only non-destructive operations required
- **Complex**: Requiring multiple tool calls and deep exploration
- **Realistic**: Based on real use cases humans would care about
- **Verifiable**: Single, clear answer that can be verified by string comparison
- **Stable**: Answer won't change over time

#### 4.4 Output Format

Create an XML file with this structure:

```xml
<evaluation>
  <qa_pair>
    <question>Find discussions about AI model launches with animal codenames. One model needed a specific safety designation that uses the format ASL-X. What number X was being determined for the model named after a spotted wild cat?</question>
    <answer>3</answer>
  </qa_pair>
<!-- More qa_pairs... -->
</evaluation>
```

---

# Reference Files

## 📚 Documentation Library

Load these resources as needed during development:

### Core MCP Documentation (Load First)

- **MCP Protocol**: Fetch from `https://modelcontextprotocol.io/llms-full.txt` - Complete MCP specification
- [📋 MCP Best Practices](./reference/mcp_best_practices.md) - Universal MCP guidelines including:
  - Server and tool naming conventions
  - Response format guidelines (JSON vs Markdown)
  - Pagination best practices
  - Character limits and truncation strategies
  - Tool development guidelines
  - Security and error handling standards

### SDK Documentation (Load During Phase 1/2)

- **Python SDK**: Fetch from `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- **TypeScript SDK**: Fetch from `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`

### Language-Specific Implementation Guides (Load During Phase 2)

- [🐍 Python Implementation Guide](./reference/python_mcp_server.md) - Complete Python/FastMCP guide with:
  - Server initialization patterns
  - Pydantic model examples
  - Tool registration with `@mcp.tool`
  - Complete working examples
  - Quality checklist

- [⚡ TypeScript Implementation Guide](./reference/node_mcp_server.md) - Complete TypeScript guide with:
  - Project structure
  - Zod schema patterns
  - Tool registration with `server.registerTool`
  - Complete working examples
  - Quality checklist

### Evaluation Guide (Load During Phase 4)

- [✅ Evaluation Guide](./reference/evaluation.md) - Complete evaluation creation guide with:
  - Question creation guidelines
  - Answer verification strategies
  - XML format specifications
  - Example questions and answers
  - Running an evaluation with the provided scripts
