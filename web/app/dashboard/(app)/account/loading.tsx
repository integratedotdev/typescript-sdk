import { AccountSkeleton } from "@/components/account-skeleton";

export default function AccountLoading() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50" />
      <AccountSkeleton />
    </>
  );
}
