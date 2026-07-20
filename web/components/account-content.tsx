"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FloatingSaveBar } from "@/components/floating-save-bar";
import { NavActions } from "@/components/nav-actions";
import { signOut } from "@/lib/auth-client";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { deleteAccount } from "@/lib/actions/account";

interface AccountContentProps {
  initialUser: {
    name: string;
    email: string;
  };
}

export function AccountContent({ initialUser }: AccountContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [accountData, setAccountData] = useState({
    name: initialUser.name,
    email: initialUser.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [originalData, setOriginalData] = useState({
    name: initialUser.name,
    email: initialUser.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      if (
        accountData.name !== originalData.name ||
        accountData.email !== originalData.email
      ) {
        const response = await fetch("/dashboard/api/auth/update-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: accountData.name,
            email: accountData.email,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        router.refresh();
      }

      if (accountData.newPassword) {
        if (accountData.newPassword !== accountData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        if (accountData.newPassword.length < 8) {
          toast.error("Password must be at least 8 characters long");
          return;
        }

        if (!accountData.currentPassword) {
          toast.error("Current password is required");
          return;
        }

        if (accountData.currentPassword === accountData.newPassword) {
          toast.error("New password must be different from current password");
          return;
        }

        const { error } = await authClient.changePassword({
          newPassword: accountData.newPassword,
          currentPassword: accountData.currentPassword,
          revokeOtherSessions: true,
        });

        if (error) {
          if (error.message?.toLowerCase().includes("current password")) {
            throw new Error("Current password is incorrect");
          }
          throw new Error(error.message || "Failed to update password");
        }

        toast.success("Password changed successfully!", {
          description: "All other sessions have been logged out for security.",
        });

        setAccountData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }

      toast.success("Account settings updated successfully!");
      const newOriginalData = {
        ...accountData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      setOriginalData(newOriginalData);
      setHasChanges(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update account settings";
      toast.error(message);
    }
  };

  const handleUndo = () => {
    setAccountData(originalData);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      const result = await deleteAccount();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Account deleted successfully");
      await signOut();
      router.push("/dashboard/login");
    });
  };

  const updateField = (field: string, value: string) => {
    const newData = { ...accountData, [field]: value };
    setAccountData(newData);
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalData));
  };

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
                <BreadcrumbPage className="font-medium">Account</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your personal account settings and preferences
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <Card id="profile" className="border-border/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    value={accountData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="John Doe"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={accountData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                  <FieldDescription>
                    This email is used for login and notifications
                  </FieldDescription>
                </Field>
              </CardContent>
            </Card>

            <Card id="password" className="border-border/50">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={accountData.currentPassword}
                    onChange={(e) => updateField("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    value={accountData.newPassword}
                    onChange={(e) => updateField("newPassword", e.target.value)}
                    placeholder="Enter new password"
                  />
                  <FieldDescription>
                    Must be at least 8 characters long
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={accountData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                  />
                </Field>
                <FieldDescription className="pt-2">
                  Changing your password will log you out of all other sessions for security.
                </FieldDescription>
              </CardContent>
            </Card>

            <Card id="danger-zone" className="border-border/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-destructive/50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="ml-4">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all of your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                          >
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-3">On This Page</h3>
              <nav className="space-y-1">
                <a
                  href="#profile"
                  className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  Profile Information
                </a>
                <a
                  href="#password"
                  className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  Change Password
                </a>
                <a
                  href="#danger-zone"
                  className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  Danger Zone
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
