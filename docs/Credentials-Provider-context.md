# Credentials Provider (NextAuth.js)

## Overview

The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, domain, or two factor authentication or hardware device (e.g. YubiKey U2F / FIDO).

It is intended to support use cases where you have an existing system you need to authenticate users against.

DANGER: The functionality provided for credentials based authentication is intentionally limited to discourage use of passwords due to the inherent security risks associated with them and the additional complexity associated with supporting usernames and passwords.

## Example - Username / Password

The Credentials provider is specified like other providers, except that you need to define a handler for `authorize()` that accepts credentials submitted via HTTP POST as input and returns either:

1. A `user` object, which indicates the credentials are valid. If you return an object it will be persisted to the JSON Web Token and the user will be signed in, unless a custom `signIn()` callback is configured that subsequently rejects it.
2. If you return `null` then an error will be displayed advising the user to check their details.
3. If you throw an Error, the user will be sent to the error page with the error message as a query parameter.

```js
import CredentialsProvider from "next-auth/providers/credentials";

providers: [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: {
        label: "Username",
        type: "text",
        placeholder: "jsmith"
      },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      const user = {
        id: "1",
        name: "J Smith",
        email: "jsmith@example.com"
      };
      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user;
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null;
      }
    }
  })
];
```

## Multiple providers

You can specify more than one credentials provider by specifying a unique `id` for each one. You can also use them in conjunction with other provider options. As with all providers, the order you specify them is the order they are displayed on the sign in page.

---

[Source: https://next-auth.js.org/providers/credentials]
