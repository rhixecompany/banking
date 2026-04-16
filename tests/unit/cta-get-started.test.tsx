import CtaGetStarted from "@/components/layouts/cta-get-started";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("CtaGetStarted", () => {
  it("renders heading and button", () => {
    render(<CtaGetStarted />);
    expect(screen.getByText(/Ready to Get Started\?/i)).toBeTruthy();
    expect(screen.getByRole("link")).toBeTruthy();
    // Button is nested inside the Link — assert by role to avoid matching
    // identical text inside paragraph content.
    expect(
      screen.getByRole("button", { name: /Create Your Account/i }),
    ).toBeTruthy();
  });
});
