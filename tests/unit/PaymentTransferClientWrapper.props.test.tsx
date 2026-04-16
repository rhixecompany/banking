import { expect, test, vi } from "vitest";

// Mock next/navigation router which may be used by child components
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Mock sonner per-test so we can assert toast calls instead of fragile DOM
vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { PaymentTransferClientWrapper } from "@/components/payment-transfer/payment-transfer-client-wrapper";

const wallets = [
  {
    accountId: "1234",
    fundingSourceUrl: "https://mock",
    id: "w1",
    institutionName: "Bank A",
  },
];
const recipients = [
  {
    bankAccountId: "https://mock",
    email: "bob@example.com",
    id: "r1",
    name: "Bob",
  },
];

test("calls createTransfer and shows success toast when transfer is submitted", async () => {
  const createTransfer = vi.fn(async () => ({
    ok: true,
    transferUrl: "https://mock",
  }));

  const { container } = render(
    <PaymentTransferClientWrapper
      wallets={wallets as any}
      recipients={recipients as any}
      createTransfer={createTransfer}
      initialSourceBankId={wallets[0].id}
      initialRecipientId={recipients[0].id}
      initialAmount={10}
      autoSubmit
    />,
  );

  // Wait for the UI to reflect selected values before asserting calls.
  await waitFor(() =>
    expect(screen.getAllByText(/bank a/i).length).toBeGreaterThan(0),
  );
  await waitFor(() =>
    expect(screen.getAllByText(/bob/i).length).toBeGreaterThan(0),
  );

  const submit = screen.getByRole("button", { name: /send transfer/i });
  await userEvent.click(submit);

  // Fallback: submit native form if present
  const formEl = container.querySelector("form");
  if (formEl) fireEvent.submit(formEl as HTMLFormElement);

  await waitFor(() => expect(createTransfer).toHaveBeenCalled());

  // sonner mock is provided globally via tests/setup.ts; assert success
  expect(toast.success).toHaveBeenCalled();
});
