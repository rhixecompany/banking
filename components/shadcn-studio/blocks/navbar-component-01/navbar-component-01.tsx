import { MenuIcon, SearchIcon } from "lucide-react";

import Logo from "@/components/shadcn-studio/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Description placeholder
 *
 * @typedef {NavigationItem}
 */
type NavigationItem = {
  title: string;
  href: string;
}[];

/**
 * Description placeholder
 *
 * @param {{ navigationData: NavigationItem }} param0
 * @param {{}} param0.navigationData
 * @returns {*}
 */
const Navbar = ({
  navigationData,
}: {
  navigationData: NavigationItem;
}): JSX.Element => {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <div className="flex flex-1 items-center gap-8 font-medium text-muted-foreground md:justify-center lg:gap-16">
          <a href="#" className="hover:text-primary max-md:hidden">
            Home
          </a>
          <a href="#" className="hover:text-primary max-md:hidden">
            Products
          </a>
          <a href="#">
            <Logo className="gap-3 text-foreground" />
          </a>
          <a href="#" className="hover:text-primary max-md:hidden">
            About Us
          </a>
          <a href="#" className="hover:text-primary max-md:hidden">
            Contacts
          </a>
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <a href={item.href}>{item.title}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
