import { describe, expect, it, vi } from "vitest";

// Mock auth to return a fake session
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => ({
    user: { id: "user-settings-1", name: "Settings User" },
  })),
}));

// Mock redirect for unauthenticated checks
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error("REDIRECT:" + url);
  },
}));

// Mock actions to return stable shapes
vi.mock("@/actions/user.actions", () => ({
  getUserWithProfile: vi.fn(async () => ({
    ok: true,
    user: { id: "user-settings-1", name: "Settings User" },
  })),
}));
vi.mock("@/actions/updateProfile", () => ({
  updateProfile: vi.fn(async () => ({ ok: true })),
}));

import { SettingsServerWrapper } from "@/components/settings/settings-server-wrapper";
import { auth } from "@/lib/auth";

import {
  extractPropsFromElement,
  mockRedirectThrow,
} from "../utils/serverWrapperTestUtils";

vi.mock("next/navigation", () => mockRedirectThrow());

describe("SettingsServerWrapper", () => {
  it("returns a JSX element when authenticated and profile exists", async () => {
    const res = await SettingsServerWrapper();
    expect(res).toBeDefined();
    const props = extractPropsFromElement(res);
    // Assert that the client wrapper receives the userWithProfile prop
    expect(props).toMatchObject({
      userWithProfile: { id: "user-settings-1", name: "Settings User" },
    });
  });

  it("redirects to sign-in when unauthenticated", async () => {
    (auth as any).mockImplementationOnce(async () => null);
    await expect(SettingsServerWrapper()).rejects.toThrow(/REDIRECT:\/sign-in/);
  });
});
