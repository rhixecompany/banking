import { LanguagesIcon } from "lucide-react";
import { Suspense } from "react";

import AdminSidebar from "@/components/layouts/admin-sidebar";
import AdminLayoutWrapper from "@/components/layouts/AdminLayoutWrapper";
import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";
import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";

// Current year - evaluated at build time to avoid prerender errors
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Admin page loading skeleton
 */
function AdminLoadingFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {{
 *   children: React.ReactNode;
 * }} param0
 * @param {React.ReactNode} param0.children
 * @returns {unknown}
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AdminLayoutWrapper performs authentication and admin gating server-side
  return (
    <AdminLayoutWrapper>
      <div className="flex min-h-dvh w-full">
        <SidebarProvider>
          <AdminSidebar
            user={{ email: "admin@example.com", image: null, name: "Admin" }}
          />
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
                    name={"Admin"}
                    email={"admin@example.com"}
                    image={null}
                    trigger={
                      <Button variant="ghost" size="icon" className="size-9.5">
                        <Avatar className="size-9.5 rounded-md">
                          <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                      </Button>
                    }
                  />
                </div>
              </div>
            </header>

            <Suspense fallback={<AdminLoadingFallback />}>{children}</Suspense>

            <footer>
              <div className="mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 text-muted-foreground max-sm:flex-col sm:gap-6 sm:px-6">
                <p className="text-sm text-balance max-sm:text-center">
                  {`©${CURRENT_YEAR}`}{" "}
                  <span className="text-primary">Horizon</span>, Made for better
                  banking
                </p>
              </div>
            </footer>
          </div>
        </SidebarProvider>
      </div>
    </AdminLayoutWrapper>
  );
}
