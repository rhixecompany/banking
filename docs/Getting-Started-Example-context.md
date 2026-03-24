# Getting Started Example (NextAuth.js)

## New Project

The easiest way to get started is to clone the [example app](https://github.com/nextauthjs/next-auth-example) and follow the instructions in README.md. You can try out a live demo at [https://next-auth-example.vercel.app/](https://next-auth-example.vercel.app/)

## Existing Project

### Install NextAuth

```bash
npm install next-auth
```

If you are using TypeScript, NextAuth.js comes with its types definitions within the package. To learn more about TypeScript for `next-auth`, check out the [TypeScript documentation](https://next-auth.js.org/getting-started/typescript).

### Add API route

To add NextAuth.js to a project create a file called `[...nextauth].js` in `pages/api/auth`. This contains the dynamic route handler for NextAuth.js which will also contain all of your global NextAuth.js configurations.

If you're using Next.js 13.2 or above with the new App Router (`app/`), you can initialize the configuration using the new Route Handlers by following the [guide](https://next-auth.js.org/configuration/initialization#route-handlers-app).

```js
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
    // ...add more providers here
  ]
};

export default NextAuth(authOptions);
```

All requests to `/api/auth/*` (`signIn`, `callback`, `signOut`, etc.) will automatically be handled by NextAuth.js.

### Configure Shared session state

To be able to use `useSession` first you'll need to expose the session context, `<SessionProvider />`, at the top level of your application:

```js
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

Instances of `useSession` will then have access to the session data and status. The `<SessionProvider />` also takes care of keeping the session updated and synced between browser tabs and windows.

TIP: If you are using the Next.js App Router, `<SessionProvider />` requires a client component and cannot be put inside the root layout. See the [Next.js documentation](https://nextjs.org/docs/app/getting-started/layouts-and-pages).

### Frontend - Add React Hook

The [useSession()](https://next-auth.js.org/getting-started/client#usesession) React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

```js
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
```

You can use the `useSession` hook from anywhere in your application (e.g. in a header component).

### Backend - API Route

To protect an API Route, you can use the [getServerSession()](https://next-auth.js.org/configuration/nextjs#unstable_getserversession) method.

```js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in."
    });
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page."
    });
  }
};
```

### Extensibility

NextAuth.js allows you to hook into various parts of the authentication flow via [built-in callbacks](https://next-auth.js.org/configuration/callbacks).

For example, to pass a value from the sign-in to the frontend, client-side, you can use a combination of the [session](https://next-auth.js.org/configuration/callbacks#session-callback) and [jwt](https://next-auth.js.org/configuration/callbacks#jwt-callback) callback.

```js
callbacks: {
  async jwt({ token, account }) {
    // Persist the OAuth access_token to the token right after signin
    if (account) {
      token.accessToken = account.access_token
    }
    return token
  },
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
    session.accessToken = token.accessToken
    return session
  },
}
```

Now whenever you call [getSession](https://next-auth.js.org/getting-started/client#getsession) or [useSession](https://next-auth.js.org/getting-started/client#usesession), the data object which is returned will include the `accessToken` value.

### Configuring callback URL (OAuth only)

If you are using an OAuth provider, you'll need to configure a callback URL in your provider's settings. Each provider has a "Configuration" section that should give you pointers on how to do that.

Follow [these steps](https://next-auth.js.org/configuration/providers/oauth#how-to) to learn how to integrate with an OAuth provider.

### Deploying to production

When deploying your site set the `NEXTAUTH_URL` environment variable to the canonical URL of the website.

```env
NEXTAUTH_URL=https://example.com
```

TIP: In production, this needs to be set as an environment variable on the service you use to deploy your app.

For more information please check out the [deployment page](https://next-auth.js.org/deployment).

---

[Source: https://next-auth.js.org/getting-started/example]
