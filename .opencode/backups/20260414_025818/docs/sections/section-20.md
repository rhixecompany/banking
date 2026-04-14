# Section 20 — Performance

- Use streaming and Suspense boundaries to improve perceived performance.
- Cache heavy queries and use pagination for large lists.

Example Suspense usage:

```tsx
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```
