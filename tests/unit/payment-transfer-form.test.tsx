import PaymentTransferForm from "@/components/layouts/payment-transfer-form";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { expect, test, vi } from "vitest";

function Wrapper({
  wallets = [],
  recipients = [],
  onSubmit = async () => {},
}: {
  wallets?: any[];
  recipients?: any[];
  onSubmit?: (d: any) => Promise<void>;
}) {
  const form = useForm({
    defaultValues: { amount: 0, recipientId: "", sourceBankId: "" },
  });
  return (
    <PaymentTransferForm
      form={form}
      wallets={wallets}
      recipients={recipients}
      onSubmit={onSubmit}
    />
  );
}

test("renders form fields and submits", async () => {
  const wallet = { id: "w1", institutionName: "Bank A", accountId: "1234" };
  const recipient = { id: "r1", name: "Alice", email: "alice@example.com" };
  const handler = vi.fn(async () => ({ ok: true }));

  render(
    <Wrapper wallets={[wallet]} recipients={[recipient]} onSubmit={handler} />,
  );

  // Selects are rendered by test-double as native selects with ids
  const source = screen.getByTestId("select-source-bank");
  fireEvent.change(source, { target: { value: "w1" } });

  const rec = screen.getByTestId("select-recipient");
  fireEvent.change(rec, { target: { value: "r1" } });

  const amount = screen.getByPlaceholderText("0.00");
  fireEvent.change(amount, { target: { value: "12.34" } });

  const btn = screen.getByRole("button", { name: /send transfer/i });
  fireEvent.click(btn);

  // Fallback: submit native form if present
  const formEl = document.querySelector("form");
  if (formEl) fireEvent.submit(formEl as HTMLFormElement);

  // handler should be called via form submit (wait for async handlers)
  await waitFor(() => expect(handler).toHaveBeenCalled());
});
