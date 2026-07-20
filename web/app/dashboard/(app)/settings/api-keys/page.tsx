import { Suspense } from "react";
import { NavActions } from "@/components/nav-actions";
import { ApiKeysContent } from "@/components/api-keys-settings";
import { ApiKeysTableSkeleton } from "@/components/api-keys-table-skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiKeys } from "@/lib/data/api-keys";
import { getServerPermissions } from "@/lib/data/permissions";

function ApiKeysPageHeader() {
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
              <BreadcrumbPage>API Keys</BreadcrumbPage>
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

function ApiKeysPageFallback() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Your API Keys</CardTitle>
          <CardDescription>Loading API keys...</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeysTableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

async function ApiKeysPageContent() {
  const [apiKeys, permissions] = await Promise.all([
    getApiKeys(),
    getServerPermissions(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ApiKeysContent
        initialKeys={apiKeys}
        canManageApiKeys={permissions.canManageApiKeys === true}
      />
    </div>
  );
}

export default function ApiKeysPage() {
  return (
    <>
      <ApiKeysPageHeader />
      <Suspense fallback={<ApiKeysPageFallback />}>
        <ApiKeysPageContent />
      </Suspense>
    </>
  );
}
