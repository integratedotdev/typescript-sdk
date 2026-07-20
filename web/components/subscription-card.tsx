"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { SubscriptionData } from "@/lib/data/dashboard-stats";

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const { plan, pricing, spendingCap, usagePercentage } = subscription;

  const usageColor =
    usagePercentage >= 90
      ? "bg-red-500"
      : usagePercentage >= 75
        ? "bg-yellow-500"
        : "bg-primary";

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Current Plan
        </CardTitle>
        <CardDescription>Your subscription details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold">{plan}</div>
            <p className="text-sm text-muted-foreground">{pricing}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spending Cap</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(spendingCap)}/mo
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Usage</span>
              <span className="font-medium tabular-nums">
                {usagePercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`${usageColor} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
