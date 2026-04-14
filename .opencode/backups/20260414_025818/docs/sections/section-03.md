# Section 3 — Repo Conventions

- No use of `any` types; prefer `unknown` + type guards.
- All DB access must go through `dal/`.
- Mutations implemented as Server Actions in `actions/`.

Representative TypeScript example (type guard):

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
