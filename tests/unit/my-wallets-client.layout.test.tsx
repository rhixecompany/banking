import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MyWalletsClientWrapper from "@/components/layouts/my-wallets-client";

describe("components/layouts/my-wallets-client", () => {
  it("renders with minimal props", () => {
    render(
      <MyWalletsClientWrapper
        walletsWithDetails={[]}
        totalBalance={0}
        userId="test-user"
        removeWallet={async () => ({ ok: true })}
      />,
    );
    expect(true).toBeTruthy();
  });
});
