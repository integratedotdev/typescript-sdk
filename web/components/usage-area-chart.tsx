"use client";

import { Area } from "@/components/dither-kit/area";
import { AreaChart } from "@/components/dither-kit/area-chart";
import { Sparkline } from "@/components/dither-kit/sparkline";
import { Tooltip } from "@/components/dither-kit/tooltip";
import { XAxis } from "@/components/dither-kit/x-axis";
import { YAxis } from "@/components/dither-kit/y-axis";

export type UsagePoint = {
  day: string;
  requests: number;
};

export function UsageAreaChart({
  data,
  className,
}: {
  data: UsagePoint[];
  className?: string;
}) {
  if (!data.length) {
    return (
      <div className="border border-dashed border-border p-6 text-sm text-muted-foreground">
        No usage data yet.{" "}
        <Sparkline data={[2, 4, 3, 6, 5, 8, 7]} color="blue" bloom="low" />
      </div>
    );
  }

  return (
    <div className={className}>
      <AreaChart
        data={data}
        config={{
          requests: { label: "Requests", color: "blue" },
        }}
        bloom="low"
        className="h-56 w-full"
      >
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip labelKey="day" />
        <Area dataKey="requests" variant="hatched" />
      </AreaChart>
    </div>
  );
}
