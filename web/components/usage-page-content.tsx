"use client";

import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Activity, CheckCircle, XCircle } from "lucide-react";
import { UsageMeters } from "@/components/usage-meters";
import { UsageAreaChart } from "@/components/usage-area-chart";
import { UsageTableEmpty } from "@/components/empty-states/usage-table-empty";
import type { UsagePageData } from "@/lib/data/usage";

interface UsagePageContentProps {
  data: UsagePageData;
}

export function UsagePageContent({ data }: UsagePageContentProps) {
  const { records, summary, meters } = data;

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusBadge = (statusCode: number) => {
    const isSuccess = statusCode >= 200 && statusCode < 300;
    return (
      <Badge
        variant={isSuccess ? "default" : "destructive"}
        className={isSuccess ? "bg-green-500 hover:bg-green-600" : ""}
      >
        {statusCode}
      </Badge>
    );
  };

  const emptySummary = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalSpent: 0,
  };

  const displaySummary = summary ?? emptySummary;

  const chartData = (() => {
    const byDay = new Map<string, number>();
    for (const record of records) {
      const day = new Date(record.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
    return Array.from(byDay.entries())
      .map(([day, requests]) => ({ day, requests }))
      .reverse()
      .slice(-14);
  })();

  return (
    <>
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
                <BreadcrumbLink href="/dashboard/home">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Usage</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-6">
          <NavActions />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
          <p className="text-muted-foreground">
            View your API request history and current usage statistics
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Usage Meters</h3>
          <UsageMeters meters={meters} />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Requests (recent)</h3>
          <UsageAreaChart data={chartData} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">API Request History</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
              <div className="rounded-md bg-muted p-2">
                <Activity className="size-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displaySummary.totalRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This billing period</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Successful
              </CardTitle>
              <div className="rounded-md bg-green-500/10 p-2">
                <CheckCircle className="size-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displaySummary.successfulRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {displaySummary.totalRequests > 0
                  ? `${((displaySummary.successfulRequests / displaySummary.totalRequests) * 100).toFixed(1)}% success rate`
                  : "No requests yet"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Failed
              </CardTitle>
              <div className="rounded-md bg-red-500/10 p-2">
                <XCircle className="size-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displaySummary.failedRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {displaySummary.totalRequests > 0
                  ? `${((displaySummary.failedRequests / displaySummary.totalRequests) * 100).toFixed(1)}% failure rate`
                  : "No requests yet"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cost
              </CardTitle>
              <div className="rounded-md bg-muted p-2">
                <DollarSign className="size-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(displaySummary.totalSpent / 10000).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                $0.20 per 1,000 requests
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border border-border/50 overflow-hidden">
          {records.length === 0 ? (
            <UsageTableEmpty />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-xs">
                      {formatTimestamp(record.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.method}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {record.endpoint}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.statusCode)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.responseTime}ms
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {record.responseSize
                        ? `${(record.responseSize / 1024).toFixed(2)} KB`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}
