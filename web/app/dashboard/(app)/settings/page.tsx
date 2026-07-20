import { Suspense } from "react";
import { SettingsContent } from "@/components/settings-content";
import { SettingsSkeleton } from "@/components/settings-skeleton";
import { getApiKeys } from "@/lib/data/api-keys";
import { getServerPermissions } from "@/lib/data/permissions";
import { getBillingSettings } from "@/lib/data/settings";
import {
  getOrganizationMembers,
  getOrgMembersForSettings,
} from "@/lib/data/organization";

async function SettingsPageContent() {
  const [settings, permissions, apiKeys, orgMembers, membersForSettings] =
    await Promise.all([
      getBillingSettings(),
      getServerPermissions(),
      getApiKeys(),
      getOrganizationMembers(),
      getOrgMembersForSettings(),
    ]);

  return (
    <SettingsContent
      initialSettings={settings}
      initialApiKeys={apiKeys}
      initialMembers={membersForSettings}
      initialOrgMembers={orgMembers}
      permissions={permissions}
    />
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPageContent />
    </Suspense>
  );
}
