# Section 14 — Frontend Component Patterns

- Prefer small client wrappers for interactive third-party components and keep components focused and testable.
- Use shadcn/ui components where they fit the design system.

Example:

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
