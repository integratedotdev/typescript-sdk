import { UsageSkeleton } from "@/components/usage-skeleton";

export default function UsageLoading() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50" />
      <UsageSkeleton />
    </>
  );
}
