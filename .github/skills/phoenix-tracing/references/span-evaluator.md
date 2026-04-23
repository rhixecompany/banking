# EVALUATOR Spans

## Purpose

EVALUATOR spans represent quality assessment operations (answer relevance, faithfulness, hallucination detection).

## Required Attributes

| Attribute | Type | Description | Required |
| --- | --- | --- | --- |
| `openinference.span.kind` | String | Must be "EVALUATOR" | Yes |

## Common Attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `input.value` | String | Content being evaluated |
| `output.value` | String | Evaluation result (score, label, explanation) |
| `metadata.evaluator_name` | String | Evaluator identifier |
| `metadata.score` | Float | Numeric score (0-1) |
| `metadata.label` | String | Categorical label (relevant/irrelevant) |

## Example: Answer Relevance

```json
{
  "input.mime_type": "application/json",
  "input.value": "{\"question\": \"What is the capital of France?\", \"answer\": \"The capital of France is Paris.\"}",
  "metadata.evaluator_name": "answer_relevance",
  "metadata.explanation": "Answer directly addresses the question with correct information",
  "metadata.label": "relevant",
  "metadata.score": 0.95,
  "openinference.span.kind": "EVALUATOR",
  "output.value": "0.95"
}
```

## Example: Faithfulness Check

```json
{
  "input.mime_type": "application/json",
  "input.value": "{\"context\": \"Paris is in France.\", \"answer\": \"Paris is the capital of France.\"}",
  "metadata.evaluator_name": "faithfulness",
  "metadata.explanation": "Answer makes unsupported claim about Paris being the capital",
  "metadata.label": "partially_faithful",
  "metadata.score": 0.5,
  "openinference.span.kind": "EVALUATOR",
  "output.value": "0.5"
}
```
