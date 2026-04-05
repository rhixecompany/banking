import { LanguagesIcon } from "lucide-react";
import { redirect } from "next/navigation";

import AdminSidebar from "@/components/layouts/admin-sidebar";
import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";
import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @async
 * @param {{
 *   children: React.ReactNode;
 * }} param0
 * @param {React.ReactNode} param0.children
 * @returns {Promise<React.JSX.Element>}
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!session.user.isAdmin) {
    redirect("/dashboard");
  }

  const user = {
    email: session.user.email ?? "",
    image: session.user.image ?? null,
    name: session.user.name ?? "Admin",
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-dvh w-full">
      <SidebarProvider>
        <AdminSidebar user={user} />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-50 border-b bg-card">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="[&_svg]:!size-5" />
                <Separator
                  orientation="vertical"
                  className="hidden !h-4 sm:block"
                />
                <Breadcrumb className="hidden sm:block">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Admin</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-1.5">
                <LanguageDropdown
                  trigger={
                    <Button variant="ghost" size="icon">
                      <LanguagesIcon />
                    </Button>
                  }
                />
                <ProfileDropdown
                  name={user.name}
                  email={user.email}
                  image={user.image}
                  trigger={
                    <Button variant="ghost" size="icon" className="size-9.5">
                      <Avatar className="size-9.5 rounded-md">
                        {user.image && (
                          <AvatarImage src={user.image} alt={user.name} />
                        )}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
              </div>
            </div>
          </header>

          {children}

          <footer>
            <div className="mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 text-muted-foreground max-sm:flex-col sm:gap-6 sm:px-6">
              <p className="text-sm text-balance max-sm:text-center">
                {`©${new Date().getFullYear()}`}{" "}
                <span className="text-primary">Horizon</span>, Made for better
                banking
              </p>
            </div>
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
}
