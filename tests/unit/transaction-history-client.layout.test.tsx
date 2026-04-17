import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TransactionHistoryClientWrapper from "@/components/layouts/transaction-history-client";

describe("components/layouts/transaction-history-client", () => {
  it("renders with minimal props", () => {
    render(<TransactionHistoryClientWrapper transactions={[]} />);
    expect(true).toBeTruthy();
  });
});
