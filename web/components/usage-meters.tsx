"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gauge, TrendingUp, AlertCircle } from "lucide-react";
import type { PolarMeter } from "@/lib/data/dashboard-stats";

interface UsageMetersProps {
  meters: PolarMeter[];
}

export function UsageMeters({ meters }: UsageMetersProps) {
  const getUsagePercentage = (consumed: number, credited: number) => {
    if (credited === 0) return 0;
    return Math.min((consumed / credited) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "text-green-500";
    if (percentage < 80) return "text-yellow-500";
    return "text-red-500";
  };

  const getBalanceVariant = (balance: number) => {
    if (balance > 0) return "default";
    if (balance === 0) return "secondary";
    return "destructive";
  };

  if (!Array.isArray(meters) || meters.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Gauge className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Usage Meters Yet</h3>
          <p className="text-sm text-muted-foreground">
            Usage meters will appear here once you start tracking usage-based billing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meters.map((customerMeter) => {
        const percentage = getUsagePercentage(
          customerMeter.consumedUnits,
          customerMeter.creditedUnits
        );

        return (
          <Card key={customerMeter.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {customerMeter.meter?.name || "Usage Meter"}
                </CardTitle>
                <TrendingUp className={`h-4 w-4 ${getUsageColor(percentage)}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {customerMeter.consumedUnits.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {customerMeter.creditedUnits.toLocaleString()}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {percentage.toFixed(1)}% used
                  </span>
                  <Badge variant={getBalanceVariant(customerMeter.balance)}>
                    Balance: {customerMeter.balance.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function UsageMetersError({ message }: { message: string }) {
  return (
    <Card className="border-destructive">
      <CardContent className="flex items-center gap-2 p-6">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <p className="text-sm text-destructive">{message}</p>
      </CardContent>
    </Card>
  );
}
