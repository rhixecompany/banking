# Component Patterns

## Server/Client Wrapper

### Server Wrapper

```typescript
// src/components/sign-in/sign-in-server-wrapper.tsx
import { auth } from "@/lib/auth";
import SignInClient from "./SignInClient";

export default async function SignInServerWrapper() {
  const session = await auth();
  return <SignInClient session={session} />;
}
```

### Client Wrapper with Form

```typescript
// src/components/sign-in/sign-in-client-wrapper.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations/auth";

import SignInForm from "./SignInForm";

export default function SignInClientWrapper() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: unknown) {
    const result = await signInAction(data);
    if (!result.ok) {
      form.setError("root", { message: result.error });
    }
  }

  return <SignInForm form={form} onSubmit={onSubmit} />;
}
```

## Payment Transfer with Server Action Prop

```typescript
// PaymentTransferClientWrapper receives action via props
interface PaymentTransferClientWrapperProps {
  wallets: Wallet[];
  recipients: Recipient[];
  // Server action passed from server wrapper
  createTransfer?: (input: unknown) => Promise<{
    ok: boolean;
    transferUrl?: string;
    error?: string;
  }>;
  initialSourceBankId?: string;
  initialRecipientId?: string;
  initialAmount?: number;
}

// Client component uses the passed action, not imported directly
export function PaymentTransferClient({
  createTransfer,
  wallets,
  recipients
}: PaymentTransferClientWrapperProps) {
  async function handleSubmit(data: TransferFormData) {
    const result = await createTransfer?.({
      amount: data.amount.toString(),
      recipientId: data.recipientId,
      sourceFundingSourceUrl: wallets.find(
        w => w.id === data.sourceBankId
      )?.dwollaFundingSourceUrl
    });
    if (result?.ok) {
      // Success handling
    }
  }
}
```

## UI Store Factory

```typescript
// src/stores/create-ui-store.ts
import { createStore } from "zustand";

export interface UIState {
  sidebarOpen: boolean;
  activeModal: ModalId;
  drawerOpen: boolean;
}

export interface UIActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
}

export type UIStore = UIActions & UIState;

// Factory function for SSR-safe store creation
export function createUIStore(initState: Partial<UIState> = {}) {
  return createStore<UIStore>()(set => ({
    activeModal: undefined,
    drawerOpen: false,
    sidebarOpen: false,
    ...initState,
    closeModal: () => set({ activeModal: undefined }),
    openModal: id => set({ activeModal: id }),
    setDrawerOpen: open => set({ drawerOpen: open }),
    setSidebarOpen: open => set({ sidebarOpen: open }),
    toggleDrawer: () =>
      set(state => ({ drawerOpen: !state.drawerOpen })),
    toggleSidebar: () =>
      set(state => ({ sidebarOpen: !state.sidebarOpen }))
  }));
}
```
