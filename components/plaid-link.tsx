"use client";

import { useCallback, useEffect, useState } from "react";
import {
  usePlaidLink,
  type PlaidLinkOnSuccess,
  type PlaidLinkOptions,
} from "react-plaid-link";

import type { Bank } from "@/types/bank";

import { Button } from "@/components/ui/button";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/plaid.actions";

export interface PlaidLinkProps {
  userId: string;
  onSuccess?: (bank: Bank) => void;
  onExit?: () => void;
  onLoad?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
  size?: "default" | "icon" | "lg" | "sm";
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function PlaidLink({
  children,
  className,
  disabled,
  onExit,
  onLoad,
  onSuccess,
  size = "default",
  userId,
  variant = "default",
}: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchLinkToken() {
      setIsLoading(true);
      setError(undefined);

      const result = await createLinkToken({ userId });

      if (result.ok && result.linkToken) {
        setLinkToken(result.linkToken);
      } else {
        setError(result.error ?? "Failed to initialize Plaid Link");
      }

      setIsLoading(false);
    }

    void fetchLinkToken();
  }, [userId]);

  const handleSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, metadata) => {
      const result = await exchangePublicToken({
        publicToken,
        userId,
      });

      if (result.ok && result.bank) {
        onSuccess?.(result.bank);
      } else {
        setError(result.error ?? "Failed to link bank account");
      }
    },
    [userId, onSuccess],
  );

  const handleExit = useCallback(() => {
    onExit?.();
  }, [onExit]);

  const config: PlaidLinkOptions = {
    onExit: handleExit,
    onSuccess: handleSuccess,
    token: linkToken ?? null,
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (ready && onLoad) {
      onLoad();
    }
  }, [ready, onLoad]);

  const handleClick = () => {
    if (linkToken) {
      open();
    }
  };

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isLoading || !ready || !linkToken}
      onClick={handleClick}
    >
      {isLoading ? "Loading..." : (children ?? "Link Bank Account")}
    </Button>
  );
}

export default PlaidLink;
