# Section 4 — Next.js App Router Patterns

- Server Components by default; mark with "use client" for interactive components.
- Use nested layouts and templates for route grouping.

Example Server Component:

```tsx
import { userDal } from "@/dal";

export default async function Dashboard() {
  const user = await userDal.findById("123");
  return <div>Welcome, {user?.name}</div>;
}
```
