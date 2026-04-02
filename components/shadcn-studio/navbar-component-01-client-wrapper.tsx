"use client";

import NavbarComponent01 from "@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01";

/**
 * Client wrapper for the Navbar Component 01 shadcn-studio block.
 *
 * @export
 * @returns {JSX.Element}
 */
export function NavbarComponent01ClientWrapper(): JSX.Element {
  return (
    <NavbarComponent01
      navigationData={[
        { href: "/", title: "Home" },
        { href: "/my-banks", title: "My Banks" },
        { href: "/payment-transfer", title: "Transfer Funds" },
        { href: "/transaction-history", title: "Transaction History" },
      ]}
    />
  );
}
