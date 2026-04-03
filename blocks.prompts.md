---
description:""
---

# List of r

## First prompt

Create a Shadcn block in the codebase.

The codebase should support following:

- Shadcn project structure
- React ^19
- Tailwind CSS ^4
- TypeScript ^5

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind CSS v4 or Typescript.

Here are the files for the block component:

File path: app/onboarding-feed-01/page.tsx npx shadcn@latest add @ss-blocks/onboarding-feed-01

```tsx
import OnboardingFeed from "@/components/shadcn-studio/blocks/onboarding-feed-01/onboarding-feed-01";

const OnboardingFeedPage = () => {
  return (
    <div className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <OnboardingFeed />
        </div>
      </div>
    </div>
  );
};

export default OnboardingFeedPage;
```

File path: components/shadcn-studio/blocks/onboarding-feed-01/onboarding-feed-01.tsx

```tsx
"use client";

import { useState } from "react";

import {
  CircleDashedIcon,
  LogIn,
  ImportIcon,
  PlusIcon,
  CircleCheckIcon
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const items = [
  {
    title: "Sign up and create an account",
    content: `To get started, log in with your organization account from your company.`,
    icon: LogIn,
    label: "Sign up"
  },
  {
    title: "Import your data",
    content:
      "Connect your database to the new workspace by using one of 20+ database connectors.",
    icon: ImportIcon,
    label: "Import"
  },
  {
    title: "Create your first report",
    content:
      "Use our drag-and-drop report builder to create your first report and share it with your team.",
    icon: PlusIcon,
    label: "Create"
  }
];

function OnboardingFeed() {
  const [active, setActive] = useState<string>("item-1");
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const handleOpenChange = (val: string) => {
    setActive(val);
  };

  const handleComplete = (index: number) => {
    setCompleted(prev => {
      const next = new Set(prev);

      next.add(index);

      return next;
    });

    const nextIndex = index + 1;

    if (nextIndex < items.length) {
      setActive(`item-${nextIndex + 1}`);
    } else {
      setActive("");
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Hello, John !</CardTitle>
        <CardDescription>
          Let&apos;s set up your first data workspace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2"
          value={active}
          onValueChange={handleOpenChange}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            const isCompleted = completed.has(index);

            return (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="rounded-md border!"
              >
                <AccordionTrigger className="px-5">
                  <span className="flex items-center gap-2">
                    {isCompleted ? (
                      <CircleCheckIcon className="size-4 shrink-0" />
                    ) : (
                      <CircleDashedIcon className="size-4 shrink-0" />
                    )}
                    <span>{item.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground flex flex-col items-start gap-2 px-5">
                  {item.content}
                  <Button
                    size="sm"
                    onClick={() => handleComplete(index)}
                    disabled={
                      isCompleted ||
                      !(index === 0 || completed.has(index - 1))
                    }
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <div className="flex justify-end gap-2">
          <Button className="flex-1 max-sm:w-full" variant="outline">
            Cancel
          </Button>
          <Button className="flex-1 max-sm:w-full" type="submit">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default OnboardingFeed;
```

Instructions to follow:

- Install all listed dependencies and devDependencies using package manager used in the project (npm, yarn, pnpm, etc.)
- Install the required shadcn/ui components using the shadcn CLI using package manager used in the project (npx, pnpm dlx, bunx --bun, etc.)
- Add any CSS variables and styles to the `globals.css` file of this project (just add styles that are listed, no need to add extra styles or variables)
- Create the files with the exact paths provided
- Ensure all imports are correctly configured
- The component should be fully functional and styled according to the provided code
- Now you can use this component in your project

Important: File paths for components, utils, ui, lib, and hooks may vary depending on the project structure. Always check the project's `components.json` file to determine the correct import paths and folder structure. Update all import statements and file paths in the provided code to match the project's configuration before implementing the block.

## Second prompt

Create a Shadcn block in the codebase.

The codebase should support following:

- Shadcn project structure
- React ^19
- Tailwind CSS ^4
- TypeScript ^5

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind CSS v4 or Typescript.

Here are the files for the block component: npx shadcn@latest add @ss-blocks/hero-section-41 File path: app/hero-section-41/page.tsx

```tsx
import Header from "@/components/shadcn-studio/blocks/hero-section-41/header";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41";
import type { NavigationSection } from "@/components/shadcn-studio/blocks/menu-navigation";

const navigationData: NavigationSection[] = [
  {
    title: "About Us",
    href: "#"
  },
  {
    title: "Testimonials",
    href: "#"
  },
  {
    title: "Contact us",
    href: "#"
  },
  {
    title: "Offers",
    href: "#"
  }
];

const menudata = [
  {
    id: 1,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-18.png",
    imgAlt: "plate-1",
    userComment:
      "The ambiance is perfect and the food is absolutely delicious. Highly recommended!",
    userAvatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-56.png"
  },
  {
    id: 2,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-19.png",
    imgAlt: "plate-2",
    userComment:
      "Best dining experience in town. The staff is friendly and the menu is exceptional.",
    userAvatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-46.png"
  },
  {
    id: 3,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-20.png",
    imgAlt: "plate-3",
    userComment:
      "Every dish is crafted with care. This place never disappoints!",
    userAvatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png"
  },
  {
    id: 4,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-05.png",
    imgAlt: "plate-4",
    userComment:
      "Great atmosphere and incredible flavors. A must-visit restaurant!",
    userAvatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-58.png"
  },
  {
    id: 5,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-20.png",
    imgAlt: "plate-3",
    userComment:
      "Every dish is crafted with care. This place never disappoints!",
    userAvatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png"
  }
];

const HeroSectionPage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Header Section */}
      <Header navigationData={navigationData} />

      {/* Main Content */}
      <main className="flex flex-col pt-17.5">
        <HeroSection menudata={menudata} />
      </main>
    </div>
  );
};

export default HeroSectionPage;
```

File path: assets/svg/bistro-logo.tsx

```tsx
// React Imports
import type { SVGAttributes } from "react";

const BistroLogo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      <rect
        width="32"
        height="32"
        rx="16"
        transform="matrix(1 0 0 -1 0 32)"
        fill="var(--primary)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6335 9.37402C12.4778 9.37402 14.145 10.1271 15.3467 11.3418L11.8436 14.8456C10.6136 14.0151 8.62354 14.2897 7.48627 17.2828C7.42492 17.4438 7.36357 17.6049 7.30222 17.7659C7.03765 18.4622 7.17875 19.1777 7.67952 19.6785C8.18029 20.1785 8.89578 20.3196 9.59133 20.055L10.0752 19.8717C13.0683 18.7345 13.3429 16.7444 12.5123 15.5144L15.964 12.0627C17.1427 10.884 17.9019 10.0979 19.5499 9.62786C20.1289 9.46298 20.7401 9.37402 21.372 9.37402C25.0338 9.37402 28.0016 12.3426 28.0016 16.0044C28.0016 19.6662 25.0338 22.634 21.372 22.634C19.5545 22.634 17.908 21.9024 16.7102 20.7183L19.961 17.4683C20.237 17.6302 20.5515 17.7007 20.8919 17.6754C21.3804 17.6386 21.7869 17.4139 22.0768 17.019L24.9456 13.1217L24.7892 12.9653L21.8375 15.9162C21.7884 15.966 21.7071 15.966 21.658 15.9162C21.609 15.8671 21.609 15.7858 21.658 15.7368L24.6097 12.7851L24.382 12.5581L21.4311 15.5098C21.3812 15.5588 21.3007 15.5588 21.2508 15.5098C21.2018 15.4599 21.2018 15.3794 21.2508 15.3295L24.2025 12.3779L23.9748 12.1509L21.0238 15.1026C20.974 15.1516 20.8935 15.1516 20.8436 15.1026C20.7945 15.0527 20.7945 14.9722 20.8436 14.9223L23.7953 11.9714L23.6473 11.8234C23.5906 11.8556 23.5346 11.8917 23.4809 11.9308L19.7416 14.6831C19.3467 14.9737 19.122 15.3794 19.0852 15.8679C19.0591 16.2084 19.1297 16.5228 19.2922 16.7996L16.086 20.0059C15.0614 20.953 14.3168 21.6915 13.0177 22.1923C12.2784 22.4776 11.474 22.634 10.6335 22.634C6.97246 22.634 4.00391 19.6662 4.00391 16.0044C4.00391 12.3426 6.97246 9.37402 10.6335 9.37402Z"
        fill="var(--primary-foreground)"
      />
    </svg>
  );
};

export default BistroLogo;
```

