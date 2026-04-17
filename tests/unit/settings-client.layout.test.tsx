import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SettingsClientWrapper from "@/components/layouts/settings-client";

const fakeUserWithProfile = {
  email: "u1@example.com",
  id: "u1",
  image: null,
  name: "User One",
  profile: { address: "", city: "", phone: "", postalCode: "", state: "" },
};

describe("components/layouts/settings-client", () => {
  it("renders with minimal props", () => {
    render(
      <SettingsClientWrapper userWithProfile={fakeUserWithProfile as any} />,
    );
    expect(true).toBeTruthy();
  });
});
