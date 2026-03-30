"use client";
import type { ReactNode } from "react";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Description placeholder
 *
 * @typedef {Props}
 */
interface Props {
  /**
   * Description placeholder
   *
   * @type {ReactNode}
   */
  trigger: ReactNode;
  /**
   * Description placeholder
   *
   * @type {?boolean}
   */
  defaultOpen?: boolean;
  /**
   * Description placeholder
   *
   * @type {?("center" | "end" | "start")}
   */
  align?: "center" | "end" | "start";
}

/**
 * Description placeholder
 *
 * @param {Props} param0
 * @param {boolean} param0.defaultOpen
 * @param {("start" | "center" | "end")} param0.align
 * @param {ReactNode} param0.trigger
 * @returns {*}
 */

const LanguageDropdown = ({
  align,
  defaultOpen,
  trigger,
}: Props): JSX.Element => {
  const [language, setLanguage] = useState("english");

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align={align ?? "end"}>
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          <DropdownMenuRadioItem
            value="english"
            className="ps-2 text-base data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&>span]:hidden"
          >
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="german"
            className="ps-2 text-base data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&>span]:hidden"
          >
            Deutsch
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="spanish"
            className="ps-2 text-base data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&>span]:hidden"
          >
            Española
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="portuguese"
            className="ps-2 text-base data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&>span]:hidden"
          >
            Português
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="korean"
            className="ps-2 text-base data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&>span]:hidden"
          >
            한국인
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
