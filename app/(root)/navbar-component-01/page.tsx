import Navbar from "@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01";

const navigationData = [
  {
    href: "#",
    title: "Home",
  },
  {
    href: "#",
    title: "Products",
  },
  {
    href: "#",
    title: "About Us",
  },
  {
    href: "#",
    title: "Contacts",
  },
];

const NavbarPage = (): JSX.Element => {
  return (
    <div className="h-60">
      <Navbar navigationData={navigationData} />
    </div>
  );
};

export default NavbarPage;
