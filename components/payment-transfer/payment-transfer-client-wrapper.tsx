"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Recipient } from "@/types/recipient";
import type { Wallet } from "@/types/wallet";

// createTransfer is provided by the surrounding server wrapper via props to
// avoid importing server actions directly into client components.
import PaymentTransferForm from "@/components/layouts/payment-transfer-form";
const TransferFormSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  recipientId: z.string().trim().min(1, "Select a recipient"),
  sourceBankId: z.string().trim().min(1, "Select a source bank"),
});

// Form-level data used by the UI. This differs from the server TransferSchema
// which accepts Dwolla funding source URLs. The client form selects recipient
// and source wallet IDs and the server wrapper maps those to funding URLs.
/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface TransferFormData
 * @typedef {TransferFormData}
 */
interface TransferFormData {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  sourceBankId: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  recipientId: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {number}
   */
  amount: number;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/**
 * Props for PaymentTransferClientWrapper.
 */
interface PaymentTransferClientWrapperProps {
  /** Array of linked wallet accounts for selecting the source of funds. */
  wallets: Wallet[];
  /** Array of saved recipients for selecting the transfer destination. */
  recipients: Recipient[];
  /**
   * Server action to create a Dwolla transfer. Passed from the server wrapper.
   */
  createTransfer?: (input: unknown) => Promise<{
    ok: boolean;
    transferUrl?: string;
    error?: string;
  }>;
  // Optional initial values to simplify testing and pre-fill the form
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  initialSourceBankId?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  initialRecipientId?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?number}
   */
  initialAmount?: number;
  /**
   * Test-only: if true and initial* props are provided, the form will be
   * auto-submitted on mount. Helps avoid fragile UI interactions in unit
   * tests that exercise submission behavior.
   */
  autoSubmit?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Client wrapper for the Payment Transfer page.
 * Uses React Hook Form + Zod for validation.
 * Calls createTransfer server action and shows toast feedback.
 * Note: the `note` field was removed — createTransfer does not accept it.
 *
 * @export
 * @param {PaymentTransferClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function PaymentTransferClientWrapper({
  autoSubmit,
  createTransfer,
  initialAmount,
  initialRecipientId,
  initialSourceBankId,
  recipients,
  wallets,
}: PaymentTransferClientWrapperProps): JSX.Element {
  const form = useForm<TransferFormData>({
    defaultValues: { amount: 0, recipientId: "", sourceBankId: "" },
    resolver: zodResolver(TransferFormSchema),
  });

  // Apply optional initial values after mount to pre-fill the form (test helper)
  useEffect(() => {
    if (
      initialSourceBankId !== undefined ||
      initialRecipientId !== undefined ||
      initialAmount !== undefined
    ) {
      // Reset the form with the provided initial values so the resolver sees
      // them as the current default values and validation will succeed.
      form.reset({
        amount:
          initialAmount !== undefined
            ? Number(initialAmount)
            : form.getValues("amount"),
        recipientId: initialRecipientId ?? form.getValues("recipientId"),
        sourceBankId: initialSourceBankId ?? form.getValues("sourceBankId"),
      });
      if (initialSourceBankId) {
        form.setValue("sourceBankId", initialSourceBankId);
      }
      if (initialRecipientId) {
        form.setValue("recipientId", initialRecipientId);
      }
      // Run validation immediately to ensure the form state is updated for tests
      void form.trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sourceBankId = form.watch("sourceBankId");
  const recipientId = form.watch("recipientId");
  const amount = form.watch("amount");

  const sourceWallet = wallets.find((w) => w.id === sourceBankId);
  const recipient = recipients.find((r) => r.id === recipientId);

  const [transferResult, setTransferResult] = useState<{
    ok: boolean;
    message?: string;
  } | null>(null);

  async function onSubmit(data: TransferFormData): Promise<void> {
    // No debug logging in production; tests should rely on mocks and
    // deterministic props instead.
    // Use the submitted data to derive the wallet and recipient so the
    // onSubmit logic doesn't depend on watch() values (avoids race
    // conditions when values are set programmatically in tests).
    const sourceWalletLocal = wallets.find((w) => w.id === data.sourceBankId);
    const recipientLocal = recipients.find((r) => r.id === data.recipientId);

    if (!sourceWalletLocal?.fundingSourceUrl) {
      form.setError("sourceBankId", {
        message: "Selected wallet has no Dwolla funding source configured.",
      });
      return;
    }

    if (!recipientLocal?.bankAccountId) {
      form.setError("recipientId", {
        message: "Selected recipient has no bank account configured.",
      });
      return;
    }

    if (!createTransfer) {
      toast.error("Transfer action not available");
      return;
    }
    const result = await createTransfer({
      amount: data.amount.toFixed(2),
      destinationFundingSourceUrl: recipientLocal.bankAccountId,
      sourceFundingSourceUrl: sourceWalletLocal.fundingSourceUrl,
    });

    if (result.ok) {
      toast.success("Transfer initiated successfully!");
      setTransferResult({
        message: "Transfer initiated successfully",
        ok: true,
      });
      form.reset();
    } else {
      toast.error(result.error ?? "Transfer failed. Please try again.");
      setTransferResult({
        message: result.error ?? "Transfer failed",
        ok: false,
      });
    }
  }

  // Auto-submit in test environments when requested and initial values are
  // supplied. This avoids flaky Select interactions in the test runner.
  useEffect(() => {
    if (
      !(
        autoSubmit &&
        initialSourceBankId !== undefined &&
        initialRecipientId !== undefined &&
        initialAmount !== undefined
      )
    )
      return;

    // Perform submission using the initial values directly.
    (async () => {
      try {
        form.setValue("sourceBankId", initialSourceBankId as string);
        form.setValue("recipientId", initialRecipientId as string);
        form.setValue("amount", Number(initialAmount));
        // Validate then call onSubmit with the coerced values
        const valid = await form.trigger();
        void valid;
        if (valid) {
          await onSubmit({
            amount: Number(initialAmount),
            recipientId: initialRecipientId as string,
            sourceBankId: initialSourceBankId as string,
          });
        }
      } catch {
        // swallow errors during autoSubmit in tests
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaymentTransferForm
      form={form}
      wallets={wallets}
      recipients={recipients}
      // Wrap the strongly-typed onSubmit so it matches the presentational
      // component's expected signature of (data: unknown) => Promise<void>.
      onSubmit={async (d: unknown) => {
        await onSubmit(d as TransferFormData);
      }}
      transferResult={transferResult}
    />
  );
}