File path: components/shadcn-studio/blocks/hero-section-41/header.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

import { CalendarClockIcon, MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import MenuDropdown from "@/components/shadcn-studio/blocks/menu-dropdown";
import MenuNavigation from "@/components/shadcn-studio/blocks/menu-navigation";
import type { NavigationSection } from "@/components/shadcn-studio/blocks/menu-navigation";

import { cn } from "@/lib/utils";

import BistroLogo from "@/assets/svg/bistro-logo";

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

const Header = ({ navigationData, className }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 h-17.5 w-full border-b transition-all duration-300",
        {
          "bg-background shadow-md": isScrolled
        },
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <BistroLogo />
          <span className="text-primary text-[20px] font-semibold">
            Bistro
          </span>
        </a>

        {/* Navigation */}
        <MenuNavigation
          navigationData={navigationData}
          className="max-lg:hidden [&_[data-slot=navigation-menu-list]]:gap-1"
        />

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="rounded-full max-sm:hidden" asChild>
            <a href="#">Book table</a>
          </Button>

          {/* Navigation for small screens */}
          <div className="flex gap-3">
            <Button
              size="icon"
              className="rounded-full sm:hidden"
              asChild
            >
              <a href="#">
                <CalendarClockIcon />
                <span className="sr-only">Book table</span>
              </a>
            </Button>

            <MenuDropdown
              align="end"
              navigationData={navigationData}
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full lg:hidden"
                >
                  <MenuIcon />
                  <span className="sr-only">Menu</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

File path: components/shadcn-studio/blocks/hero-section-41/hero-section-41.tsx

```tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { ArrowRightIcon } from "lucide-react";

import Autoplay from "embla-carousel-autoplay";

import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type MenuData = {
  id: number;
  img: string;
  imgAlt: string;
  userAvatar: string;
  userComment: string;
};

const HeroSection = ({ menudata }: { menudata: MenuData[] }) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [commentsApi, setCommentsApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!mainApi) {
      return;
    }

    setCurrent(mainApi.selectedScrollSnap());
    mainApi.on("select", () => {
      const selectedIndex = mainApi.selectedScrollSnap();

      setCurrent(selectedIndex);

      // Sync all carousels with main carousel
      thumbApi?.scrollTo(selectedIndex);
      commentsApi?.scrollTo(selectedIndex);
    });
  }, [mainApi, thumbApi, commentsApi]);

  useEffect(() => {
    if (!thumbApi) {
      return;
    }

    thumbApi.on("select", () => {
      const selectedIndex = thumbApi.selectedScrollSnap();

      setCurrent(selectedIndex);

      // Sync main and comments carousel with thumbnail carousel
      mainApi?.scrollTo(selectedIndex);
      commentsApi?.scrollTo(selectedIndex);
    });
  }, [thumbApi, mainApi, commentsApi]);

  useEffect(() => {
    if (!commentsApi) {
      return;
    }

    commentsApi.on("select", () => {
      const selectedIndex = commentsApi.selectedScrollSnap();

      setCurrent(selectedIndex);

      // Sync main and thumbnail carousel with comments carousel
      mainApi?.scrollTo(selectedIndex);
      thumbApi?.scrollTo(selectedIndex);
    });
  }, [commentsApi, mainApi, thumbApi]);

  const handleThumbClick = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi]
  );

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <section className="flex-1 py-12 sm:py-16 lg:py-24">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="grid grid-cols-1 gap-6 gap-y-12 md:gap-y-16 lg:grid-cols-5">
          <div className="flex w-full flex-col justify-center gap-5 max-lg:items-center lg:col-span-3 lg:h-95.5">
            <h1 className="text-3xl leading-[1.29167] font-semibold text-balance max-lg:text-center sm:text-4xl lg:text-5xl">
              Savor the taste of perfection
            </h1>

            <p className="text-muted-foreground max-w-xl text-xl max-lg:text-center">
              Welcome to Restaurant where passion meets the plate.From
              sizzling appetisers to signature desserts, every dish is
              crafted to delight your senses.
            </p>

            <div className="flex items-center gap-4">
              <Button
                asChild
                size="lg"
                className="group relative w-fit overflow-hidden rounded-full text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] has-[>svg]:px-6 dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
              >
                <a href="#">
                  Order now
                  <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button
                size="lg"
                asChild
                className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-base"
              >
                <a href="#">Book table</a>
              </Button>
            </div>
          </div>

          <Carousel
            className="w-full lg:col-span-2"
            setApi={setMainApi}
            plugins={[plugin.current]}
            opts={{
              loop: true
            }}
          >
            <CarouselContent>
              {menudata.map(item => (
                <CarouselItem
                  key={item.id}
                  className="flex w-full items-center justify-center"
                >
                  <img
                    src={item.img}
                    alt={item.imgAlt}
                    className="obeh size-95 object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="grid grid-cols-1 gap-24 gap-y-12 md:gap-y-16 lg:grid-cols-5">
          <Carousel
            className="relative w-full max-lg:order-2 lg:col-span-3"
            setApi={setThumbApi}
            opts={{
              loop: true
            }}
          >
            <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-1 w-25 bg-gradient-to-r via-85% to-transparent" />
            <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-1 w-25 bg-gradient-to-l via-85% to-transparent" />
            <CarouselContent className="my-1 flex">
              {menudata.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className={cn(
                    "basis-1/2 cursor-pointer sm:basis-1/3 md:basis-1/4 lg:basis-1/3 xl:basis-1/4"
                  )}
                  onClick={() => handleThumbClick(index)}
                >
                  <div className="relative flex h-33 items-center justify-center">
                    <div
                      className={cn(
                        "absolute bottom-0 -z-1",
                        current === index
                          ? "text-primary"
                          : "text-border"
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="161"
                        height="92"
                        viewBox="0 0 161 92"
                        fill="none"
                      >
                        <path
                          d="M0.682517 80.6118L0.501193 39.6946C0.480127 34.9409 3.80852 30.8294 8.46241 29.8603L148.426 0.713985C154.636 -0.579105 160.465 4.16121 160.465 10.504V80.7397C160.465 86.2674 155.98 90.7465 150.453 90.7397L10.6701 90.5674C5.16936 90.5607 0.706893 86.1125 0.682517 80.6118Z"
                          stroke="currentColor"
                        />
                      </svg>
                    </div>
                    <img
                      src={item.img}
                      alt={item.imgAlt}
                      className="size-25"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Carousel
            className="flex w-full items-center justify-center lg:col-span-2"
            setApi={setCommentsApi}
            opts={{
              loop: true
            }}
          >
            <CarouselContent>
              {menudata.map(item => (
                <CarouselItem
                  key={item.id}
                  className="flex h-full min-h-14 w-full justify-center gap-4 px-6 lg:items-center"
                >
                  <img
                    src={item.userAvatar}
                    alt={item.imgAlt}
                    className="border-background size-10 rounded-full border-4 drop-shadow-lg"
                  />
                  <Separator
                    orientation="vertical"
                    className="bg-primary hidden !h-6 !w-0.5 !rounded-full sm:block"
                  />
                  <p className="text-card-foreground">
                    {item.userComment}
                  </p>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
```

File path: components/shadcn-studio/blocks/menu-dropdown.tsx

```tsx
"use client";

import type { ReactNode } from "react";

import { ChevronRightIcon, CircleSmallIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export type NavigationItem = {
  title: string;
  href: string;
};

export type NavigationSection = {
  title: string;
  icon?: ReactNode;
} & (
  | {
      items: NavigationItem[];
      href?: never;
    }
  | {
      items?: never;
      href: string;
    }
);

type Props = {
  trigger: ReactNode;
  navigationData: NavigationSection[];
  align?: "center" | "end" | "start";
};

const MenuDropdown = ({
  trigger,
  navigationData,
  align = "start"
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={align}>
        {navigationData.map(navItem => {
          if (navItem.href) {
            return (
              <DropdownMenuItem key={navItem.title} asChild>
                <a href={navItem.href}>
                  {navItem.icon}
                  {navItem.title}
                </a>
              </DropdownMenuItem>
            );
          }

          return (
            <Collapsible key={navItem.title} asChild>
              <DropdownMenuGroup>
                <CollapsibleTrigger asChild>
                  <DropdownMenuItem
                    onSelect={event => event.preventDefault()}
                    className="justify-between"
                  >
                    {navItem.icon}
                    <span className="flex-1">{navItem.title}</span>
                    <ChevronRightIcon className="shrink-0 transition-transform [[data-state=open]>&]:rotate-90" />
                  </DropdownMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-2">
                  {navItem.items?.map(item => (
                    <DropdownMenuItem key={item.title} asChild>
                      <a href={item.href}>
                        <CircleSmallIcon />
                        <span>{item.title}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </CollapsibleContent>
              </DropdownMenuGroup>
            </Collapsible>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuDropdown;
```

File path: components/shadcn-studio/blocks/menu-navigation.tsx

```tsx
import type { ReactNode } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

export type NavigationItem = {
  title: string;
  href: string;
};

export type NavigationSection = {
  title: string;
  icon?: ReactNode;
} & (
  | {
      items: NavigationItem[];
      href?: never;
    }
  | {
      items?: never;
      href: string;
    }
);

type MenuNavigationProps = {
  navigationData: NavigationSection[];
  className?: string;
};

const MenuNavigation = ({
  navigationData,
  className
}: MenuNavigationProps) => {
  return (
    <NavigationMenu viewport={false} className={className}>
      <NavigationMenuList className="flex-wrap justify-start gap-0">
        {navigationData.map(navItem => {
          if (navItem.href) {
            // Root link item
            return (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink
                  href={navItem.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-muted-foreground hover:text-primary dark:hover:bg-accent/50 bg-transparent px-3 py-1.5 text-base!"
                  )}
                >
                  {navItem.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          // Section with dropdown
          return (
            <NavigationMenuItem key={navItem.title}>
              <NavigationMenuTrigger className="dark:data-[state=open]:hover:bg-accent/50 text-muted-foreground hover:text-primary dark:hover:bg-accent/50 bg-transparent px-3 py-1.5 text-base [&>svg]:size-4">
                {navItem.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="data-[motion=from-start]:slide-in-from-left-30! data-[motion=to-start]:slide-out-to-left-30! data-[motion=from-end]:slide-in-from-right-30! data-[motion=to-end]:slide-out-to-right-30! absolute w-auto">
                <ul className="grid w-38 gap-4">
                  <li>
                    {navItem.items?.map(item => (
                      <NavigationMenuLink
                        key={item.title}
                        href={item.href}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    ))}
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuNavigation;
```

Instructions to follow:

- Install all listed dependencies and devDependencies using package manager used in the project (npm, yarn, pnpm, etc.)
- Install the required shadcn/ui components using the shadcn CLI using package manager used in the project (npx, pnpm dlx, bunx --bun, etc.)
- Add any CSS variables and styles to the `globals.css` file of this project (just add styles that are listed, no need to add extra styles or variables)
- Create the files with the exact paths provided
- Ensure all imports are correctly configured
- The component should be fully functional and styled according to the provided code
- Now you can use this component in your project

Important: File paths for components, utils, ui, lib, and hooks may vary depending on the project structure. Always check the project's `components.json` file to determine the correct import paths and folder structure. Update all import statements and file paths in the provided code to match the project's configuration before implementing the block.

## Third prompt

Create a Shadcn block in the codebase.

The codebase should support following:

- Shadcn project structure
- React ^19
- Tailwind CSS ^4
- TypeScript ^5

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind CSS v4 or Typescript.

Here are the files for the block component:

File path: app/dashboard-shell-01/page.tsx npx shadcn@latest add @ss-blocks/dashboard-shell-01

```tsx
import {
  ArrowRightLeftIcon,
  CalendarClockIcon,
  CalendarX2Icon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
  ChartSplineIcon,
  ClipboardListIcon,
  Clock9Icon,
  CrownIcon,
  FacebookIcon,
  HashIcon,
  InstagramIcon,
  LanguagesIcon,
  LinkedinIcon,
  SettingsIcon,
  SquareActivityIcon,
  TriangleAlertIcon,
  TruckIcon,
  TwitterIcon,
  Undo2Icon,
  UsersIcon
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";

import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";
import ProductInsightsCard from "@/components/shadcn-studio/blocks/widget-product-insights";
import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";
import SalesMetricsCard from "@/components/shadcn-studio/blocks/chart-sales-metrics";
import StatisticsCard from "@/components/shadcn-studio/blocks/statistics-card-01";
import TotalEarningCard from "@/components/shadcn-studio/blocks/widget-total-earning";
import TransactionDatatable, {
  type Item
} from "@/components/shadcn-studio/blocks/datatable-transaction";

// Statistics card data
const StatisticsCardData = [
  {
    icon: <TruckIcon className="size-4" />,
    value: "42",
    title: "Shipped Orders",
    changePercentage: "+18.2%"
  },
  {
    icon: <TriangleAlertIcon className="size-4" />,
    value: "8",
    title: "Damaged Returns",
    changePercentage: "-8.7%"
  },
  {
    icon: <CalendarX2Icon className="size-4" />,
    value: "27",
    title: "Missed Delivery Slots",
    changePercentage: "+4.3%"
  }
];

// Earning data for Total Earning card
const earningData = [
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/zipcar.png",
    platform: "Zipcar",
    technologies: "Vuejs & HTML",
    earnings: "-$23,569.26",
    progressPercentage: 75
  },
  {
    img: "https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/bitbank.png",
    platform: "Bitbank",
    technologies: "Figma & React",
    earnings: "-$12,650.31",
    progressPercentage: 25
  }
];

// Transaction table data
const transactionData: Item[] = [
  {
    id: "1",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
    avatarFallback: "JA",
    name: "Jack Alfredo",
    amount: 316.0,
    status: "paid",
    email: "jack@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "2",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    avatarFallback: "MG",
    name: "Maria Gonzalez",
    amount: 253.4,
    status: "pending",
    email: "maria.g@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "3",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    avatarFallback: "JD",
    name: "John Doe",
    amount: 852.0,
    status: "paid",
    email: "john.doe@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "4",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
    avatarFallback: "EC",
    name: "Emily Carter",
    amount: 889.0,
    status: "pending",
    email: "emily.carter@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "5",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    avatarFallback: "DL",
    name: "David Lee",
    amount: 723.16,
    status: "paid",
    email: "david.lee@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "6",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    avatarFallback: "SP",
    name: "Sophia Patel",
    amount: 612.0,
    status: "failed",
    email: "sophia.patel@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "7",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
    avatarFallback: "RW",
    name: "Robert Wilson",
    amount: 445.25,
    status: "paid",
    email: "robert.wilson@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "8",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png",
    avatarFallback: "LM",
    name: "Lisa Martinez",
    amount: 297.8,
    status: "processing",
    email: "lisa.martinez@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "9",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png",
    avatarFallback: "MT",
    name: "Michael Thompson",
    amount: 756.9,
    status: "paid",
    email: "michael.thompson@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "10",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png",
    avatarFallback: "AJ",
    name: "Amanda Johnson",
    amount: 189.5,
    status: "pending",
    email: "amanda.johnson@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "11",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png",
    avatarFallback: "KB",
    name: "Kevin Brown",
    amount: 1024.75,
    status: "paid",
    email: "kevin.brown@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "12",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-12.png",
    avatarFallback: "SD",
    name: "Sarah Davis",
    amount: 367.2,
    status: "failed",
    email: "sarah.davis@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "13",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png",
    avatarFallback: "CG",
    name: "Christopher Garcia",
    amount: 598.45,
    status: "processing",
    email: "christopher.garcia@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "14",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-14.png",
    avatarFallback: "JR",
    name: "Jennifer Rodriguez",
    amount: 821.3,
    status: "paid",
    email: "jennifer.rodriguez@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "15",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png",
    avatarFallback: "DM",
    name: "Daniel Miller",
    amount: 156.75,
    status: "pending",
    email: "daniel.miller@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "16",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png",
    avatarFallback: "NW",
    name: "Nicole White",
    amount: 934.1,
    status: "paid",
    email: "nicole.white@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "17",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-17.png",
    avatarFallback: "AL",
    name: "Anthony Lopez",
    amount: 412.85,
    status: "failed",
    email: "anthony.lopez@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "18",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-18.png",
    avatarFallback: "MH",
    name: "Michelle Harris",
    amount: 675.5,
    status: "processing",
    email: "michelle.harris@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "19",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png",
    avatarFallback: "JC",
    name: "James Clark",
    amount: 289.95,
    status: "paid",
    email: "james.clark@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "20",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-20.png",
    avatarFallback: "RL",
    name: "Rachel Lewis",
    amount: 1156.25,
    status: "pending",
    email: "rachel.lewis@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "21",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-21.png",
    avatarFallback: "TY",
    name: "Thomas Young",
    amount: 543.6,
    status: "paid",
    email: "thomas.young@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "22",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-22.png",
    avatarFallback: "SB",
    name: "Stephanie Brown",
    amount: 789.3,
    status: "processing",
    email: "stephanie.brown@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "23",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-23.png",
    avatarFallback: "BM",
    name: "Brandon Moore",
    amount: 425.75,
    status: "failed",
    email: "brandon.moore@shadcnstudio.com",
    paidBy: "visa"
  },
  {
    id: "24",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-24.png",
    avatarFallback: "KT",
    name: "Kelly Taylor",
    amount: 1203.5,
    status: "paid",
    email: "kelly.taylor@shadcnstudio.com",
    paidBy: "mastercard"
  },
  {
    id: "25",
    avatar:
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-25.png",
    avatarFallback: "MA",
    name: "Mark Anderson",
    amount: 356.2,
    status: "pending",
    email: "mark.anderson@shadcnstudio.com",
    paidBy: "visa"
  }
];

const DashboardShell = () => {
  return (
    <div className="flex min-h-dvh w-full">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ChartNoAxesCombinedIcon />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="bg-primary/10 rounded-full">
                      5
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Pages</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ChartSplineIcon />
                        <span>Content Performance</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <UsersIcon />
                        <span>Audience Insight</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ChartPieIcon />
                        <span>Engagement Metrics</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <HashIcon />
                        <span>Hashtag Performance</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="bg-primary/10 rounded-full">
                      3
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ArrowRightLeftIcon />
                        <span>Competitor Analysis</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Clock9Icon />
                        <span>Campaign Tracking</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ClipboardListIcon />
                        <span>Sentiment Tracking</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <CrownIcon />
                        <span>Influencer</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>
                Supporting Features
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <SquareActivityIcon />
                        <span>Real Time Monitoring</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <CalendarClockIcon />
                        <span>Schedule Post & Calendar</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Undo2Icon />
                        <span>Report & Export</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <SettingsIcon />
                        <span>Settings & Integrations</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <UsersIcon />
                        <span>User Management</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="bg-card sticky top-0 z-50 border-b">
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
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Free</BreadcrumbPage>
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
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9.5"
                    >
                      <Avatar className="size-9.5 rounded-md">
                        <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
              </div>
            </div>
          </header>
          <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {/* Statistics Cards */}
              <div className="col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1">
                {StatisticsCardData.map((card, index) => (
                  <StatisticsCard
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    value={card.value}
                    changePercentage={card.changePercentage}
                  />
                ))}
              </div>

              <div className="grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2">
                {/* Product Insights Card */}
                <ProductInsightsCard className="justify-between gap-3 [&>[data-slot=card-content]]:space-y-5" />

                {/* Total Earning Card */}
                <TotalEarningCard
                  title="Total Earning"
                  earning={24650}
                  trend="up"
                  percentage={10}
                  comparisonText="Compare to last year ($84,325)"
                  earningData={earningData}
                  className="justify-between gap-5 sm:min-w-0 [&>[data-slot=card-content]]:space-y-7"
                />
              </div>

              <SalesMetricsCard className="col-span-full xl:col-span-2 [&>[data-slot=card-content]]:space-y-6" />

              <Card className="col-span-full w-full py-0">
                <TransactionDatatable data={transactionData} />
              </Card>
            </div>
          </main>
          <footer>
            <div className="text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
              <p className="text-sm text-balance max-sm:text-center">
                {`©${new Date().getFullYear()}`}{" "}
                <a href="#" className="text-primary">
                  shadcn/studio
                </a>
                , Made for better web design
              </p>
              <div className="flex items-center gap-5">
                <a href="#">
                  <FacebookIcon className="size-4" />
                </a>
                <a href="#">
                  <InstagramIcon className="size-4" />
                </a>
                <a href="#">
                  <LinkedinIcon className="size-4" />
                </a>
                <a href="#">
                  <TwitterIcon className="size-4" />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardShell;
```

File path: components/shadcn-studio/blocks/chart-sales-metrics.tsx

```tsx
"use client";

import {
  BadgePercentIcon,
  ChartNoAxesCombinedIcon,
  CirclePercentIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  TrendingUpIcon
} from "lucide-react";

import { Bar, BarChart, Label, Pie, PieChart } from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const salesPlanPercentage = 54;
const totalBars = 24;
const filledBars = Math.round(
  (salesPlanPercentage * totalBars) / 100
);

// Sales chart data
const salesChartData = Array.from(
  { length: totalBars },
  (_, index) => {
    const date = new Date(2025, 5, 15);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    return {
      date: formattedDate,
      sales: index < filledBars ? 315 : 0
    };
  }
);

const salesChartConfig = {
  sales: {
    label: "Sales"
  }
} satisfies ChartConfig;

const MetricsData = [
  {
    icons: <TrendingUpIcon className="size-5" />,
    title: "Sales trend",
    value: "$11,548"
  },
  {
    icons: <BadgePercentIcon className="size-5" />,
    title: "Discount offers",
    value: "$1,326"
  },
  {
    icons: <DollarSignIcon className="size-5" />,
    title: "Net profit",
    value: "$17,356"
  },
  {
    icons: <ShoppingBagIcon className="size-5" />,
    title: "Total orders",
    value: "248"
  }
];

const revenueChartData = [
  { month: "january", sales: 340, fill: "var(--color-january)" },
  { month: "february", sales: 200, fill: "var(--color-february)" },
  { month: "march", sales: 200, fill: "var(--color-march)" }
];

const revenueChartConfig = {
  sales: {
    label: "Sales"
  },
  january: {
    label: "January",
    color: "var(--primary)"
  },
  february: {
    label: "February",
    color: "color-mix(in oklab, var(--primary) 60%, transparent)"
  },
  march: {
    label: "March",
    color: "color-mix(in oklab, var(--primary) 20%, transparent)"
  }
} satisfies ChartConfig;

const SalesMetricsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardContent className="space-y-4">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-7 lg:col-span-3">
            <span className="text-lg font-semibold">
              Sales metrics
            </span>
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.shadcnstudio.com/ss-assets/logo/logo-square.png"
                className="size-10.5 rounded-lg"
                alt="logo"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-medium">
                  Sandy&apos; Company
                </span>
                <span className="text-muted-foreground text-sm">
                  sandy@company.com
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {MetricsData.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-md border px-4 py-2"
                >
                  <Avatar className="size-8.5 rounded-sm">
                    <AvatarFallback className="bg-primary/10 text-primary shrink-0 rounded-sm">
                      {metric.icons}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted-foreground text-sm font-medium">
                      {metric.title}
                    </span>
                    <span className="text-lg font-medium">
                      {metric.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="gap-4 py-4 shadow-none lg:col-span-2">
            <CardHeader className="gap-1">
              <CardTitle className="text-lg font-semibold">
                Revenue goal
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0">
              <ChartContainer
                config={revenueChartConfig}
                className="h-38.5 w-full"
              >
                <PieChart
                  margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={revenueChartData}
                    dataKey="sales"
                    nameKey="month"
                    startAngle={300}
                    endAngle={660}
                    innerRadius={58}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (
                          viewBox &&
                          "cx" in viewBox &&
                          "cy" in viewBox
                        ) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 12}
                                className="fill-card-foreground text-lg font-medium"
                              >
                                256.24
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 19}
                                className="fill-muted-foreground text-sm"
                              >
                                Total Profit
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>

            <CardFooter className="justify-between">
              <span className="text-xl">Plan completed</span>
              <span className="text-2xl font-medium">56%</span>
            </CardFooter>
          </Card>
        </div>
        <Card className="shadow-none">
          <CardContent className="grid gap-4 px-4 lg:grid-cols-5">
            <div className="flex flex-col justify-center gap-6">
              <span className="text-lg font-semibold">
                Sales plan
              </span>
              <span className="max-lg:5xl text-6xl">
                {salesPlanPercentage}%
              </span>
              <span className="text-muted-foreground text-sm">
                Percentage profit from total sales
              </span>
            </div>
            <div className="flex flex-col gap-6 text-lg md:col-span-4">
              <span className="font-medium">
                Cohort analysis indicators
              </span>
              <span className="text-muted-foreground text-wrap">
                Analyzes the behaviour of a group of users who joined
                a product/service at the same time. over a certain
                period.
              </span>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <ChartNoAxesCombinedIcon className="size-6" />
                  <span className="text-lg font-medium">
                    Open Statistics
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CirclePercentIcon className="size-6" />
                  <span className="text-lg font-medium">
                    Percentage Change
                  </span>
                </div>
              </div>

              <ChartContainer
                config={salesChartConfig}
                className="h-7.75 w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={salesChartData}
                  margin={{
                    left: 0,
                    right: 0
                  }}
                  maxBarSize={16}
                >
                  <Bar
                    dataKey="sales"
                    fill="var(--primary)"
                    background={{
                      fill: "color-mix(in oklab, var(--primary) 10%, transparent)",
                      radius: 12
                    }}
                    radius={12}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default SalesMetricsCard;
```

File path: components/shadcn-studio/blocks/datatable-transaction.tsx

```tsx
"use client";

import { useState } from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon
} from "lucide-react";

import type {
  ColumnDef,
  PaginationState
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { usePagination } from "@/hooks/use-pagination";

export type Item = {
  id: string;
  avatar: string;
  avatarFallback: string;
  name: string;
  email: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "failed";
  paidBy: "mastercard" | "visa";
};

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-9">
          <AvatarImage
            src={row.original.avatar}
            alt="Hallie Richards"
          />
          <AvatarFallback className="text-xs">
            {row.original.avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm">
          <span className="text-card-foreground font-medium">
            {row.getValue("name")}
          </span>
          <span className="text-muted-foreground">
            {row.original.email}
          </span>
        </div>
      </div>
    )
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amount);

      return <span>{formatted}</span>;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className="bg-primary/10 text-primary rounded-sm px-1.5 capitalize">
        {row.getValue("status")}
      </Badge>
    )
  },
  {
    accessorKey: "paidBy",
    header: () => <span className="w-fit">Paid by</span>,
    cell: ({ row }) => (
      <img
        src={
          row.getValue("paidBy") === "mastercard"
            ? "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-1.png"
            : "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-2.png"
        }
        alt="Payment platform"
        className="w-10.5"
      />
    )
  },
  {
    id: "actions",
    header: () => "Actions",
    cell: () => <RowActions />,
    size: 60,
    enableHiding: false
  }
];

const TransactionDatatable = ({ data }: { data: Item[] }) => {
  const pageSize = 5;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    }
  });

  const { pages, showLeftEllipsis, showRightEllipsis } =
    usePagination({
      currentPage: table.getState().pagination.pageIndex + 1,
      totalPages: table.getPageCount(),
      paginationItemsToDisplay: 2
    });

  return (
    <div className="w-full">
      <div className="border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground h-14 first:pl-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="first:pl-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
        <p
          className="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          Showing{" "}
          <span>
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0
              ),
              table.getRowCount()
            )}
          </span>{" "}
          of <span>{table.getRowCount().toString()} entries</span>
        </p>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  className="disabled:pointer-events-none disabled:opacity-50"
                  variant={"ghost"}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                  Previous
                </Button>
              </PaginationItem>

              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pages.map(page => {
                const isActive =
                  page === table.getState().pagination.pageIndex + 1;

                return (
                  <PaginationItem key={page}>
                    <Button
                      size="icon"
                      className={`${!isActive && "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"}`}
                      onClick={() => table.setPageIndex(page - 1)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}

              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  className="disabled:pointer-events-none disabled:opacity-50"
                  variant={"ghost"}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  Next
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default TransactionDatatable;

function RowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-2"
            aria-label="Edit item"
          >
            <EllipsisVerticalIcon
              className="size-5"
              aria-hidden="true"
            />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

File path: components/shadcn-studio/blocks/dropdown-language.tsx

```tsx
"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

const LanguageDropdown = ({ defaultOpen, align, trigger }: Props) => {
  const [language, setLanguage] = useState("english");

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align={align || "end"}>
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={setLanguage}
        >
          <DropdownMenuRadioItem
            value="english"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="german"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            Deutsch
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="spanish"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            Española
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="portuguese"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            Português
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="korean"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            한국인
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
```

File path: components/shadcn-studio/blocks/dropdown-profile.tsx

```tsx
import type { ReactNode } from "react";

import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  UsersIcon,
  SquarePenIcon,
  CirclePlusIcon,
  LogOutIcon
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

const ProfileDropdown = ({
  trigger,
  defaultOpen,
  align = "end"
}: Props) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align || "end"}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage
                src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">
              John Doe
            </span>
            <span className="text-muted-foreground text-base">
              john.doe@example.com
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <UserIcon className="text-foreground size-5" />
            <span>My account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <SettingsIcon className="text-foreground size-5" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <CreditCardIcon className="text-foreground size-5" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <UsersIcon className="text-foreground size-5" />
            <span>Manage team</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <SquarePenIcon className="text-foreground size-5" />
            <span>Customization</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <CirclePlusIcon className="text-foreground size-5" />
            <span>Add team account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="px-4 py-2.5 text-base"
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
```

File path: components/shadcn-studio/blocks/statistics-card-01.tsx

```tsx
import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { cn } from "@/lib/utils";

// Statistics card data type
type StatisticsCardProps = {
  icon: ReactNode;
  value: string;
  title: string;
  changePercentage: string;
  className?: string;
};

const StatisticsCard = ({
  icon,
  value,
  title,
  changePercentage,
  className
}: StatisticsCardProps) => {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader className="flex items-center">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
          {icon}
        </div>
        <span className="text-2xl">{value}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="font-semibold">{title}</span>
        <p className="space-x-2">
          <span className="text-sm">{changePercentage}</span>
          <span className="text-muted-foreground text-sm">
            than last week
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
```

File path: components/shadcn-studio/blocks/widget-product-insights.tsx

```tsx
"use client";

import { Bar, BarChart } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

// Product reached data
const productReachChartData = [
  { month: "January", reached: 168 },
  { month: "February", reached: 305 },
  { month: "March", reached: 213 },
  { month: "April", reached: 330 },
  { month: "May", reached: 305 }
];

const productReachChartConfig = {
  reached: {
    label: "Reached",
    color: "var(--primary)"
  }
} satisfies ChartConfig;

// Order placed data
const orderPlacedChartData = [
  { month: "January", orders: 168 },
  { month: "February", orders: 305 },
  { month: "March", orders: 213 },
  { month: "April", orders: 330 },
  { month: "May", orders: 305 }
];

const orderPlacedChartConfig = {
  orders: {
    label: "Orders",
    color: "color-mix(in oklab, var(--primary) 10%, transparent)"
  }
} satisfies ChartConfig;

const ProductInsightsCard = ({
  className
}: {
  className?: string;
}) => {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader className="flex justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">
            Product insight
          </span>
          <span className="text-muted-foreground text-sm">
            Published on 12 MAY 2025 - 6:10 PM
          </span>
        </div>
        <img
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/image-7.png"
          alt="Product"
          className="w-20.5 rounded-md"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col gap-1">
            <span className="text-xs">Product reached</span>
            <span className="text-2xl font-semibold">21,153</span>
          </div>
          <ChartContainer
            config={productReachChartConfig}
            className="min-h-13 max-w-18"
          >
            <BarChart
              accessibilityLayer
              data={productReachChartData}
              barSize={8}
            >
              <Bar
                dataKey="reached"
                fill="var(--color-reached)"
                radius={2}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col gap-1">
            <span className="text-xs">Order placed </span>
            <span className="text-2xl font-semibold">2,123</span>
          </div>
          <ChartContainer
            config={orderPlacedChartConfig}
            className="min-h-13 max-w-18"
          >
            <BarChart
              accessibilityLayer
              data={orderPlacedChartData}
              barSize={8}
            >
              <Bar
                dataKey="orders"
                fill="var(--color-orders)"
                radius={2}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInsightsCard;
```

File path: components/shadcn-studio/blocks/widget-total-earning.tsx

```tsx
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const listItems = ["Share", "Update", "Refresh"];

type Props = {
  title: string;
  earning: number;
  trend: "up" | "down";
  percentage: number;
  comparisonText: string;
  earningData: {
    img: string;
    platform: string;
    technologies: string;
    earnings: string;
    progressPercentage: number;
  }[];
  className?: string;
};

const TotalEarningCard = ({
  earningData,
  title,
  earning,
  trend,
  percentage,
  comparisonText,
  className
}: Props) => {
  return (
    <Card className={className}>
      <CardHeader className="flex items-center justify-between">
        <span className="text-lg font-semibold">{title}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-6 rounded-full"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {listItems.map((item, index) => (
                <DropdownMenuItem key={index}>
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold">${earning}</span>
            <span className="flex items-center gap-1">
              {trend === "up" ? (
                <ChevronUpIcon className="size-4" />
              ) : (
                <ChevronDownIcon className="size-4" />
              )}
              <span className="text-sm">{percentage}%</span>
            </span>
          </div>
          <span className="text-muted-foreground text-sm">
            {comparisonText}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-evenly gap-4">
          {earningData.map((earning, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center justify-between gap-2.5">
                <Avatar className="size-11 rounded-sm">
                  <AvatarFallback className="bg-primary/10 shrink-0 rounded-sm">
                    <img
                      src={earning.img}
                      alt={earning.platform}
                      className="size-6"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {earning.platform}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {earning.technologies}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm">{earning.earnings}</p>
                <Progress
                  value={earning.progressPercentage}
                  className="w-36"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalEarningCard;
```

File path: hooks/use-pagination.ts

```ts
type UsePaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay: number;
};

type UsePaginationReturn = {
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
};

export function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay
}: UsePaginationProps): UsePaginationReturn {
  function calculatePaginationRange(): number[] {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);

    const initialRange = {
      start: currentPage - halfDisplay,
      end: currentPage + halfDisplay
    };

    const adjustedRange = {
      start: Math.max(1, initialRange.start),
      end: Math.min(totalPages, initialRange.end)
    };

    if (adjustedRange.start === 1) {
      adjustedRange.end = Math.min(
        paginationItemsToDisplay,
        totalPages
      );
    }

    if (adjustedRange.end === totalPages) {
      adjustedRange.start = Math.max(
        1,
        totalPages - paginationItemsToDisplay + 1
      );
    }

    return Array.from(
      { length: adjustedRange.end - adjustedRange.start + 1 },
      (_, i) => adjustedRange.start + i
    );
  }

  const pages = calculatePaginationRange();

  // Determine ellipsis display based on the actual pages shown
  const showLeftEllipsis =
    pages.length > 0 && pages[0] > 1 && pages[0] > 2;

  const showRightEllipsis =
    pages.length > 0 &&
    pages[pages.length - 1] < totalPages &&
    pages[pages.length - 1] < totalPages - 1;

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis
  };
}
```

Instructions to follow:

- Install all listed dependencies and devDependencies using package manager used in the project (npm, yarn, pnpm, etc.)
- Install the required shadcn/ui components using the shadcn CLI using package manager used in the project (npx, pnpm dlx, bunx --bun, etc.)
- Add any CSS variables and styles to the `globals.css` file of this project (just add styles that are listed, no need to add extra styles or variables)
- Create the files with the exact paths provided
- Ensure all imports are correctly configured
- The component should be fully functional and styled according to the provided code
- Now you can use this component in your project

Important: File paths for components, utils, ui, lib, and hooks may vary depending on the project structure. Always check the project's `components.json` file to determine the correct import paths and folder structure. Update all import statements and file paths in the provided code to match the project's configuration before implementing the block.

## Fourth Prompt

Create a Shadcn block in the codebase.

The codebase should support following:

- Shadcn project structure
- React ^19
- Tailwind CSS ^4
- TypeScript ^5

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind CSS v4 or Typescript.

Here are the files for the block component:

File path: app/application-shell-01/page.tsx npx shadcn@latest add @ss-blocks/application-shell-01

```tsx
import {
  ArrowRightLeftIcon,
  CalendarClockIcon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
  ChartSplineIcon,
  ClipboardListIcon,
  Clock9Icon,
  CrownIcon,
  FacebookIcon,
  HashIcon,
  InstagramIcon,
  LanguagesIcon,
  LinkedinIcon,
  SettingsIcon,
  SquareActivityIcon,
  TwitterIcon,
  Undo2Icon,
  UsersIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";

import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";
import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";

const ApplicationShell = () => {
  return (
    <div className="flex min-h-dvh w-full">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ChartNoAxesCombinedIcon />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="bg-primary/10 rounded-full">
                      5
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Pages</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ChartSplineIcon />
                        <span>Content Performance</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <UsersIcon />
                        <span>Audience Insight</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ChartPieIcon />
                        <span>Engagement Metrics</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <HashIcon />
                        <span>Hashtag Performance</span>
                      </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="bg-primary/10 rounded-full">
                      3
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ArrowRightLeftIcon />
                        <span>Competitor Analysis</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Clock9Icon />
                        <span>Campaign Tracking</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <ClipboardListIcon />
                        <span>Sentiment Tracking</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <CrownIcon />
                        <span>Influencer</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>
                Supporting Features
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <SquareActivityIcon />
                        <span>Real Time Monitoring</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <CalendarClockIcon />
                        <span>Schedule Post & Calendar</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Undo2Icon />
                        <span>Report & Export</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <SettingsIcon />
                        <span>Settings & Integrations</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <UsersIcon />
                        <span>User Management</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="bg-card sticky top-0 z-50 border-b">
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
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Free</BreadcrumbPage>
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
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9.5"
                    >
                      <Avatar className="size-9.5 rounded-md">
                        <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
              </div>
            </div>
          </header>
          <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
            <Card className="h-250">
              <CardContent className="h-full">
                <div className="h-full rounded-md border bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_1px,var(--card)_2px,var(--card)_15px)]" />
              </CardContent>
            </Card>
          </main>
          <footer>
            <div className="text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
              <p className="text-sm text-balance max-sm:text-center">
                {`©${new Date().getFullYear()}`}{" "}
                <a href="#" className="text-primary">
                  shadcn/studio
                </a>
                , Made for better web design
              </p>
              <div className="flex items-center gap-5">
                <a href="#">
                  <FacebookIcon className="size-4" />
                </a>
                <a href="#">
                  <InstagramIcon className="size-4" />
                </a>
                <a href="#">
                  <LinkedinIcon className="size-4" />
                </a>
                <a href="#">
                  <TwitterIcon className="size-4" />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ApplicationShell;
```

File path: components/shadcn-studio/blocks/dropdown-language.tsx

```tsx
"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

const LanguageDropdown = ({ defaultOpen, align, trigger }: Props) => {
  const [language, setLanguage] = useState("english");

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align={align || "end"}>
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={setLanguage}
        >
          <DropdownMenuRadioItem
            value="english"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="german"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            Deutsch
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="spanish"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            Española
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="portuguese"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            Português
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="korean"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground pl-2 text-base [&>span]:hidden"
          >
            한국인
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
```

File path: components/shadcn-studio/blocks/dropdown-profile.tsx

```tsx
import type { ReactNode } from "react";

import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  UsersIcon,
  SquarePenIcon,
  CirclePlusIcon,
  LogOutIcon
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
};

const ProfileDropdown = ({
  trigger,
  defaultOpen,
  align = "end"
}: Props) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align || "end"}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage
                src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">
              John Doe
            </span>
            <span className="text-muted-foreground text-base">
              john.doe@example.com
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <UserIcon className="text-foreground size-5" />
            <span>My account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <SettingsIcon className="text-foreground size-5" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <CreditCardIcon className="text-foreground size-5" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <UsersIcon className="text-foreground size-5" />
            <span>Manage team</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <SquarePenIcon className="text-foreground size-5" />
            <span>Customization</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <CirclePlusIcon className="text-foreground size-5" />
            <span>Add team account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="px-4 py-2.5 text-base"
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
```

Instructions to follow:

- Install all listed dependencies and devDependencies using package manager used in the project (npm, yarn, pnpm, etc.)
- Install the required shadcn/ui components using the shadcn CLI using package manager used in the project (npx, pnpm dlx, bunx --bun, etc.)
- Add any CSS variables and styles to the `globals.css` file of this project (just add styles that are listed, no need to add extra styles or variables)
- Create the files with the exact paths provided
- Ensure all imports are correctly configured
- The component should be fully functional and styled according to the provided code
- Now you can use this component in your project

Important: File paths for components, utils, ui, lib, and hooks may vary depending on the project structure. Always check the project's `components.json` file to determine the correct import paths and folder structure. Update all import statements and file paths in the provided code to match the project's configuration before implementing the block.

## Sixth prompt

Create a Shadcn block in the codebase.

The codebase should support following:

- Shadcn project structure
- React ^19
- Tailwind CSS ^4
- TypeScript ^5

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind CSS v4 or Typescript.

Here are the files for the block component:

File path: app/account-settings-01/page.tsx npx shadcn@latest add @ss-blocks/account-settings-01

```tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserGeneral from "@/components/shadcn-studio/blocks/account-settings-01/account-settings-01";

const tabs = [
  { name: "General", value: "general" },
  { name: "Preferences", value: "preferences" },
  { name: "Users", value: "users" }
];

const TabsUnderlineDemo = () => {
  return (
    <div className="w-full py-8">
      <div className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="general" className="gap-4">
          <TabsList className="h-fit! w-full rounded-none border-b bg-transparent p-0 sm:justify-start">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:border-primary dark:data-[state=active]:border-primary rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none! sm:flex-0 dark:data-[state=active]:bg-transparent"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mt-4">
          <UserGeneral />
        </div>
      </div>
    </div>
  );
};

export default TabsUnderlineDemo;
```

File path: components/shadcn-studio/blocks/account-settings-01/account-settings-01.tsx

```tsx
import { Separator } from "@/components/ui/separator";

import PersonalInfo from "@/components/shadcn-studio/blocks/account-settings-01/content/personal-info";
import EmailPass from "@/components/shadcn-studio/blocks/account-settings-01/content/email-password";
import ConnectAccount from "@/components/shadcn-studio/blocks/account-settings-01/content/connect-account";
import SocialUrl from "@/components/shadcn-studio/blocks/account-settings-01/content/social-url";
import DangerZone from "@/components/shadcn-studio/blocks/account-settings-01/content/danger-zone";

const UserGeneral = () => {
  return (
    <section className="py-3">
      <div className="mx-auto max-w-7xl">
        <PersonalInfo />
        <Separator className="my-10" />
        <EmailPass />
        <Separator className="my-10" />
        <ConnectAccount />
        <Separator className="my-10" />
        <SocialUrl />
        <Separator className="my-10" />
        <DangerZone />
      </div>
    </section>
  );
};

export default UserGeneral;
```

File path: components/shadcn-studio/blocks/account-settings-01/content/connect-account.tsx

```tsx
"use client";

import { useState } from "react";

import { XIcon, PlusIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConnectedAccount {
  id: string;
  name: string;
  iconUrl: string;
}

const initialAccounts: ConnectedAccount[] = [
  {
    id: "google",
    name: "Google",
    iconUrl:
      "https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-icon.png"
  },
  {
    id: "slack",
    name: "Slack",
    iconUrl:
      "https://cdn.shadcnstudio.com/ss-assets/brand-logo/slack-icon.png"
  }
];

const ConnectedAccount = () => {
  const [connectedAccounts, setConnectedAccounts] =
    useState<ConnectedAccount[]>(initialAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [appIconUrl, setAppIconUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleRemoveAccount = (accountId: string) => {
    setConnectedAccounts(prev =>
      prev.filter(account => account.id !== accountId)
    );
  };

  const resetForm = () => {
    setAppName("");
    setAppUrl("");
    setAppIconUrl("");
    setDescription("");
  };

  const handleConnect = () => {
    if (!appName.trim() || !appUrl.trim()) return;

    const id = appName.toLowerCase().replace(/\s+/g, "-");

    setConnectedAccounts(prev => [
      ...prev,
      {
        id,
        name: appName,
        iconUrl: appIconUrl.trim() || ""
      }
    ]);

    resetForm();
    setIsDialogOpen(false);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col">
        <h3 className="text-foreground font-semibold">
          Connect Accounts
        </h3>
        <p className="text-muted-foreground text-sm">
          Manage your connected accounts.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-wrap items-center gap-4">
          {connectedAccounts.map(account => (
            <div
              key={account.id}
              className="flex w-fit items-center gap-3 rounded-md border p-2"
            >
              {account.iconUrl ? (
                <img
                  src={account.iconUrl}
                  alt={account.name}
                  className="size-4 rounded"
                />
              ) : (
                <div className="bg-muted-foreground/10 text-muted-foreground flex size-4 items-center justify-center rounded text-sm font-medium">
                  {account.name.charAt(0)}
                </div>
              )}

              <p className="text-sm font-medium">{account.name}</p>
              <Button
                size="xs"
                variant="ghost"
                className="text-primary bg-primary/10 rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                aria-label={`Remove ${account.name}`}
                onClick={() => handleRemoveAccount(account.id)}
              >
                <XIcon className="size-3" aria-hidden="true" />
              </Button>
            </div>
          ))}

          {/* Add App Button + Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-10.5"
                onClick={() => setIsDialogOpen(true)}
              >
                <PlusIcon className="size-4" />
                Add App
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect New App</DialogTitle>
                <DialogDescription>
                  Add a new integration by providing the details
                  below.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 py-2">
                <div className="grid gap-1">
                  <Label>App Name</Label>
                  <Input
                    value={appName}
                    onChange={e => setAppName(e.target.value)}
                    placeholder="e.g., Zoom"
                  />
                </div>

                <div className="grid gap-1">
                  <Label>App URL or Integration Key</Label>
                  <Input
                    value={appUrl}
                    onChange={e => setAppUrl(e.target.value)}
                    placeholder="https://app.example.com or key_abc123"
                  />
                </div>

                <div className="grid gap-1">
                  <Label>Optional Description</Label>
                  <Input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Notes about this integration (optional)"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={!appName.trim() || !appUrl.trim()}
                >
                  Connect
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground text-sm">
          Connected accounts allow you to integrate with third-party
          services for enhanced functionality.
        </p>
      </div>
    </div>
  );
};

export default ConnectedAccount;
```

File path: components/shadcn-studio/blocks/account-settings-01/content/danger-zone.tsx

```tsx
import { Trash2Icon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

const DangerZone = () => {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Danger Zone</h3>
        <p className="text-muted-foreground text-sm">
          Delete your account permanently. This action will remove all
          your data and cannot be undone{" "}
          <a
            href="#"
            className="text-card-foreground font-medium hover:underline"
          >
            Learn more
          </a>
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-4 max-lg:flex-col">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">
                  Delete account
                </h3>
                <p className="text-muted-foreground text-sm">
                  Delete your account permanently. This action will
                  remove all your data and cannot be undone.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="hover:bg-destructive/10! text-destructive! border-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-lg:w-full"
                  >
                    <Trash2Icon />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="space-y-2">
                    <DialogTitle>Delete account</DialogTitle>
                    <div className="text-muted-foreground text-sm">
                      Delete your account permanently. This action
                      will remove all your data and cannot be undone.
                    </div>
                  </DialogHeader>
                  <DialogFooter className="mt-4 gap-4 sm:justify-end">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive">Delete</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DangerZone;
```

File path: components/shadcn-studio/blocks/account-settings-01/content/email-password.tsx

```tsx
"use client";

import { useMemo, useState } from "react";

import {
  CheckIcon,
  MailIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

const requirements = [
  { regex: /.{12,}/, text: "At least 12 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[0-9]/, text: "At least 1 number" },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    text: "At least 1 special character"
  }
];

const EmailPass = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [password, setPassword] = useState("");

  const toggleVisibility = () =>
    setIsVisible(prevState => !prevState);

  const strength = requirements.map(req => ({
    met: req.regex.test(password),
    text: req.text
  }));

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length;
  }, [strength]);

  const getColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-destructive";
    if (score <= 2) return "bg-orange-500 ";
    if (score <= 3) return "bg-amber-500";
    if (score === 4) return "bg-yellow-400";

    return "bg-green-500";
  };

  const getText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score <= 3) return "Medium password";
    if (score === 4) return "Strong password";

    return "Very strong password";
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Email & Password</h3>
        <p className="text-muted-foreground text-sm">
          Manage your email and password settings.
        </p>
      </div>

      {/* Content */}
      <div className="lg:col-span-2">
        <form className="mx-auto space-y-6">
          <div className="w-full space-y-2">
            <Label htmlFor="email" className="gap-1">
              Email<span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="peer pr-9"
                required
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
                <MailIcon className="size-4" />
                <span className="sr-only">Email</span>
              </div>
            </div>
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="current-password" className="gap-1">
              Current Password
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={isVisible ? "text" : "password"}
                placeholder="Password"
                className="pr-9"
                required
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(prevState => !prevState)}
                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
              >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                <span className="sr-only">
                  {isVisible ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="new-password" className="gap-1">
              New PasswordCurrent Password
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative mb-3">
              <Input
                id="new-password"
                type={isVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pr-9"
                required
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVisibility}
                className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
              >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                <span className="sr-only">
                  {isVisible ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>

            <div className="mb-4 flex h-1 w-full gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-full flex-1 rounded-full transition-all duration-500 ease-out",
                    index < strengthScore
                      ? getColor(strengthScore)
                      : "bg-border"
                  )}
                />
              ))}
            </div>

            <p className="text-foreground text-sm font-medium">
              {getText(strengthScore)}. Must contain :
            </p>

            <ul className="mb-4 space-y-1.5">
              {strength.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  {req.met ? (
                    <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XIcon className="text-muted-foreground size-4" />
                  )}
                  <span
                    className={cn(
                      "text-xs",
                      req.met
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {req.text}
                    <span className="sr-only">
                      {req.met
                        ? " - Requirement met"
                        : " - Requirement not met"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="max-sm:w-full">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailPass;
```

File path: components/shadcn-studio/blocks/account-settings-01/content/personal-info.tsx

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { UploadCloudIcon, TrashIcon, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const countries = [
  {
    value: "india",
    label: "India",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/india.png"
  },
  {
    value: "china",
    label: "China",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/china.png"
  },
  {
    value: "monaco",
    label: "Monaco",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/monaco.png"
  },
  {
    value: "serbia",
    label: "Serbia",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/serbia.png"
  },
  {
    value: "romania",
    label: "Romania",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/romania.png"
  },
  {
    value: "mayotte",
    label: "Mayotte",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/mayotte.png"
  },
  {
    value: "iraq",
    label: "Iraq",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/iraq.png"
  },
  {
    value: "syria",
    label: "Syria",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/syria.png"
  },
  {
    value: "korea",
    label: "Korea",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/korea.png"
  },
  {
    value: "zimbabwe",
    label: "Zimbabwe",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/zimbabwe.png"
  }
];

const PersonalInfo = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      const t = window.setTimeout(() => setPreview(null), 0);

      return () => clearTimeout(t);
    }

    const url = URL.createObjectURL(file);

    const t = window.setTimeout(() => setPreview(url), 0);

    return () => {
      clearTimeout(t);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];

    if (!f) return;

    if (!f.type.startsWith("image/")) {
      window.alert("Please select an image file");
      e.currentTarget.value = "";

      return;
    }

    if (f.size > 1024 * 1024) {
      window.alert("File must be smaller than 1MB");
      e.currentTarget.value = "";

      return;
    }

    setFile(f);
  };

  const openPicker = () => inputRef.current?.click();

  const remove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">Personal Information</h3>
        <p className="text-muted-foreground text-sm">
          Manage your personal information and role.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:col-span-2">
        <form className="mx-auto">
          <div className="mb-6 w-full space-y-2">
            <Label>Your Avatar</Label>
            <div className="flex items-center gap-4">
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload your avatar"
                onClick={openPicker}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPicker();
                  }
                }}
                className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed hover:opacity-95"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={openPicker}
                  className="flex items-center gap-2"
                >
                  <UploadCloudIcon />
                  Upload avatar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={remove}
                  disabled={!file}
                  className="text-destructive"
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Pick a photo up to 1MB.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-first-name">
                First Name
              </Label>
              <Input
                id="multi-step-personal-info-first-name"
                placeholder="John"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-last-name">
                Last Name
              </Label>
              <Input
                id="multi-step-personal-info-last-name"
                placeholder="Doe"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-mobile">
                Mobile
              </Label>
              <Input
                id="multi-step-personal-info-mobile"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger
                  id="country"
                  className="[&>span_svg]:text-muted-foreground/80 w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
                >
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 max-h-100 [&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                  {countries.map(country => (
                    <SelectItem
                      key={country.value}
                      value={country.value}
                    >
                      <img
                        src={country.flag}
                        alt={`${country.label} flag`}
                        className="h-4 w-5"
                      />{" "}
                      <span className="truncate">
                        {country.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <div className="flex justify-end">
          <Button type="submit" className="max-sm:w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
```

File path: components/shadcn-studio/blocks/account-settings-01/content/social-url.tsx

```tsx
"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SocialUrl = () => {
  const [urls, setUrls] = useState<string[]>(["", "", ""]);

  const addUrl = () => setUrls(prev => [...prev, ""]);

  const updateUrl = (index: number, value: string) =>
    setUrls(prev => prev.map((u, i) => (i === index ? value : u)));

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="flex flex-col">
        <h3 className="text-foreground font-semibold">Social URLs</h3>
        <p className="text-muted-foreground text-sm">
          Manage your social URLs.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 lg:col-span-2">
        <div className="space-y-4">
          {urls.map((url, idx) => (
            <Input
              key={idx}
              type="text"
              placeholder="Link to social profile"
              value={url}
              onChange={e => updateUrl(idx, e.target.value)}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button type="button" variant="outline" onClick={addUrl}>
            <PlusIcon className="size-4" />
            Add URL
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default SocialUrl;
```

Instructions to follow:

- Install all listed dependencies and devDependencies using package manager used in the project (npm, yarn, pnpm, etc.)
- Install the required shadcn/ui components using the shadcn CLI using package manager used in the project (npx, pnpm dlx, bunx --bun, etc.)
- Add any CSS variables and styles to the `globals.css` file of this project (just add styles that are listed, no need to add extra styles or variables)
- Create the files with the exact paths provided
- Ensure all imports are correctly configured
- The component should be fully functional and styled according to the provided code
- Now you can use this component in your project

Important: File paths for components, utils, ui, lib, and hooks may vary depending on the project structure. Always check the project's `components.json` file to determine the correct import paths and folder structure. Update all import statements and file paths in the provided code to match the project's configuration before implementing the block.
