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
  GlobeIcon,
  HashIcon,
  LanguagesIcon,
  LinkIcon,
  SettingsIcon,
  Share2Icon,
  SquareActivityIcon,
  TriangleAlertIcon,
  TruckIcon,
  Undo2Icon,
  UsersIcon,
} from "lucide-react";

import SalesMetricsCard from "@/components/shadcn-studio/blocks/chart-sales-metrics";
import TransactionDatatable, {
  type Item,
} from "@/components/shadcn-studio/blocks/datatable-transaction";
import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";
import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";
import StatisticsCard from "@/components/shadcn-studio/blocks/statistics-card-01";
import ProductInsightsCard from "@/components/shadcn-studio/blocks/widget-product-insights";
import TotalEarningCard from "@/components/shadcn-studio/blocks/widget-total-earning";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Statistics card data
/**
 * Description placeholder
 *
 * @type {{}}
 */
const StatisticsCardData = [
  {
    changePercentage: "+18.2%",
    icon: <TruckIcon className="size-4" />,
    title: "Shipped Orders",
    value: "42",
  },
  {
    changePercentage: "-8.7%",
    icon: <TriangleAlertIcon className="size-4" />,
    title: "Damaged Returns",
    value: "8",
  },
  {
    changePercentage: "+4.3%",
    icon: <CalendarX2Icon className="size-4" />,
    title: "Missed Delivery Slots",
    value: "27",
  },
];

// Earning data for Total Earning card
/**
 * Description placeholder
 *
 * @type {{}}
 */
const earningData = [
  {
    earnings: "-$23,569.26",
    img: "https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/zipcar.png",
    platform: "Zipcar",
    progressPercentage: 75,
    technologies: "Vuejs & HTML",
  },
  {
    earnings: "-$12,650.31",
    img: "https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/bitbank.png",
    platform: "Bitbank",
    progressPercentage: 25,
    technologies: "Figma & React",
  },
];

// Transaction table data
/**
 * Description placeholder
 *
 * @type {Item[]}
 */
