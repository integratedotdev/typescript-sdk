"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { toast } from "sonner";
import { OrgMembersTable } from "@/components/org-members-table";
import { updateAppConfig, updateOrganization } from "@/lib/actions/organization";
import type { OrganizationData, OrgAppConfig, OrgMember } from "@/lib/data/organization";
import type { ResolvedPermissions } from "@/lib/data/permissions";

interface OrganizationSettingsContentProps {
  initialOrg: OrganizationData | null;
  initialAppConfig: OrgAppConfig;
  initialMembers: OrgMember[];
  permissions: ResolvedPermissions;
}

export function OrganizationSettingsContent({
  initialOrg,
  initialAppConfig,
  initialMembers,
  permissions,
}: OrganizationSettingsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [appConfigLoading, setAppConfigLoading] = useState(false);
  const [appConfig, setAppConfig] = useState(initialAppConfig);

  const canManageOrganization = permissions.canManageOrganization === true;

  const handleSaveAppConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppConfigLoading(true);
    startTransition(async () => {
      const result = await updateAppConfig(appConfig);
      setAppConfigLoading(false);
      if (result.success) {
        toast.success("App configuration saved");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleUpdateOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialOrg) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    startTransition(async () => {
      const result = await updateOrganization({ name, slug });
      if (result.success) {
        toast.success("Organization updated successfully");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  if (!initialOrg) {
    return (
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">No active organization found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">
          Manage your organization details and members
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Update your organization information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateOrganization} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Organization Name</FieldLabel>
              <Input
                id="name"
                name="name"
                defaultValue={initialOrg.name}
                required
                disabled={isPending || !canManageOrganization}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Organization Slug</FieldLabel>
              <Input
                id="slug"
                name="slug"
                defaultValue={initialOrg.slug}
                required
                disabled={isPending || !canManageOrganization}
                pattern="[a-z0-9-]+"
              />
              <FieldDescription>
                Used in URLs. Only lowercase letters, numbers, and hyphens.
              </FieldDescription>
            </Field>
            {canManageOrganization ? (
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Configuration</CardTitle>
          <CardDescription>
            Base URLs for your app used as the callback endpoint when trigger notifications are sent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveAppConfig} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="devUrl">Development URL</FieldLabel>
              <Input
                id="devUrl"
                name="devUrl"
                type="url"
                placeholder="http://localhost:3000"
                value={appConfig.devUrl}
                onChange={(e) => setAppConfig((c) => ({ ...c, devUrl: e.target.value }))}
                disabled={appConfigLoading || !canManageOrganization}
              />
              <FieldDescription>
                Used for trigger notifications in development. Usually{" "}
                <code>http://localhost:PORT</code>.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="prodUrl">Production URL</FieldLabel>
              <Input
                id="prodUrl"
                name="prodUrl"
                type="url"
                placeholder="https://myapp.com"
                value={appConfig.prodUrl}
                onChange={(e) => setAppConfig((c) => ({ ...c, prodUrl: e.target.value }))}
                disabled={appConfigLoading || !canManageOrganization}
              />
              <FieldDescription>
                Used for trigger notifications in production.
              </FieldDescription>
            </Field>
            {canManageOrganization ? (
              <Button type="submit" disabled={appConfigLoading || isPending}>
                {appConfigLoading ? "Saving..." : "Save Configuration"}
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>
            Manage who has access to this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrgMembersTable
            initialMembers={initialMembers}
            canManageMembers={permissions.canManageMembers === true}
            canManageInvitations={permissions.canManageInvitations === true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
