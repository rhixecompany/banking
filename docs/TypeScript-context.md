# TypeScript (NextAuth.js)

NextAuth.js has its own type definitions to use in your TypeScript projects safely. Even if you don't use TypeScript, IDEs like VSCode will pick this up to provide you with a better developer experience.

## Adapters

If you're writing your own custom Adapter, you can take advantage of the types to make sure your implementation conforms to what's expected:

```ts
import type { Adapter } from "next-auth/adapters";
function MyAdapter(): Adapter {
  return {
    // your adapter methods here
  };
}
```

When writing your own custom Adapter in plain JavaScript, you can use JSDoc for editor hints:

```js
/** @return { import("next-auth/adapters").Adapter } */
function MyAdapter() {
  return {
    // your adapter methods here
  };
}
```

## Module Augmentation

You can extend/augment NextAuth.js types by creating a `types/next-auth.d.ts` file in your project:

```ts
import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      /** The user's postal address. */
      address: string;
    };
  }
}
```

Make sure that the `types` folder is added to [typeRoots](https://www.typescriptlang.org/tsconfig/#typeRoots) in your project's `tsconfig.json` file.

### Useful links

- [TypeScript documentation: Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
- [Digital Ocean: Module Augmentation in TypeScript](https://www.digitalocean.com/community/tutorials/typescript-module-augmentation)

---

[Source: https://next-auth.js.org/getting-started/typescript]
