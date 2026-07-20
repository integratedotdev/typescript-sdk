"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { OrganizationData } from "@/lib/data/organization";

interface DashboardShellProps {
  children: React.ReactNode;
  initialActiveOrg?: OrganizationData | null;
  initialOrganizations?: OrganizationData[];
}

export function DashboardShell({
  children,
  initialActiveOrg,
  initialOrganizations,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        initialActiveOrg={initialActiveOrg}
        initialOrganizations={initialOrganizations}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
