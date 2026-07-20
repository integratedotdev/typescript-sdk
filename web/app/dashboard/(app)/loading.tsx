import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export default function DashboardLoading() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50" />
      <DashboardSkeleton />
    </>
  );
}
