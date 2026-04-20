import { describe, expect, it } from "vitest";

import { SignInServerWrapper } from "@/components/sign-in/sign-in-server-wrapper";

describe("SignInServerWrapper", () => {
  it("is an async function that returns a JSX element when unauthenticated", async () => {
    const res = await SignInServerWrapper();
    // We expect a JSX-like object (not null/undefined)
    expect(res).toBeTruthy();
  });
});
