"use client";

import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 *
 * @type {*}
 */
const PasswordInputContext = createContext<{ password: string } | undefined>(
  undefined,
);

/**
 * Description placeholder
 *
 * @export
 * @param {Omit<ComponentProps<typeof Input>, "type"> & {
 *   children?: ReactNode
 * }} param0
 * @param {*} param0.children
 * @param {*} param0.onChange
 * @param {*} param0.value
 * @param {*} param0.defaultValue
 * @param {*} param0....props
 * @returns {*}
 */
export function PasswordInput({
  children,
  defaultValue,
  onChange,
  value,
  ...props
}: {
  children?: ReactNode;
} & Omit<ComponentProps<typeof Input>, "type">) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(defaultValue ?? "");

  const Icon = showPassword ? EyeOffIcon : EyeIcon;
  const currentValue = value ?? password;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onChange?.(e);
  };

  return (
    <PasswordInputContext value={{ password: currentValue.toString() }}>
      <div className="space-y-3">
        <InputGroup>
          <InputGroupInput
            {...props}
            value={value}
            defaultValue={defaultValue}
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => setShowPassword((p) => !p)}
            >
              <Icon className="size-4.5" />
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {children}
      </div>
    </PasswordInputContext>
  );
}

/**
 * Description placeholder
 *
 * @export
 * @returns {*}
 */
export function PasswordInputStrengthChecker() {
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [errorLoadingOptions, setErrorLoadingOptions] = useState(false);

  const { password } = usePasswordInput();
  const deferredPassword = useDeferredValue(password);
  const strengthResult =
    !optionsLoaded || deferredPassword.length === 0
      ? ({ feedback: { warning: undefined }, score: 0 } as const)
      : zxcvbn(deferredPassword);

  useEffect(() => {
    Promise.all([
      import("@zxcvbn-ts/language-common"),
      import("@zxcvbn-ts/language-en"),
    ])
      .then(([common, english]) => {
        zxcvbnOptions.setOptions({
          dictionary: {
            ...common.dictionary,
            ...english.dictionary,
          },
          graphs: common.adjacencyGraphs,
          maxLength: 50,
          translations: english.translations,
        });
        setOptionsLoaded(true);
      })
      .catch(() => setErrorLoadingOptions(true));
  }, []);

  function getLabel() {
    if (deferredPassword.length === 0) return "Password strength";
    if (!optionsLoaded) return "Loading strength checker";

    const score = strengthResult.score;
    switch (score) {
      case 0:
      case 1:
        return "Very weak";
      case 2:
        return "Weak";
      case 3:
        return "Strong";
      case 4:
        return "Very strong";
      default:
        throw new Error(`Invalid score: ${score satisfies never}`);
    }
  }

  const label = getLabel();

  if (errorLoadingOptions) return undefined;

  return (
    <div className="space-y-0.5">
      <div
        role="progressbar"
        aria-label="Password Strength"
        aria-valuenow={strengthResult.score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuetext={label}
        className="flex gap-1"
      >
        {Array.from({ length: 4 }).map((_, i) => {
          const color =
            strengthResult.score >= 3 ? "bg-primary" : "bg-destructive";

          return (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                strengthResult.score > i ? color : "bg-secondary",
              )}
            />
          );
        })}
      </div>
      <div className="flex justify-end text-sm text-muted-foreground">
        {strengthResult.feedback.warning === undefined ? (
          label
        ) : (
          <Tooltip>
            <TooltipTrigger className="underline underline-offset-1">
              {label}
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4} className="text-base">
              {strengthResult.feedback.warning}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

/**
 * Description placeholder
 *
 * @returns {*}
 */
const usePasswordInput = () => {
  const context = useContext(PasswordInputContext);
  if (context === undefined) {
    throw new Error(
      "usePasswordInput must be used within a PasswordInputContext",
    );
  }
  return context;
};
