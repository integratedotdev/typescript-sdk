import { Activity } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function UsageTableEmpty() {
  return (
    <Empty className="border border-dashed border-border/50 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Activity />
        </EmptyMedia>
        <EmptyTitle>No usage data yet</EmptyTitle>
        <EmptyDescription>
          Your API requests will appear here once you start making calls.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
