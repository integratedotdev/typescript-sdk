import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { NavActions } from "@/components/nav-actions";
import { SubscriptionCard } from "@/components/subscription-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Activity, Settings, BarChart3, Book } from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/data/dashboard-stats";
import { getServerSession } from "@/lib/data/session";

function DashboardPageHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-dashed border-border">
      <div className="flex flex-1 items-center gap-2 px-6">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 font-medium">
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto px-6">
        <NavActions />
      </div>
    </header>
  );
}

async function DashboardPageContent() {
  const session = await getServerSession();
  const stats = await getDashboardStats();

  const totalRequests =
    stats.meters.length > 0
      ? stats.meters.reduce((total, meter) => total + (meter.consumedUnits || 0), 0)
      : 0;

  const successRate =
    stats.summary && stats.summary.totalRequests > 0
      ? `${((stats.summary.successfulRequests / stats.summary.totalRequests) * 100).toFixed(1)}%`
      : "—";

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your API usage and account status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Spend
            </CardTitle>
            <div className="rounded-md bg-muted p-2">
              <DollarSign className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              ${(stats.subscription.currentSpend / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current billing period
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              API Requests
            </CardTitle>
            <div className="rounded-md bg-muted p-2">
              <Activity className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {totalRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
            <div className="rounded-md bg-muted p-2">
              <TrendingUp className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{successRate}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful requests this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button className="w-full justify-start h-10" variant="outline" asChild>
              <Link href="/dashboard/usage">
                <BarChart3 className="mr-3 size-4" />
                View Usage Details
              </Link>
            </Button>
            <Button className="w-full justify-start h-10" variant="outline" asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-3 size-4" />
                Configure Settings
              </Link>
            </Button>
            <Button className="w-full justify-start h-10" variant="outline" asChild>
              <a href="/docs" rel="noopener noreferrer">
                <Book className="mr-3 size-4" />
                Documentation
              </a>
            </Button>
          </CardContent>
        </Card>

        <SubscriptionCard subscription={stats.subscription} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <DashboardPageHeader />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardPageContent />
      </Suspense>
    </>
  );
}
