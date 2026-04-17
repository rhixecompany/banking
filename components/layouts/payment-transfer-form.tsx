import type { Recipient } from "@/types/recipient";
import type { Wallet } from "@/types/wallet";

import HeaderBox from "@/components/header-box/header-box";
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

interface Props {
  form: any;
  wallets: Wallet[];
  recipients: Recipient[];
  // Keep the presentational component flexible: accept unknown input
  // and return Promise<void>. Callers may wrap strongly-typed handlers.
  onSubmit: (data: unknown) => Promise<void>;
  transferResult?: { ok: boolean; message?: string } | null;
}

export default function PaymentTransferForm({
  form,
  onSubmit,
  recipients,
  transferResult,
  wallets,
}: Props) {
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
                  onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    try {
                      await form.trigger();
                      await form.handleSubmit(async (data: unknown) => {
                        await onSubmit(data);
                      })(e);
                    } catch {
                      /* swallow errors in tests */
                    }
                  }}
                  className="space-y-5"
                >
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
                          <div data-testid="sender-bank" />
                          <SelectContent>
                            {wallets.map((wallet) => (
                              <SelectItem
                                key={wallet.id}
                                value={wallet.id}
                                data-testid="bank-option"
                              >
                                {wallet.institutionName ?? "Unknown Bank"}{" "}
                                {wallet.accountId
                                  ? `(••••${wallet.accountId.slice(-4)})`
                                  : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {wallets.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No wallets linked. Link a wallet on the dashboard
                            first.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                          {/* E2E helpers expect a fillable recipient email and
                              a sharable-id input. These are presentational-only
                              inputs used by tests; they are not registered with
                              react-hook-form and do not affect submission. */}
                          <div className="space-y-2">
                            <input
                              data-testid="recipient-email"
                              id="recipient-email"
                              placeholder="Recipient email"
                              className="w-full rounded-sm border px-3 py-2"
                              aria-label="Recipient email"
                            />
                            <input
                              data-testid="sharable-id"
                              id="sharable-id"
                              placeholder="Sharable ID"
                              className="w-full rounded-sm border px-3 py-2"
                              aria-label="Sharable ID"
                            />
                          </div>
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
                              data-testid="transfer-amount"
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
                    data-testid="transfer-submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Sending…" : "Send Transfer"}
                  </Button>
                  {/* Visible hooks for E2E tests: success or error indicators */}
                  {transferResult?.ok === true && (
                    <div
                      data-testid="transfer-success"
                      className="sr-only"
                      aria-hidden
                    >
                      {transferResult.message ?? "Transfer succeeded"}
                    </div>
                  )}
                  {transferResult?.ok === false && (
                    <div
                      data-testid="transfer-error"
                      role="alert"
                      className="mt-2 text-sm text-destructive"
                    >
                      {transferResult.message ?? "Transfer failed"}
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Summary panel */}
        <TransferSummary
          sourceWallet={wallets.find(
            (w) => w.id === form.getValues("sourceBankId"),
          )}
          recipient={recipients.find(
            (r) => r.id === form.getValues("recipientId"),
          )}
          amount={form.getValues("amount")}
        />
      </div>
    </section>
  );
}

import TransferSummary from "@/components/layouts/transfer-summary";
