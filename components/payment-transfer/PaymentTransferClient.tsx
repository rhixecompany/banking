"use client";

import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransfer } from "@/lib/actions/dwolla.actions";

/**
 * Props for the PaymentTransferClient component.
 *
 * @interface PaymentTransferClientProps
 */
interface PaymentTransferClientProps {
  banks: Bank[];
  recipients: Recipient[];
  userId: string;
}

/**
 * Client component for the payment transfer form.
 * Handles source bank selection, recipient selection, and amount entry.
 * Calls the Dwolla createTransfer server action on submit.
 *
 * @export
 * @param {PaymentTransferClientProps} props
 * @returns {JSX.Element}
 */
export function PaymentTransferClient({
  banks,
  recipients,
  userId: _userId,
}: PaymentTransferClientProps): JSX.Element {
  const [sourceBankId, setSourceBankId] = useState<string>("");
  const [recipientId, setRecipientId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const sourceBank = banks.find((b) => b.id === sourceBankId);
  const recipient = recipients.find((r) => r.id === recipientId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMessage(undefined);
    setErrorMessage(undefined);

    if (!sourceBank?.dwollaFundingSourceUrl) {
      setErrorMessage(
        "Selected source bank has no Dwolla funding source configured.",
      );
      return;
    }

    if (!recipient?.bankAccountId) {
      setErrorMessage("Selected recipient has no bank account ID configured.");
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid positive amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createTransfer({
        amount: parsedAmount.toFixed(2),
        destinationFundingSourceUrl: recipient.bankAccountId,
        sourceFundingSourceUrl: sourceBank.dwollaFundingSourceUrl,
      });

      if (result.ok) {
        setSuccessMessage("Transfer initiated successfully!");
        setAmount("");
        setNote("");
        setSourceBankId("");
        setRecipientId("");
      } else {
        setErrorMessage(result.error ?? "Transfer failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Source bank */}
                <div className="space-y-2">
                  <Label htmlFor="source-bank">From Bank Account</Label>
                  <Select value={sourceBankId} onValueChange={setSourceBankId}>
                    <SelectTrigger id="source-bank">
                      <SelectValue placeholder="Select source bank" />
                    </SelectTrigger>
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
                </div>

                {/* Recipient */}
                <div className="space-y-2">
                  <Label htmlFor="recipient">To Recipient</Label>
                  <Select value={recipientId} onValueChange={setRecipientId}>
                    <SelectTrigger id="recipient">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
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
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
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
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7"
                    />
                  </div>
                </div>

                {/* Transfer note */}
                <div className="space-y-2">
                  <Label htmlFor="note">
                    Transfer Note{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="note"
                    type="text"
                    placeholder="e.g. Rent for March"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={140}
                  />
                </div>

                {/* Feedback */}
                {successMessage && (
                  <p className="rounded-md bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                    {successMessage}
                  </p>
                )}
                {errorMessage && (
                  <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
                    {errorMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting || !sourceBankId || !recipientId || !amount
                  }
                >
                  {isSubmitting ? "Sending…" : "Send Transfer"}
                </Button>
              </form>
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
                  {amount && !Number.isNaN(Number.parseFloat(amount))
                    ? `$${Number.parseFloat(amount).toFixed(2)}`
                    : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
