import { Suspense } from "react";
import { NavActions } from "@/components/nav-actions";
import { OrganizationSettingsContent } from "@/components/organization-settings";
import { SettingsSkeleton } from "@/components/settings-skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  getActiveOrganization,
  getOrgAppConfig,
  getOrganizationMembers,
} from "@/lib/data/organization";
import { getServerPermissions } from "@/lib/data/permissions";

function OrganizationPageHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50">
      <div className="flex flex-1 items-center gap-2 px-6">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Organization</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto px-6">
        <NavActions />
      </div>
    </header>
  );
}

async function OrganizationPageContent() {
  const [initialOrg, initialAppConfig, initialMembers, permissions] =
    await Promise.all([
      getActiveOrganization(),
      getOrgAppConfig(),
      getOrganizationMembers(),
      getServerPermissions(),
    ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <OrganizationSettingsContent
        initialOrg={initialOrg}
        initialAppConfig={initialAppConfig}
        initialMembers={initialMembers}
        permissions={permissions}
      />
    </div>
  );
}

export default function OrganizationSettingsPage() {
  return (
    <>
      <OrganizationPageHeader />
      <Suspense fallback={<SettingsSkeleton />}>
        <OrganizationPageContent />
      </Suspense>
    </>
  );
}
