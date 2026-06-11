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

describe("SettingsServerWrapper", () => {
  it("returns a JSX element when authenticated and profile exists", async () => {
    const res = await SettingsServerWrapper();
    expect(res).toBeDefined();
    // The result is a <section> element with multiple children including SettingsClientWrapper
    // Verify the structure is valid JSX with className
    expect(res.props).toBeDefined();
    expect(res.props.className).toBe("space-y-10");
    // Verify we have children (SettingsClientWrapper, ConnectedAccount, SocialUrl, DangerZone)
    expect(res.props.children).toBeDefined();
  });

  it("redirects to sign-in when unauthenticated", async () => {
    (auth as any).mockImplementationOnce(async () => null);
    await expect(SettingsServerWrapper()).rejects.toThrow(/REDIRECT:\/sign-in/);
  });
});
