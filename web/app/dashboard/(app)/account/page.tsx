import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AccountContent } from "@/components/account-content";
import { AccountSkeleton } from "@/components/account-skeleton";
import { getServerSession } from "@/lib/data/session";

async function AccountPageContent() {
  const session = await getServerSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  return (
    <AccountContent
      initialUser={{
        name: session.user.name || "",
        email: session.user.email || "",
      }}
    />
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountPageContent />
    </Suspense>
  );
}
