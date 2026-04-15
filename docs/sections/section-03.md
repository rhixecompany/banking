# Section 3 — Repo Conventions

- Do not use `any`; use `unknown` and narrow with type guards.
- All DB access must go through `dal/` helpers to avoid scattered SQL.
- Mutations should be Server Actions in `actions/` with proper Zod validation.

Type guard example:

```ts
type HasValue = { value: string };
function hasValue(input: unknown): input is HasValue {
  return (
    typeof input === "object" &&
    input !== null &&
    "value" in input &&
    typeof (input as HasValue).value === "string"
  );
}
```
