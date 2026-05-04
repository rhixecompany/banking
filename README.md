<!-- markdownlint-disable MD033 MD036 MD041 MD045 MD059 -->
<div align="center">
  <br />
    <a href="#" target="_blank">
      <img src="https://github.com/adrianhajdin/banking/assets/151519281/3c03519c-7ebd-4539-b598-49e63d1770b4" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

  <h3 align="center">A Fintech Bank Application</h3>

   <div align="center">
     Build this project step by step with our detailed tutorial on <a href="#" target="_blank"><b>Alexander Iseghohi</b></a> YouTube. Join the JSM family!
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🚀 [Live Deployments](#deployments)
5. 🤸 [Quick Start](#quick-start)
6. 🗄️ [Database Setup](#database)
7. 🔐 [Authentication](#auth)
8. 📊 [DAL Pattern](#dal)
9. ⚡ [Server Actions](#server-actions)
10. 📧 [Email Service](#email)
11. 📚 [Documentation](#documentation)
12. 🔧 [Debugging](#debugging)
13. 🕸️ [Code Snippets to Copy](#snippets)
14. 🔗 [Links](#links)
15. 🚀 [More](#more)

## 🚨 Tutorial

This repository contains the code corresponding to an in-depth tutorial available on our YouTube channel, <a href="#" target="_blank"><b>Alexander Iseghohi</b></a>.

If you prefer visual learning, this is the perfect resource for you. Follow our tutorial to learn how to build projects like these step-by-step in a beginner-friendly manner!

<a href="#" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/1736fca5-a031-4854-8c09-bc110e3bc16d" /></a>

## <a name="introduction">🤖 Introduction</a>

Built with Next.js, Horizon is a financial SaaS platform that connects to multiple bank accounts, displays transactions in real-time, allows users to transfer money to other platform users, and manages their finances altogether.

If you're getting started and need assistance or face any bugs, join our active Discord community with over **34k+** members. It's a place where people help each other out.

<a href="https://discord.com/invite/n6EdbFJ" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/618f4872-1e10-42da-8213-1d69e486d02e" /></a>

## <a name="tech-stack">⚙️ Tech Stack</a>

| Technology | Version | Purpose |
| --- | --- | --- |
| **Next.js** | 16.2.2 | App Router, RSC, Cache Components |
| **React** | 19 | UI (React Compiler enabled) |
| **TypeScript** | 6.0.2 | Strict mode, typed routes |
| **PostgreSQL** | via Neon | Relational database |
| **Drizzle ORM** | 0.45.2 | Type-safe SQL + schema management |
| **NextAuth.js** | v4.24.13 | JWT sessions, OAuth, credentials |
| **shadcn/ui** | latest | Accessible UI components |
| **Tailwind CSS** | v4 | CSS-based config (`@theme` in globals.css) |
| **React Hook Form** | latest | Form state management |
| **Zod** | v4.3.6 | Runtime validation + type inference |
| **Plaid** | latest | Bank account linking |
| **Dwolla** | latest | ACH transfers |
| **Vitest** | 4.1.2 | Unit/integration testing |
| **Playwright** | 1.59.1 | E2E browser automation |

## <a name="features">🔋 Features</a>

👉 **Authentication**: An ultra-secure SSR authentication with proper validations and authorization

👉 **Connect Wallets**: Integrates with Plaid for multiple wallet connections

👉 **Home Page**: Shows general overview of user account with total balance from all connected wallets, recent transactions, money spent on different categories, etc

👉 **My Wallets**: Check the complete list of all connected wallets with respective balances, account details

👉 **Transaction History**: Includes pagination and filtering options for viewing transaction history of different banks

👉 **Real-time Updates**: Reflects changes across all relevant pages upon connecting new bank accounts.

👉 **Funds Transfer**: Allows users to transfer funds using Dwolla to other accounts with required fields and recipient bank ID.

👉 **Responsiveness**: Ensures the application adapts seamlessly to various screen sizes and devices, providing a consistent user experience across desktop, tablet, and mobile platforms.

and many more, including code architecture and reusability.

## <a name="deployments">🚀 Live Deployments</a>

| Platform | URL | Status |
| --- | --- | --- |
| **Vercel** | [banking-ccl6gjbrd-rhixecompanys-projects.vercel.app](https://banking-ccl6gjbrd-rhixecompanys-projects.vercel.app) | ✅ Active |
| **Railway** | [banking.up.railway.app](https://banking.up.railway.app) | 🔄 Building |
| **GitHub** | [github.com/rhixecompany/banking](https://github.com/rhixecompany/banking) | ✅ Active |

### Deployment Status Badges

![Vercel](https://img.shields.io/badge/Vercel-Deployed-green) ![Railway](https://img.shields.io/badge/Railway-Building-yellow) ![GitHub](https://img.shields.io/badge/GitHub-Active-blue)

---

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [Bun](https://bun.sh/) (package manager; see `package.json#packageManager`)

**Cloning the Repository**

```bash
git clone https://github.com/rhixecompany/banking.git
cd banking
```

**Installation**

Install the project dependencies using Bun:

```bash
bun install
```

**Set Up Environment Variables**

This repo includes a starter env file at `.env.example`.

```bash
cp .env.example .env.local
```

Edit `.env.local` and set at least:

- `DATABASE_URL`
- `ENCRYPTION_KEY`
- `NEXTAUTH_SECRET`

Then add any provider keys you plan to use (Plaid, Dwolla, OAuth).

Replace the placeholder values with your actual respective account credentials. You can obtain these credentials by signing up on [Plaid](https://plaid.com/) and [Dwolla](https://www.dwolla.com/).

**Running the Project**

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="snippets">🕸️ Code Snippets</a>

> **Note:** These snippets are reference examples demonstrating key patterns. For canonical patterns and up-to-date implementations, see **[AGENTS.md](./AGENTS.md)**. Some snippets may reference simplified patterns for clarity.

<details>
<summary><code>.env.example</code></summary>

```env
#NEXT
NEXT_PUBLIC_SITE_URL=


#PLAID
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions,identity
PLAID_COUNTRY_CODES=US,CA

#DWOLLA
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```

</details>

<details>
<summary><code>exchangePublicToken (Drizzle pattern)</code></summary>

```tsx
export const exchangePublicToken = async ({
  publicToken,
  userId
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken
    });
    const accountData = accountsResponse.data.accounts[0];

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken =
      processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      bankName: accountData.name,
      dwollaCustomerId: userId,
      processorToken
    });

    if (!fundingSourceUrl) throw Error;

    await createBankAccount({
      accessToken,
      accountId: accountData.account_id,
      bankId: itemId,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
      userId
    });

    revalidatePath("/");

    return { publicTokenExchange: "complete" };
  } catch (error) {
    console.error("Error exchanging token:", error);
  }
};
```

</details>

<details>

<summary><code>user.actions.ts (Drizzle + NextAuth)</code></summary>

```tsx
"use server";
import bcrypt from "bcrypt"; // docs: updated snippet — verify vs. source
import { z } from "zod";

import { db } from "@/database/db";
import { users, user_profiles } from "@/database/schema";

const RegisterSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim(),
  password: z.string().trim().min(8)
  // ...other fields
});

export async function registerUser(input: unknown) {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.errors[0]?.message, ok: false };
  const { email, name, password } = parsed.data;
  const hashed = await bcrypt.hash(password, 12); // docs: updated snippet — verify vs. source
  try {
    const [user] = await db
      .insert(users)
      .values({ email, name, password: hashed })
      .returning();
    await db
      .insert(user_profiles)
      .values({ user_id: user.id /* ...other fields */ });
    return { ok: true, user };
  } catch {
    return { error: "Registration failed", ok: false };
  }
}
```

</details>

<details>
<summary><code>dwolla.actions.ts</code></summary>

```tsx
"use server";

import { Client } from "dwolla-v2";

import { env } from "@/lib/env";

const getEnvironment = (): "production" | "sandbox" => {
  const environment = env.DWOLLA_ENV;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: env.DWOLLA_KEY,
  secret: env.DWOLLA_SECRET
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken
      })
      .then(res => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error(
      "Creating an On Demand Authorization Failed: ",
      err
    );
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    return await dwollaClient
      .post("customers", newCustomer)
      .then(res => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
  }
};

export const createTransfer = async ({
  amount,
  destinationFundingSourceUrl,
  sourceFundingSourceUrl
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        destination: { href: destinationFundingSourceUrl },
        source: { href: sourceFundingSourceUrl }
      },
      amount: { currency: "USD", value: amount }
    };
    return await dwollaClient
      .post("transfers", requestBody)
      .then(res => res.headers.get("location"));
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};

export const addFundingSource = async ({
  bankName,
  dwollaCustomerId,
  processorToken
}: AddFundingSourceParams) => {
  try {
    const dwollaAuthLinks = await createOnDemandAuthorization();
    const fundingSourceOptions = {
      _links: dwollaAuthLinks,
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};
```

</details>

<details>
<summary><code>bank.actions.ts</code></summary>

```tsx
"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType
} from "plaid";

import { plaidClient } from "../plaid.config";
import { parseStringify } from "../utils";
import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken
        });
        const accountData = accountsResponse.data.accounts[0];

        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!
        });

        const account = {
          bankId: bank.id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          id: accountData.account_id,
          institutionId: institution.institution_id,
          mask: accountData.mask!,
          name: accountData.name,
          officialName: accountData.official_name,
          sharableId: bank.sharableId,
          subtype: accountData.subtype! as string,
          type: accountData.type as string
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({
      data: accounts,
      totalBanks,
      totalCurrentBalance
    });
  } catch (error) {
    console.error(
      "An error occurred while getting the accounts:",
      error
    );
  }
};

// Get one bank account
export const getAccount = async ({ bankId }: getAccountProps) => {
  try {
    const bank = await getBank({ bankId });

    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken
    });
    const accountData = accountsResponse.data.accounts[0];

    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.id
    });

    const transferTransactions = transferTransactionsData.map(
      (transferData: Transaction) => ({
        amount: transferData.amount!,
        category: transferData.category,
        date: transferData.createdAt,
        id: transferData.id,
        name: transferData.name!,
        paymentChannel: transferData.channel,
        type:
          transferData.senderBankId === bank.id ? "debit" : "credit"
      })
    );

    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!
    });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken
    });

    const account = {
      bankId: bank.id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      id: accountData.account_id,
      institutionId: institution.institution_id,
      mask: accountData.mask!,
      name: accountData.name,
      officialName: accountData.official_name,
      subtype: accountData.subtype! as string,
      type: accountData.type as string
    };

    const allTransactions = [
      ...transactions,
      ...transferTransactions
    ].sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions
    });
  } catch (error) {
    console.error(
      "An error occurred while getting the account:",
      error
    );
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById(
      {
        country_codes: ["US"] as CountryCode[],
        institution_id: institutionId
      }
    );

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error(
      "An error occurred while getting the institution:",
      error
    );
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken
}: getTransactionsProps) => {
  let hasMore = true;
  const transactions: Transaction[] = [];

  try {
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken
      });

      const data = response.data;

      transactions.push(
        ...response.data.added.map(transaction => ({
          accountId: transaction.account_id,
          amount: transaction.amount,
          category: transaction.category
            ? transaction.category[0]
            : "",
          date: transaction.date,
          id: transaction.transaction_id,
          image: transaction.logo_url,
          name: transaction.name,
          paymentChannel: transaction.payment_channel,
          pending: transaction.pending,
          type: transaction.payment_channel
        }))
      );

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error(
      "An error occurred while getting the transactions:",
      error
    );
  }
};

// Create Transfer
export const createTransfer = async () => {
  const transferAuthRequest: TransferAuthorizationCreateRequest = {
    access_token:
      "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
    account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
    ach_class: "ppd" as ACHClass,
    amount: "10.00",
    funding_account_id: "442d857f-fe69-4de2-a550-0c19dc4af467",
    network: "ach" as TransferNetwork,
    type: "credit" as TransferType,
    user: {
      legal_name: "Anne Charleston"
    }
  };
  try {
    const transferAuthResponse =
      await plaidClient.transferAuthorizationCreate(
        transferAuthRequest
      );
    const authorizationId =
      transferAuthResponse.data.authorization.id;

    const transferCreateRequest: TransferCreateRequest = {
      access_token:
        "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
      account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
      authorization_id: authorizationId,
      description: "payment"
    };

    const responseCreateResponse = await plaidClient.transferCreate(
      transferCreateRequest
    );

    const transfer = responseCreateResponse.data.transfer;
    return parseStringify(transfer);
  } catch (error) {
    console.error(
      "An error occurred while creating transfer authorization:",
      error
    );
  }
};
```

</details>

<details>
<summary><code>BankTabItem.tsx</code></summary>

```tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { cn, formUrlQuery } from "@/lib/utils";

export const BankTabItem = ({
  account,
  appwriteItemId
}: BankTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div
      onClick={handleBankChange}
      className={cn(`banktab-item`, {
        " border-blue-600": isActive
      })}
    >
      <p
        className={cn(
          `text-16 line-clamp-1 flex-1 font-medium text-gray-500`,
          {
            " text-blue-600": isActive
          }
        )}
      >
        {account.name}
      </p>
    </div>
  );
};
```

</details>

<details>
<summary><code>BankInfo.tsx</code></summary>

```tsx
"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import {
  cn,
  formUrlQuery,
  formatAmount,
  getAccountTypeColors
} from "@/lib/utils";

const BankInfo = ({
  account,
  appwriteItemId,
  type
}: BankInfoProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId
    });
    router.push(newUrl, { scroll: false });
  };

  const colors = getAccountTypeColors(account?.type as AccountTypes);

  return (
    <div
      onClick={handleBankChange}
      className={cn(`bank-info ${colors.bg}`, {
        "shadow-xs border-blue-700": type === "card" && isActive,
        "rounded-xl": type === "card",
        "hover:shadow-xs cursor-pointer": type === "card"
      })}
    >
      <figure
        className={`flex-center h-fit rounded-full bg-blue-100 ${colors.lightBg}`}
      >
        <Image
          src="/icons/connect-bank.svg"
          width={20}
          height={20}
          alt={account.subtype}
          className="m-2 min-w-5"
        />
      </figure>
      <div className="flex w-full flex-1 flex-col justify-center gap-1">
        <div className="bank-info_content">
          <h2
            className={`text-16 line-clamp-1 flex-1 font-bold text-blue-900 ${colors.title}`}
          >
            {account.name}
          </h2>
          {type === "full" && (
            <p
              className={`text-12 rounded-full px-3 py-1 font-medium text-blue-700 ${colors.subText} ${colors.lightBg}`}
            >
              {account.subtype}
            </p>
          )}
        </div>

        <p
          className={`text-16 font-medium text-blue-700 ${colors.subText}`}
        >
          {formatAmount(account.currentBalance)}
        </p>
      </div>
    </div>
  );
};

export default BankInfo;
```

</details>

<details>
<summary><code>Copy.tsx</code></summary>

```tsx
"use client";
import { useState } from "react";

import { Button } from "./ui/button";

const Copy = ({ title }: { title: string }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(title);
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <Button
      data-state="closed"
      className="mt-3 flex max-w-[320px] gap-4"
      variant="secondary"
      onClick={copyToClipboard}
    >
      <p className="line-clamp-1 w-full max-w-full text-xs font-medium text-black-2">
        {title}
      </p>

      {!hasCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="mr-2 size-4"
        >
          <rect
            width="14"
            height="14"
            x="8"
            y="8"
            rx="2"
            ry="2"
          ></rect>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="mr-2 size-4"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </Button>
  );
};

export default Copy;
```

</details>

<details>
<summary><code>PaymentTransferForm.tsx</code></summary>

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/actions/dwolla.actions";
import { createTransaction } from "@/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/actions/user.actions";
import { decryptId } from "@/lib/utils";

import { BankDropdown } from "./bank/BankDropdown";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id")
});

const PaymentTransferForm = ({
  accounts
}: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: ""
    }
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId
      });
      const senderBank = await getBank({ bankId: data.senderBank });

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount
      };
      const transfer = await createTransfer(transferParams);

      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId,
          senderBankId: senderBank.id,
          receiverId: receiverBank.userId,
          receiverBankId: receiverBank.id,
          email: data.email
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      console.error(
        "Submitting create transfer request failed: ",
        error
      );
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col"
      >
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Select Source Bank
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds
                    from
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      setValue={form.setValue}
                      otherStyles="w-full!"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Please provide any additional information or
                    instructions related to the transfer
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea
                      placeholder="Write a short note here"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Bank account details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Recipient&apos;s Email Address
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: johndoe@gmail.com"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sharableId"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Receiver&apos;s Plaid Sharable Id
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter the public account number"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: 5.00"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp;
                Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
```

</details>

<details>
<summary><code>Missing from the video (top right on the transaction list page) BankDropdown.tsx</code></summary>

```tsx
"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger
} from "@/components/ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSeclected] = useState(accounts[0]);

  const handleBankChange = (id: string) => {
    const account = accounts.find(
      account => account.appwriteItemId === id
    )!;

    setSeclected(account);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id
    });
    router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <Select
      defaultValue={selected.id}
      onValueChange={value => handleBankChange(value)}
    >
      <SelectTrigger
        className={`flex w-full gap-3 md:w-[300px] ${otherStyles}`}
      >
        <Image
          src="icons/credit-card.svg"
          width={20}
          height={20}
          alt="account"
        />
        <p className="line-clamp-1 w-full text-left">
          {selected.name}
        </p>
      </SelectTrigger>
      <SelectContent
        className={`w-full md:w-[300px] ${otherStyles}`}
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">
            Select a bank to display
          </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.appwriteItemId}
              className="cursor-pointer border-t"
            >
              <div className="flex flex-col ">
                <p className="text-16 font-medium">{account.name}</p>
                <p className="text-14 font-medium text-blue-600">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
```

</details>

<details>
<summary><code>Pagination.tsx</code></summary>

```tsx
"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/utils";

export const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams()!;

  const handleNavigation = (type: "next" | "prev") => {
    const pageNumber = type === "prev" ? page - 1 : page + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageNumber.toString()
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex justify-between gap-3">
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation("prev")}
        disabled={Number(page) <= 1}
      >
        <Image
          src="/icons/arrow-left.svg"
          alt="arrow"
          width={20}
          height={20}
          className="mr-2"
        />
        Prev
      </Button>
      <p className="text-14 flex items-center px-2">
        {page} / {totalPages}
      </p>
      <Button
        size="lg"
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => handleNavigation("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
        <Image
          src="/icons/arrow-left.svg"
          alt="arrow"
          width={20}
          height={20}
          className="ml-2 -scale-x-100"
        />
      </Button>
    </div>
  );
};
```

</details>

<details>
<summary><code>Category.tsx</code></summary>

```tsx
import Image from "next/image";

import { topCategoryStyles } from "@/constants";
import { cn } from "@/lib/utils";

import { Progress } from "./ui/progress";

export const Category = ({ category }: CategoryProps) => {
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon
  } = topCategoryStyles[
    category.name as keyof typeof topCategoryStyles
  ] || topCategoryStyles.default;

  return (
    <div className={cn("gap-[18px] flex p-4 rounded-xl", bg)}>
      <figure
        className={cn("flex-center size-10 rounded-full", circleBg)}
      >
        <Image
          src={icon}
          width={20}
          height={20}
          alt={category.name}
        />
      </figure>
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="text-14 flex justify-between">
          <h2 className={cn("font-medium", main)}>{category.name}</h2>
          <h3 className={cn("font-normal", count)}>
            {category.count}
          </h3>
        </div>
        <Progress
          value={(category.count / category.totalCount) * 100}
          className={cn("h-2 w-full", progressBg)}
          indicatorClassName={cn("h-2 w-full", indicator)}
        />
      </div>
    </div>
  );
};
```

</details>

---

## <a name="database">🗄️ Database Setup</a>

This project uses **Drizzle ORM** with **PostgreSQL**.

### Database Commands

```bash
# Push schema to database
bun run db:push

# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio (GUI)
bun run db:studio

# Drop all tables
bun run db:drop
```

### Database Schema

The schema is located in `database/schema.ts` with the following tables:

| Table | Purpose |
| --- | --- |
| `users` | Core user data (id, email, password, name, isAdmin, isActive) |
| `user_profiles` | Extended user data (address, phone, SSN) |
| `banks` | Connected bank accounts with Plaid tokens |
| `transactions` | All transactions (internal and Plaid) |
| `recipients` | Saved transfer recipients |

---

## <a name="auth">🔐 Authentication</a>

Uses **NextAuth v4** with a **JWT session strategy** and Credentials + OAuth providers.

> **Note:** The tutorial code snippets in this README show an older `"database"` session strategy with `DrizzleAdapter`. The **live implementation** uses `strategy: "jwt"` (configured in `lib/auth-options.ts`). Refer to `lib/auth-options.ts` and `lib/auth.ts` for the current active configuration.

### Auth Files

| File | Purpose |
| --- | --- |
| `lib/auth-options.ts` | NextAuth configuration |
| `lib/auth.ts` | Server-side session helper |
| `app/api/auth/[...nextauth]/route.ts` | Auth API route |
| `proxy.ts` | Rate limiting and route protection |

### OAuth Providers

Configure in `.env.local`:

```env
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-secret
```

### Protected Routes

The middleware protects these routes:

- `/dashboard/*`
- `/settings/*`
- `/banks/*`

---

## <a name="dal">📊 DAL Pattern</a>

Data Access Layer for type-safe database queries.

### DAL Files

| File                     | Purpose                |
| ------------------------ | ---------------------- |
| `dal/user.dal.ts`        | User CRUD operations   |
| `dal/transaction.dal.ts` | Transaction operations |

### Usage Example

```tsx
import { userDal } from "@/dal";

// Find user by email
const user = await userDal.findByEmail("user@example.com");

// Find user with profile
const userWithProfile = await userDal.findByIdWithProfile(1);

// Create user with profile
await userDal.createWithProfile({
  email: "new@example.com",
  name: "New User",
  password: hashedPassword,
  profile: { address: "123 Main St" }
});
```

---

## <a name="server-actions">⚡ Server Actions</a>

All mutations use Next.js Server Actions.

### Action Files

| File                             | Purpose                |
| -------------------------------- | ---------------------- |
| `actions/register.ts`            | User registration      |
| `actions/updateProfile.ts`       | Profile updates        |
| `actions/admin.actions.ts`       | Admin operations       |
| `actions/transaction.actions.ts` | Transaction operations |

### Usage Example

```tsx
"use server";
import { registerUser } from "@/actions/register";

async function handleSubmit(formData: FormData) {
  const result = await registerUser({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password")
  });

  if (!result.ok) {
    console.error(result.error);
  }
}
```

---

## <a name="email">📧 Email Service</a>

Uses **Nodemailer** for transactional emails.

### Configuration

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### Email Functions

```tsx
import { sendEmail, sendWelcomeEmail } from "@/lib/email";

await sendWelcomeEmail("user@example.com", "John");
```

---

## <a name="documentation">📚 Documentation</a>

### Deployment Guides

| Document | Description |
| --- | --- |
| [Deploy to Hostinger](docs/deploy-to-hostinger.md) | Self-hosted VPS deployment with Neon database |
| [Deploy to Railway](docs/deploy-to-railway.md) | Complete guide for Railway deployment with GitHub Actions |
| [Deploy to Vercel](docs/deploy-to-vercel.md) | Vercel deployment guide |
| [Deploy to Vercel CLI](docs/deploy-to-vercel-cli.md) | Manual Vercel CLI deployment |

### Drizzle ORM Guides

| Document | Description |
| --- | --- |
| [Drizzle ORM Guides](docs/DrizzleORMGuides-context.md) | Comprehensive Drizzle ORM documentation |
| [Get Started with Drizzle](docs/GetStartedWithDrizzleAndPostgreSQL-context.md) | Setup Drizzle with PostgreSQL |
| [Cursor Pagination](docs/DrizzleORMGuide-Cursor-Based-Pagination.md) | Implementing cursor-based pagination |
| [Limit Offset Pagination](docs/DrizzleORMGuide-Limit-Offset-Pagination.md) | Traditional pagination |

### Other Guides

| Document | Description |
| --- | --- |
| [TypeScript Context](docs/TypeScript-context.md) | TypeScript best practices |
| [Next.js Context](docs/Next-js-context.md) | Next.js features and patterns |
| [Credentials Provider](docs/Credentials-Provider-context.md) | NextAuth credentials setup |
| [Drizzle Adapter](docs/Drizzle-ORM-Adapter-context.md) | NextAuth with Drizzle |

## Agentic contributor notes

This repo includes agentic docs that guide automated agents and contributors. Keep edits conservative and follow AGENTS.md as the canonical source-of-truth.

- Read `AGENTS.md` first — it is authoritative for agent commands, rules, and patterns.
- If a change touches more than 7 files, create a plan in `.opencode/commands/` named `<short-kebab-task>.plan.md` before implementing. See `.opencode/instructions/plan-workflow.md` for required sections.

  Note: Legacy plan artifacts may exist under `.opencode/plans/` or `.cursor/plans/`. Preserve those files for historical provenance — do not move or delete them. Use `.opencode/commands/` for all new user-facing plan files.

- Quick Validate (recommended before opening a PR):
  - `bun run format`
  - `bun run type-check`
  - `bun run lint:strict`
- Optional: run `bun run test` for behavior changes (Playwright E2E is slow).
- NEVER commit secrets (.env, tokens). Use `app-config.ts` or `lib/env.ts` for env access (proxy.ts is the only exception allowed to read `process.env`).

For full agentic guidance and examples, see `AGENTS.md` and `.opencode/instructions/`.

---

## <a name="debugging">🔧 Debugging</a>

### GitHub Actions

#### Common Issues

**"Dependencies lock file is not found"**

```bash
# Generate bun.lock
bun install
```

**"bun: command not found"**

- Ensure Bun is available in the workflow environment

#### View Logs

```bash
gh run list
gh run view <run-id> --log-failed
```

---

### Vercel

#### Common Issues

**Build fails**

- Check Vercel Dashboard → Deployments → Click latest deployment
- Verify all environment variables are set in Vercel project settings

**Environment variables missing**

- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add all variables from `.env.example`

#### View Logs

```bash
vercel logs
```

---

### Railway

#### Common Issues

**"packages field missing or empty"**

- This is a lockfile format issue
- Update `railway.json` to use npm:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build",
    "installCommand": "npm install"
  }
}
```

**Database connection fails**

- Verify DATABASE_URL in Railway variables
- Ensure PostgreSQL plugin is active

#### View Logs

```bash
railway logs
```

#### Useful Commands

```bash
railway status          # Check project status
railway variables      # List environment variables
railway redeploy       # Redeploy the service
railway open           # Open Railway dashboard
```

---

## <a name="links">🔗 Links</a>

Assets used in the project can be found [here](https://drive.google.com/file/d/1TVhdnD97LajGsyaiNa6sDs-ap-z1oerA/view?usp=sharing)

## <a name="more">🚀 More</a>

**Advance your skills with Next.js Pro Course**

Enjoyed creating this project? Dive deeper into our PRO courses for a richer learning experience. They're packed with detailed explanations, cool features, and exercises to boost your skills. Give it a go!

<a href="#" target="_blank">
<img src="https://i.ibb.co/804sPK6/Image-720.png" alt="Project Banner">
</a>
