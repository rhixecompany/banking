# Section 4 — Next.js App Router Patterns

- Server Components are default; annotate client code with "use client".
- Use nested layouts and templates to structure routes and shared UI.

Example Server Component:

```tsx
import { userDal } from "@/dal";

export default async function Dashboard() {
  const user = await userDal.findById("123");
  return <div>Welcome, {user?.name}</div>;
}
```
