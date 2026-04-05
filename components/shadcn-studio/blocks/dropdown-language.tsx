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
 * @author [object Object]
 *
 * @interface Props
 * @typedef {Props}
 */
interface Props {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {ReactNode}
   */
  trigger: ReactNode;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?boolean}
   */
  defaultOpen?: boolean;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?("center" | "end" | "start")}
   */
  align?: "center" | "end" | "start";
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {Props} param0
 * @param {("center" | "end" | "start")} param0.align
 * @param {boolean} param0.defaultOpen
 * @param {ReactNode} param0.trigger
 * @returns {ReactJSX.Element}
 */
const LanguageDropdown = ({ align, defaultOpen, trigger }: Props) => {
  const [language, setLanguage] = useState("english");

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align={align || "end"}>
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
