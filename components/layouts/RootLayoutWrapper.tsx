import RootProviders from "@/stores/providers";
import React from "react";
import PageShell from "./PageShell";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {Props}
 */
type Props = {
  children: React.ReactNode;
};

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {Props} param0
 * @param {React.ReactNode} param0.children
 * @returns {ReactJSX.Element}
 */
export default function RootLayoutWrapper({ children }: Props) {
  return (
    <RootProviders>
      <PageShell>{children}</PageShell>
    </RootProviders>
  );
}
