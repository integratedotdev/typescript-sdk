import { Suspense } from "react";
import { UsagePageContent } from "@/components/usage-page-content";
import { UsageSkeleton } from "@/components/usage-skeleton";
import { getUsagePageData } from "@/lib/data/usage";

async function UsagePageData() {
  const data = await getUsagePageData(50);
  return <UsagePageContent data={data} />;
}

export default function UsagePage() {
  return (
    <Suspense fallback={<UsageSkeleton />}>
      <UsagePageData />
    </Suspense>
  );
}
