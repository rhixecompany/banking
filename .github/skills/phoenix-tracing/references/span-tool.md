# TOOL Spans

## Purpose

TOOL spans represent external tool or function invocations (API calls, database queries, calculators, custom functions).

## Required Attributes

| Attribute | Type | Description | Required |
| --- | --- | --- | --- |
| `openinference.span.kind` | String | Must be "TOOL" | Yes |
| `tool.name` | String | Tool/function name | Recommended |

## Attribute Reference

### Tool Execution Attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `tool.name` | String | Tool/function name |
| `tool.description` | String | Tool purpose/description |
| `tool.parameters` | String (JSON) | JSON schema defining the tool's parameters |
| `input.value` | String (JSON) | Actual input values passed to the tool |
| `output.value` | String | Tool output/result |
| `output.mime_type` | String | Result content type (e.g., "application/json") |

## Examples

### API Call Tool

```json
{
  "input.value": "{\"location\": \"San Francisco\", \"units\": \"celsius\"}",
  "openinference.span.kind": "TOOL",
  "output.value": "{\"temperature\": 18, \"conditions\": \"partly cloudy\"}",
  "tool.description": "Fetches current weather for a location",
  "tool.name": "get_weather",
  "tool.parameters": "{\"type\": \"object\", \"properties\": {\"location\": {\"type\": \"string\"}, \"units\": {\"type\": \"string\", \"enum\": [\"celsius\", \"fahrenheit\"]}}, \"required\": [\"location\"]}"
}
```

### Calculator Tool

```json
{
  "input.value": "{\"expression\": \"2 + 2\"}",
  "openinference.span.kind": "TOOL",
  "output.value": "4",
  "tool.description": "Performs mathematical calculations",
  "tool.name": "calculator",
  "tool.parameters": "{\"type\": \"object\", \"properties\": {\"expression\": {\"type\": \"string\", \"description\": \"Math expression to evaluate\"}}, \"required\": [\"expression\"]}"
}
```

### Database Query Tool

```json
{
  "input.value": "{\"query\": \"SELECT * FROM users WHERE id = 123\"}",
  "openinference.span.kind": "TOOL",
  "output.mime_type": "application/json",
  "output.value": "[{\"id\": 123, \"name\": \"Alice\", \"email\": \"alice@example.com\"}]",
  "tool.description": "Executes SQL query on user database",
  "tool.name": "sql_query",
  "tool.parameters": "{\"type\": \"object\", \"properties\": {\"query\": {\"type\": \"string\", \"description\": \"SQL query to execute\"}}, \"required\": [\"query\"]}"
}
```
