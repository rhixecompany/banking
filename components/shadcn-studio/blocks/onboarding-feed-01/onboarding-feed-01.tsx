"use client";

import {
  BanknoteIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  LinkIcon,
  SendIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const items = [
  {
    content:
      "Connect your bank securely using Plaid. We support thousands of financial institutions across the US.",
    icon: LinkIcon,
    label: "Link Bank",
    title: "Link your first bank account",
  },
  {
    content:
      "Once your bank is connected, your transactions will sync automatically so you can track spending in real time.",
    icon: BanknoteIcon,
    label: "View Transactions",
    title: "Review your transactions",
  },
  {
    content:
      "Send money to friends or pay bills using ACH bank transfers — fast, free, and secure.",
    icon: SendIcon,
    label: "Transfer",
    title: "Make your first transfer",
  },
];

interface OnboardingFeedProps {
  name: string;
}

function OnboardingFeed({ name }: OnboardingFeedProps): JSX.Element {
  const router = useRouter();
  const [active, setActive] = useState<string>("item-1");
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const handleOpenChange = (val: string): void => {
    setActive(val);
  };

  const handleComplete = (index: number): void => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    const nextIndex = index + 1;
    if (nextIndex < items.length) {
      setActive(`item-${nextIndex + 1}`);
    } else {
      setActive("");
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Hello, {name}!</CardTitle>
        <CardDescription>
          Let&apos;s get your banking set up in a few quick steps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2"
          value={active}
          onValueChange={handleOpenChange}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            const isCompleted = completed.has(index);

            return (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="rounded-md border!"
              >
                <AccordionTrigger className="px-5">
                  <span className="flex items-center gap-2">
                    {isCompleted ? (
                      <CircleCheckIcon className="size-4 shrink-0" />
                    ) : (
                      <CircleDashedIcon className="size-4 shrink-0" />
                    )}
                    <span>{item.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col items-start gap-2 px-5 text-muted-foreground">
                  {item.content}
                  <Button
                    size="sm"
                    onClick={() => handleComplete(index)}
                    disabled={
                      isCompleted || !(index === 0 || completed.has(index - 1))
                    }
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <div className="flex justify-end gap-2">
          <Button
            className="flex-1 max-sm:w-full"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 max-sm:w-full"
            type="button"
            onClick={() => router.push("/my-banks")}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default OnboardingFeed;
