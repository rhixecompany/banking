import NavbarComponent01 from "@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01";

const navigationData = [
  { href: "/dashboard", title: "Dashboard" },
  { href: "/my-banks", title: "My Banks" },
  { href: "/payment-transfer", title: "Transfer" },
  { href: "/transaction-history", title: "Transactions" },
];

/**
 * Server wrapper for the Navbar Component 01 shadcn-studio block.
 *
 * @export
 * @returns {JSX.Element}
 */
export function NavbarComponent01ServerWrapper(): JSX.Element {
  return <NavbarComponent01 navigationData={navigationData} />;
}