const transactionData: Item[] = [
  {
    amount: 316.0,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
    avatarFallback: "JA",
    email: "jack@shadcnstudio.com",
    id: "1",
    name: "Jack Alfredo",
    paidBy: "mastercard",
    status: "paid",
  },
  {
    amount: 253.4,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    avatarFallback: "MG",
    email: "maria.g@shadcnstudio.com",
    id: "2",
    name: "Maria Gonzalez",
    paidBy: "visa",
    status: "pending",
  },
  {
    amount: 852.0,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    avatarFallback: "JD",
    email: "john.doe@shadcnstudio.com",
    id: "3",
    name: "John Doe",
    paidBy: "mastercard",
    status: "paid",
  },
  {
    amount: 889.0,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
    avatarFallback: "EC",
    email: "emily.carter@shadcnstudio.com",
    id: "4",
    name: "Emily Carter",
    paidBy: "visa",
    status: "pending",
  },
  {
    amount: 723.16,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
    avatarFallback: "DL",
    email: "david.lee@shadcnstudio.com",
    id: "5",
    name: "David Lee",
    paidBy: "mastercard",
    status: "paid",
  },
  {
    amount: 612.0,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
    avatarFallback: "SP",
    email: "sophia.patel@shadcnstudio.com",
    id: "6",
    name: "Sophia Patel",
    paidBy: "mastercard",
    status: "failed",
  },
  {
    amount: 445.25,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
    avatarFallback: "RW",
    email: "robert.wilson@shadcnstudio.com",
    id: "7",
    name: "Robert Wilson",
    paidBy: "visa",
    status: "paid",
  },
  {
    amount: 297.8,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png",
    avatarFallback: "LM",
    email: "lisa.martinez@shadcnstudio.com",
    id: "8",
    name: "Lisa Martinez",
    paidBy: "mastercard",
    status: "processing",
  },
  {
    amount: 756.9,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png",
    avatarFallback: "MT",
    email: "michael.thompson@shadcnstudio.com",
    id: "9",
    name: "Michael Thompson",
    paidBy: "visa",
    status: "paid",
  },
  {
    amount: 189.5,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png",
    avatarFallback: "AJ",
    email: "amanda.johnson@shadcnstudio.com",
    id: "10",
    name: "Amanda Johnson",
    paidBy: "mastercard",
    status: "pending",
  },
  {
    amount: 1024.75,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png",
    avatarFallback: "KB",
    email: "kevin.brown@shadcnstudio.com",
    id: "11",
    name: "Kevin Brown",
    paidBy: "visa",
    status: "paid",
  },
  {
    amount: 367.2,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-12.png",
    avatarFallback: "SD",
    email: "sarah.davis@shadcnstudio.com",
    id: "12",
    name: "Sarah Davis",
    paidBy: "mastercard",
    status: "failed",
  },
  {
    amount: 598.45,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png",
    avatarFallback: "CG",
    email: "christopher.garcia@shadcnstudio.com",
    id: "13",
    name: "Christopher Garcia",
    paidBy: "visa",
    status: "processing",
  },
  {
    amount: 821.3,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-14.png",
    avatarFallback: "JR",
    email: "jennifer.rodriguez@shadcnstudio.com",
    id: "14",
    name: "Jennifer Rodriguez",
    paidBy: "mastercard",
    status: "paid",
  },
  {
    amount: 156.75,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png",
    avatarFallback: "DM",
    email: "daniel.miller@shadcnstudio.com",
    id: "15",
    name: "Daniel Miller",
    paidBy: "visa",
    status: "pending",
  },
  {
    amount: 934.1,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png",
    avatarFallback: "NW",
    email: "nicole.white@shadcnstudio.com",
    id: "16",
    name: "Nicole White",
    paidBy: "mastercard",
    status: "paid",
  },
  {
    amount: 412.85,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-17.png",
    avatarFallback: "AL",
    email: "anthony.lopez@shadcnstudio.com",
    id: "17",
    name: "Anthony Lopez",
    paidBy: "visa",
    status: "failed",
  },
  {
    amount: 675.5,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-18.png",
    avatarFallback: "MH",
    email: "michelle.harris@shadcnstudio.com",
    id: "18",
    name: "Michelle Harris",
    paidBy: "mastercard",
    status: "processing",
  },
  {
    amount: 289.95,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png",
    avatarFallback: "JC",
    email: "james.clark@shadcnstudio.com",
    id: "19",
    name: "James Clark",
    paidBy: "visa",
    status: "paid",
  },
  {
    amount: 1156.25,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-20.png",
    avatarFallback: "RL",
    email: "rachel.lewis@shadcnstudio.com",
    id: "20",
    name: "Rachel Lewis",
    paidBy: "mastercard",
    status: "pending",
  },
  {
    amount: 543.6,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-21.png",
    avatarFallback: "TY",
    email: "thomas.young@shadcnstudio.com",
    id: "21",
    name: "Thomas Young",
    paidBy: "visa",
    status: "paid",
  },
  {
    amount: 789.3,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-22.png",
    avatarFallback: "SB",
    email: "stephanie.brown@shadcnstudio.com",
    id: "22",
    name: "Stephanie Brown",
    paidBy: "mastercard",
    status: "processing",
  },
  {
    amount: 425.75,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-23.png",
    avatarFallback: "BM",
    email: "brandon.moore@shadcnstudio.com",
    id: "23",
    name: "Brandon Moore",
    paidBy: "visa",
    status: "failed",
  },
  {
    amount: 1203.5,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-24.png",
    avatarFallback: "KT",
    email: "kelly.taylor@shadcnstudio.com",
    id: "24",
    name: "Kelly Taylor",
    paidBy: "mastercard",
    status: "paid",
  },
  {
    amount: 356.2,
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-25.png",
    avatarFallback: "MA",
    email: "mark.anderson@shadcnstudio.com",
    id: "25",
    name: "Mark Anderson",
    paidBy: "visa",
    status: "pending",
  },
];

/**
 * Description placeholder
 *
 * @returns {*}
 */

const DashboardShell = (): JSX.Element => {
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
                    <SidebarMenuBadge className="rounded-full bg-primary/10">
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
                    <SidebarMenuBadge className="rounded-full bg-primary/10">
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
              <SidebarGroupLabel>Supporting Features</SidebarGroupLabel>
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
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
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
                    <Button variant="ghost" size="icon" className="size-9.5">
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
            <div className="mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 text-muted-foreground max-sm:flex-col sm:gap-6 sm:px-6">
              <p className="text-sm text-balance max-sm:text-center">
                {`©${2026}`}{" "}
                <a href="#" className="text-primary">
                  shadcn/studio
                </a>
                , Made for better web design
              </p>
              <div className="flex items-center gap-5">
                <a href="#">
                  <GlobeIcon className="size-4" />
                </a>
                <a href="#">
                  <Share2Icon className="size-4" />
                </a>
                <a href="#">
                  <LinkIcon className="size-4" />
                </a>
                <a href="#">
                  <GlobeIcon className="size-4" />
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
