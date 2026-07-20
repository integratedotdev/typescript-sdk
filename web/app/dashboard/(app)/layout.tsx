import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveOrganization, getUserOrganizations } from "@/lib/data/organization";
import { getServerSession } from "@/lib/data/session";

function DashboardLayoutFallback({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <aside className="flex h-svh w-64 flex-col border-r border-border/50 bg-sidebar">
        <div className="flex h-14 items-center gap-2 px-4">
          <Skeleton className="size-8 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
      </aside>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

async function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const [initialActiveOrg, initialOrganizations] = await Promise.all([
    getActiveOrganization(),
    getUserOrganizations(),
  ]);

  return (
    <DashboardShell
      initialActiveOrg={initialActiveOrg}
      initialOrganizations={(initialOrganizations || []) as Parameters<
        typeof DashboardShell
      >[0]["initialOrganizations"]}
    >
      {children}
    </DashboardShell>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutFallback>{children}</DashboardLayoutFallback>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
