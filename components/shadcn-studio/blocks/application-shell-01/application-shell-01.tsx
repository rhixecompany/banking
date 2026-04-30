"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "#introduction" },
      { title: "Installation", href: "#installation" },
      { title: "Quick Start", href: "#quick-start" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Architecture", href: "#architecture" },
      { title: "Components", href: "#components" },
      { title: "Theming", href: "#theming" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Overview", href: "#api-overview" },
      { title: "Authentication", href: "#authentication" },
      { title: "Endpoints", href: "#endpoints" },
    ],
  },
];

const mainNavItems = [
  { title: "Dashboard", href: "#dashboard" },
  { title: "Projects", href: "#projects" },
  { title: "Team", href: "#team" },
  { title: "Calendar", href: "#calendar" },
];

function ApplicationShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-lg font-semibold">App</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)] py-4">
          <div className="px-4">
            {sidebarNavItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                <h4 className="mb-2 px-2 text-sm font-semibold">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Container */}
      <div className={cn("flex flex-1 flex-col", sidebarOpen && "pl-64")}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>

          <nav className="hidden md:flex items-center gap-6">
            {mainNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl py-10">
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight">
                Introduction
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Welcome to our comprehensive documentation. This guide will help
                you get started with our platform.
              </p>
            </div>

            <Separator className="my-8" />

            <div className="prose prose-gray max-w-none">
              <section className="mb-10">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Overview
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Our platform provides a powerful and flexible way to build
                  modern applications. With a focus on simplicity and
                  performance, we offer everything you need to create
                  exceptional user experiences.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Key Features
                </h2>
                <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Fast and responsive UI components</li>
                  <li>Comprehensive documentation</li>
                  <li>Active community support</li>
                  <li>Regular updates and improvements</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Getting Started
                </h2>
                <p className="mt-4 text-muted-foreground">
                  To get started, simply install the package and follow our
                  quick start guide. Within minutes, you&apos;ll have a fully
                  functional application up and running.
                </p>
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <code className="text-sm">npm install @our-platform/sdk</code>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ApplicationShell;
