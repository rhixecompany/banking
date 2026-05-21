import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FeaturesGrid from "@/components/layouts/features-grid";

describe("FeaturesGrid", () => {
  it("renders the section title", () => {
    render(<FeaturesGrid />);
    expect(screen.getByText(/Why Choose Horizon\?/i)).toBeTruthy();
  });

  it("renders four feature items", () => {
    render(<FeaturesGrid />);
    expect(screen.getByText(/Instant Transfers/i)).toBeTruthy();
    expect(screen.getByText(/Bank-Grade Security/i)).toBeTruthy();
    expect(screen.getByText(/Easy Management/i)).toBeTruthy();
    expect(screen.getByText(/24\/7 Support/i)).toBeTruthy();
  });
});
