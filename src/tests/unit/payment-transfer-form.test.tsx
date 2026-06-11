import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { expect, test, vi } from "vitest";

import PaymentTransferForm from "@/components/layouts/payment-transfer-form";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {{
 *   wallets?: any[];
 *   recipients?: any[];
 *   onSubmit?: (d: any) => Promise<void>;
 * }} param0
 * @param {(d: any) => Promise<void>} [param0.onSubmit=async () => undefined]
 * @param {{}} [param0.recipients=[]]
 * @param {{}} [param0.wallets=[]]
 * @returns {Promise<void>; }) => ReactJSX.Element}
 */
function Wrapper({
  onSubmit = async () => undefined,
  recipients = [],
  wallets = [],
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
  const wallet = { accountId: "1234", id: "w1", institutionName: "Bank A" };
  const recipient = { email: "alice@example.com", id: "r1", name: "Alice" };
  const handler = vi.fn(async () => {
    // match the expected signature of onSubmit used by the presentational
    // PaymentTransferForm which expects Promise<void>.
    return undefined;
  });

  render(
    <Wrapper wallets={[wallet]} recipients={[recipient]} onSubmit={handler} />,
  );

  // Selects are rendered by the test-double as native <select> elements.
  // The test-double uses the SelectTrigger id as `select-<id>` so we target
  // `select-source-bank` and `select-recipient` which are set in the
  // PaymentTransferForm via SelectTrigger id attributes.
  const source = screen.getByTestId("select-source-bank");
  fireEvent.change(source, { target: { value: "w1" } });

  const rec = screen.getByTestId("select-recipient");
  fireEvent.change(rec, { target: { value: "r1" } });

  const amount = screen.getByPlaceholderText("0.00");
  fireEvent.change(amount, { target: { value: "12.34" } });

  const btn = screen.getByTestId("transfer-submit");

  // Click the submit button which triggers the form's onSubmit handler.
  fireEvent.click(btn);

  // Wait for the provided onSubmit handler to be invoked. The component
  // performs form.trigger + handleSubmit internally so the handler should
  // be called asynchronously.
  await waitFor(() => expect(handler).toHaveBeenCalled());
});
