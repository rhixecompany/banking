# Next.js Configuration (NextAuth.js)

## getServerSession

You can use `getServerSession` in various contexts in Next.js:

### In getServerSideProps

```js
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }
  return {
    props: { session }
  };
}
```

### In API Routes

```js
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  return res.json({ message: "Success" });
}
```

### In App Router

You can also use `getServerSession` in Next.js' server components:

```js
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
```

INFO: In contrast to `useSession`, which will return a `session` object whether or not a user has logged in, `getServerSession` only returns a `session` object when a user has logged in, otherwise, it returns `null`.

### Caching

Using this function implies personalized data and you should not store pages or APIs using this in a public cache. For example, a host like Vercel will implicitly prevent you from caching publicly due to the `set-cookie` header set by this function.

### Middleware

You can use a Next.js Middleware with NextAuth.js to protect your site.

#### Basic usage

```js
export { default } from "next-auth/middleware";
```

If you only want to secure certain pages, export a `config` object with a `matcher`:

```js
export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/dashboard"]
};
```

If a user is not logged in, the default behavior is to redirect them to the sign-in page.

#### Advanced usage

You can use the `withAuth` middleware function from `next-auth/middleware` either as a default or a named import:

```js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
});

export const config = { matcher: ["/admin"] };
```

---

[Source: https://next-auth.js.org/configuration/nextjs]
