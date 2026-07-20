"use client";

import { useState, useEffect, useTransition } from "react";
import { FloatingSaveBar } from "@/components/floating-save-bar";
import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Users, Monitor, Sun, Moon, Palette } from "lucide-react";
import { OrgMembersTable } from "@/components/org-members-table";
import { ApiKeysContent } from "@/components/api-keys-settings";
import { useTheme } from "next-themes";
import { saveBillingSettings } from "@/lib/actions/settings";
import type { BillingSettings, Alert } from "@/lib/data/settings";
import type { ApiKeyRecord } from "@/lib/data/api-keys";
import type { OrgMember } from "@/lib/data/organization";
import type { ResolvedPermissions } from "@/lib/data/permissions";

interface SettingsContentProps {
  initialSettings: BillingSettings;
  initialApiKeys: ApiKeyRecord[];
  initialMembers: Array<{ email: string; name: string; role: string }>;
  initialOrgMembers: OrgMember[];
  permissions: ResolvedPermissions;
}

export function SettingsContent({
  initialSettings,
  initialApiKeys,
  initialMembers,
  initialOrgMembers,
  permissions,
}: SettingsContentProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [settings, setSettings] = useState(initialSettings);
  const [originalSettings, setOriginalSettings] = useState(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasInitializedOwner, setHasInitializedOwner] = useState(false);

  const orgMembers = initialMembers;

  useEffect(() => {
    if (
      !hasInitializedOwner &&
      orgMembers.length > 0 &&
      Object.keys(settings.notificationEmails).length === 0
    ) {
      const ownerMember = orgMembers.find((m) => m.role === "owner");
      if (ownerMember) {
        const initialEmails = { [ownerMember.email]: true };
        setSettings((prev) => ({ ...prev, notificationEmails: initialEmails }));
        setOriginalSettings((prev) => ({ ...prev, notificationEmails: initialEmails }));
        setHasInitializedOwner(true);
      }
    }
  }, [orgMembers, settings.notificationEmails, hasInitializedOwner]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    startTransition(async () => {
      const result = await saveBillingSettings(settings);
      if (result.success) {
        toast.success("Settings saved successfully!");
        setOriginalSettings(settings);
        setHasChanges(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleUndo = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const updateSetting = (
    key: string,
    value: string | Alert[] | Record<string, boolean>
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(originalSettings));
  };

  const updateAlert = (
    id: string,
    field: "percentage" | "enabled",
    value: number | boolean
  ) => {
    const newAlerts = settings.alerts.map((alert) =>
      alert.id === id ? { ...alert, [field]: value } : alert
    );
    updateSetting("alerts", newAlerts);
  };

  const toggleNotificationEmail = (email: string) => {
    const currentValue = settings.notificationEmails[email];
    if (currentValue === undefined) {
      updateSetting("notificationEmails", {
        ...settings.notificationEmails,
        [email]: true,
      });
    } else {
      updateSetting("notificationEmails", {
        ...settings.notificationEmails,
        [email]: !currentValue,
      });
    }
  };

  const canManageApiKeys = permissions.canManageApiKeys === true;
  const canManageBilling = permissions.canManageBilling === true;

  return (
    <>
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
                <BreadcrumbLink href="/dashboard/home">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-6">
          <NavActions />
        </div>
      </header>
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6">
        <div className="flex-1 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your spending alerts and account preferences
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {canManageApiKeys ? (
              <div id="api-keys">
                <ApiKeysContent
                  initialKeys={initialApiKeys}
                  canManageApiKeys={canManageApiKeys}
                />
              </div>
            ) : null}

            {canManageBilling ? (
              <>
                <Card id="spending-alerts" className="border-border/50">
                  <CardHeader>
                    <CardTitle>Spending Alerts</CardTitle>
                    <CardDescription>
                      Get notified when you reach certain spending thresholds
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {settings.alerts.map((alert, index) => (
                      <div key={alert.id}>
                        {index > 0 && <Separator className="mb-3" />}
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`alert-${alert.id}`}
                            checked={alert.enabled}
                            onCheckedChange={(checked) =>
                              updateAlert(alert.id, "enabled", checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`alert-${alert.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Alert me at {alert.percentage}% of spending cap
                          </label>
                        </div>
                      </div>
                    ))}
                    <p className="text-sm text-muted-foreground pt-2">
                      Receive email notifications when you reach these spending thresholds
                    </p>
                  </CardContent>
                </Card>

                <Card id="spending-cap" className="border-border/50">
                  <CardHeader>
                    <CardTitle>Spending Cap</CardTitle>
                    <CardDescription>
                      Set a maximum amount for monthly spending
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Field>
                      <FieldLabel htmlFor="spendingCap">
                        Monthly Spending Cap (USD)
                      </FieldLabel>
                      <Input
                        id="spendingCap"
                        type="number"
                        value={settings.spendingCap}
                        onChange={(e) => updateSetting("spendingCap", e.target.value)}
                        placeholder="500"
                        required
                        min="0"
                        step="1"
                      />
                      <FieldDescription>
                        API requests will be paused when this limit is reached. Set to 0 for unlimited spending.
                      </FieldDescription>
                    </Field>
                  </CardContent>
                </Card>

                <Card id="notifications" className="border-border/50">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose which organization members receive spending alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orgMembers.length > 0 ? (
                      <div className="space-y-3">
                        {orgMembers.map((member) => {
                          const isChecked =
                            settings.notificationEmails[member.email] === true;
                          return (
                            <div key={member.email} className="flex items-center space-x-3">
                              <Checkbox
                                id={`notify-${member.email}`}
                                checked={isChecked}
                                onCheckedChange={() =>
                                  toggleNotificationEmail(member.email)
                                }
                              />
                              <label
                                htmlFor={`notify-${member.email}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{member.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({member.email})
                                  </span>
                                  {member.role === "owner" ? (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                      Owner
                                    </span>
                                  ) : null}
                                </div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No organization members found. Alerts will be sent to the organization owner by default.
                      </p>
                    )}
                    <FieldDescription>
                      Spending alerts will be sent to all checked members when you reach configured spending thresholds. The organization owner is checked by default.
                    </FieldDescription>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </form>

          <Card id="appearance" className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="size-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the dashboard looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FieldLabel>Theme</FieldLabel>
                <div className="grid grid-cols-3 gap-3">
                  {(["system", "light", "dark"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary/50 ${
                        mounted && theme === value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border/50"
                      }`}
                    >
                      {value === "system" ? (
                        <Monitor className="size-6 text-muted-foreground" />
                      ) : value === "light" ? (
                        <Sun className="size-6 text-muted-foreground" />
                      ) : (
                        <Moon className="size-6 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium capitalize">{value}</span>
                    </button>
                  ))}
                </div>
                <FieldDescription>
                  Select your preferred theme. System will automatically switch based on your device settings.
                </FieldDescription>
              </div>
            </CardContent>
          </Card>

          <Card id="organization" className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Organization Management
              </CardTitle>
              <CardDescription>Manage members of your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <OrgMembersTable
                initialMembers={initialOrgMembers}
                canManageMembers={permissions.canManageMembers === true}
                canManageInvitations={permissions.canManageInvitations === true}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-3">On This Page</h3>
              <nav className="space-y-1">
                {canManageApiKeys ? (
                  <a
                    href="#api-keys"
                    className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                  >
                    API Keys
                  </a>
                ) : null}
                {canManageBilling ? (
                  <>
                    <a
                      href="#spending-alerts"
                      className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                    >
                      Spending Alerts
                    </a>
                    <a
                      href="#spending-cap"
                      className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                    >
                      Spending Cap
                    </a>
                    <a
                      href="#notifications"
                      className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                    >
                      Notification Preferences
                    </a>
                  </>
                ) : null}
                <a
                  href="#appearance"
                  className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  Appearance
                </a>
                <a
                  href="#organization"
                  className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  Organization Management
                </a>
              </nav>
            </div>
          </div>
        </aside>
      </div>

      <FloatingSaveBar
        hasChanges={hasChanges}
        onSave={() => handleSave()}
        onUndo={handleUndo}
        saveLabel={isPending ? "Saving..." : "Save"}
      />
    </>
  );
}
