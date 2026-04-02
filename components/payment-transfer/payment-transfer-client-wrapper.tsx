"use client";

import type { Resolver } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Bank } from "@/types/bank";
import type { Recipient } from "@/types/recipient";

import HeaderBox from "@/components/HeaderBox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransfer } from "@/lib/actions/dwolla.actions";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const TransferSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than zero")
    .multipleOf(0.01, "Amount may have at most 2 decimal places"),
  recipientId: z.string().trim().min(1, "Please select a recipient"),
  sourceBankId: z.string().trim().min(1, "Please select a source bank"),
});

type TransferFormData = z.infer<typeof TransferSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PaymentTransferClientWrapperProps {
  banks: Bank[];
  recipients: Recipient[];
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
  banks,
  recipients,
}: PaymentTransferClientWrapperProps): JSX.Element {
  const form = useForm<TransferFormData>({
    defaultValues: { amount: 0, recipientId: "", sourceBankId: "" },
    resolver: zodResolver(TransferSchema) as Resolver<TransferFormData>,
  });

  const sourceBankId = form.watch("sourceBankId");
  const recipientId = form.watch("recipientId");
  const amount = form.watch("amount");

  const sourceBank = banks.find((b) => b.id === sourceBankId);
  const recipient = recipients.find((r) => r.id === recipientId);

  async function onSubmit(data: TransferFormData): Promise<void> {
    if (!sourceBank?.dwollaFundingSourceUrl) {
      form.setError("sourceBankId", {
        message: "Selected bank has no Dwolla funding source configured.",
      });
      return;
    }

    if (!recipient?.bankAccountId) {
      form.setError("recipientId", {
        message: "Selected recipient has no bank account configured.",
      });
      return;
    }

    const result = await createTransfer({
      amount: data.amount.toFixed(2),
      destinationFundingSourceUrl: recipient.bankAccountId,
      sourceFundingSourceUrl: sourceBank.dwollaFundingSourceUrl,
    });

    if (result.ok) {
      toast.success("Transfer initiated successfully!");
      form.reset();
    } else {
      toast.error(result.error ?? "Transfer failed. Please try again.");
    }
  }

  return (
    <section className="space-y-8">
      <header>
        <HeaderBox
          type="title"
          title="Payment Transfer"
          subtext="Send money securely to your recipients via ACH transfer."
        />
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>New Transfer</CardTitle>
              <CardDescription>
                Fill in the details below to initiate a bank transfer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Source bank */}
                  <FormField
                    control={form.control}
                    name="sourceBankId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Bank Account</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger id="source-bank">
                              <SelectValue placeholder="Select source bank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {banks.map((bank) => (
                              <SelectItem key={bank.id} value={bank.id}>
                                {bank.institutionName ?? "Unknown Bank"}{" "}
                                {bank.accountId
                                  ? `(••••${bank.accountId.slice(-4)})`
                                  : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {banks.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No banks linked. Link a bank on the dashboard first.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Recipient */}
                  <FormField
                    control={form.control}
                    name="recipientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Recipient</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger id="recipient">
                              <SelectValue placeholder="Select recipient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {recipients.map((r) => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.name ?? r.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {recipients.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No recipients saved yet.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Amount */}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              id="amount"
                              type="number"
                              min="0.01"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-7"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Sending…" : "Send Transfer"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Summary panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transfer Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From</span>
                <span className="font-medium">
                  {sourceBank
                    ? (sourceBank.institutionName ?? "Unknown Bank")
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium">
                  {recipient ? (recipient.name ?? recipient.email) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {amount > 0 ? `$${amount.toFixed(2)}` : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
