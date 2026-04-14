# Section 14 — Frontend Component Patterns

- Prefer small Client wrappers for interactive third-party components.
- Use shadcn/ui components where possible.

Example client wrapper:

```tsx
"use client";
import { useState } from "react";
export function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(v => !v)}>
      {on ? "On" : "Off"}
    </button>
  );
}
```
