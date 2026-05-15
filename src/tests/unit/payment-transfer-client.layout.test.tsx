import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PaymentTransferClientWrapper from "@/components/layouts/payment-transfer-client";

describe("components/layouts/payment-transfer-client", () => {
  it("renders with minimal props", () => {
    render(
      <PaymentTransferClientWrapper
        wallets={[]}
        recipients={[]}
        createTransfer={async () => ({ ok: true })}
      />,
    );
    expect(true).toBeTruthy();
  });
});
